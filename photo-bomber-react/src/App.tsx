import React, { useState, ChangeEvent, useEffect } from "react";
import "./App.css";
import { publicIpv4 } from "public-ip";

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  input: {
    margin: "20px",
  },
  photo: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    margin: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
  },
};

const App: React.FC = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Idle");

  const [backendUrl, setBackendUrl] = useState<string | null>(null);

  // Fetch the backend URL from the file
  useEffect(() => {
    const getBackendUrl = async () => {
      try {
        const response = await fetch("/backend-url.txt");
        const url = await response.text();
        setBackendUrl(url.trim());
      } catch (error) {
        console.error("Error fetching backend URL:", error);
      }
    };

    getBackendUrl();
  }, []);

  const handlePhotoCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setPhoto(file);
    }
  };

  const uploadPhotoToDrive = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("file", photo);

    try {
      const request = fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "bypass-tunnel-reminder": "any-value",
        },
      });
      setStatus("pending");
      await request;
      setStatus("sent");
      // alert("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus(`fucked up: ${error}`);
      // alert("Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept="image/*"
        capture={true}
        onChange={handlePhotoCapture}
        style={styles.input}
      />
      {photo && (
        <img
          src={URL.createObjectURL(photo)}
          alt="Captured"
          style={styles.photo}
        />
      )}
      <button onClick={uploadPhotoToDrive} style={styles.button}>
        Upload Photo to Google Drive
      </button>
      {status}
    </div>
  );
};

export default App;
