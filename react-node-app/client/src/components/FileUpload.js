import { useState } from "react";
import axios from "axios";

function FileUpload(prompt) {
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

export default FileUpload;
