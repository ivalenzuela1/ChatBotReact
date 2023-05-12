/*
import { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState(undefined);

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
      setAnswer(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  // <button type="submit">Submit</button>
  return (
    <div className="submit-form">
      <form onSubmit={handleSubmit}>
        <input type="file" name="pdf" onChange={handleChange} />
      </form>
      {text && <p>{text}</p>}
    </div>
  );
}

export default FileUpload;

*/

/*
 <form onSubmit={handleSubmit}>
        <input type="file" name="pdf" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <IoIosAttach />
      {text && <p>{text}</p>}
      <div>test</div>


      <div>
      <input type="file" name="pdf" onChange={handleChange} />
      <button onClick={handleSubmit}>Search</button>
    </div>
      */
