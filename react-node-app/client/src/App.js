import "./App.css";
import { useState, useEffect } from "react";
import { IoIosAttach } from "react-icons/io";
import axios from "axios";

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(undefined);
  const [file, setFile] = useState(null);
  const [isFileUploadOpen, setFileUploadOpen] = useState(false);
  const [text, setText] = useState(undefined);
  const [placeholder, setPlaceholder] = useState("Ask me anything....");

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer(undefined);
    }
  }, [prompt]);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setPlaceholder(() => "Ask me anything about the attached document...");
  };

  const sendPrompt = async (event) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };

      if (file) {
        console.log("Use file!!");
        console.log(file);

        event.preventDefault();
        const formData = new FormData();
        formData.append("pdf", file);
        try {
          const response = await axios.post("/extract", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setText(response.data.text);
          const newBody = {
            prompt: prompt,
            text: response.data.text,
          };
          requestOptions["body"] = JSON.stringify(newBody);
        } catch (error) {
          console.log("THIS IS AN ERROR");
          console.error(error);
        }
      }

      //  requestOptions["fileText"] = text;

      console.log("this is the request");
      const res = await fetch("/ask", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await res.json();
      setAnswer(message);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async () => {
    setFileUploadOpen((isFileUploadOpen) => {
      setPlaceholder(() => "Ask me anything...");
      return !isFileUploadOpen;
    });
  };

  // var fileOpenHtml = isFileUploadOpen ? fileUpload(prompt) : ""
  //<div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
  // <p>{!answer ? "Loading..." : answer}</p>
  //<div>{fileOpenHtml}</div>
  //<div>{fileUpload(prompt)}</div>
  // <div>{fileOpenHtml}</div>
  // {text && <p>{text}</p>}

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <div className="answer-container">{answer}</div>
          <div className="prompt-container">
            <input
              type="text"
              className="spotlight__input"
              placeholder={placeholder}
              disabled={loading}
              style={{}}
              onChange={(e) => updatePrompt(e.target.value)}
              onKeyDown={(e) => sendPrompt(e)}
            />
            <IoIosAttach className="attach-icon" onClick={toggle} />
          </div>
          {isFileUploadOpen && (
            <div className="submit-form">
              <form>
                <input type="file" name="pdf" onChange={handleChange} />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
