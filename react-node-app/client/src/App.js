import "./App.css";
import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };
      const res = await fetch("/ask", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message, all } = await res.json();
      setAnswer(message);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  const fileUpload = FileUploadSingle(prompt);

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <div>{fileUpload}</div>
          <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything..."
            disabled={loading}
            style={{}}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <p>{!data ? "Loading..." : data}</p>
          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
        </div>
      </div>
    </div>
  );
}

function FileUploadSingle(prompt) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    console.log("handleSubmit clicked");
    event.preventDefault();
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          body: prompt,
        },
      });

      console.log("::response.data:::");
      console.log(response.data);
      setText(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" name="pdf" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {text && <p>{text}</p>}
    </div>
  );
}

function FileUploadSingleReturnText1() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    console.log("handleSubmit clicked");
    event.preventDefault();
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("::response.data:::");
      console.log(response.data);
      setText(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return text;
}

function FileUploadSingle2() {
  const [file, setFile] = useState(undefined);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    console.log("Run Upload");
    if (!file) {
      console.log("no file");
      return;
    }

    // 👇 Uploading the file using the fetch API to the server
    fetch("/upload", {
      method: "POST",
      body: file,
      // 👇 Set headers manually for single file upload
      headers: {
        "content-type": file.type,
        "content-length": `${file.size}`, // 👈 Headers need to be a string
      },
    })
      .then((res) => {
        console.log("res.json");
        res.json();
      })
      .then((data) => {
        console.log("data:");
        console.log(data);
      })
      .catch((err) => {
        console.error("error:");
        console.error(err);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      <div>{file && `${file.name} - ${file.type}`}</div>

      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
}

export default App;
