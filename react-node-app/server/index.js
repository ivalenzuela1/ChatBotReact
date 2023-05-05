require("dotenv").config();
const path = require("path");
const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(`Your api key is ${process.env.OPENAI_API_KEY}`);

const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 3001;
const upload = multer({});
const uploadPdf = upload.single("pdf");

const app = express();
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Handle GET requests to /new route
app.get("/new", (req, res) => {
  res.json({ message: "Hello from a different api!" });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/upload", uploadPdf, (req, res) => {
  const buffer = req.file.buffer;
  pdf(buffer).then((data) => {
    res.send(data.text);
  });
});

app.post("/upload22", (req, res, next) => {
  let uploadFile = req.body.file;
  const fileName = req.body;
  console.log("Uploaded file");
  console.log(fileName);

  /*
  uploadFile.mv(
    `${__dirname}/public/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }
      res.json({
        file: `public/${req.files.file.name}`,
      })
    },
  )
  */
});

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion createChatCompletion
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 1000,
    });
    // retrieve the completion text from response
    const completion = response.data.choices[0].text;
    return res.status(200).json({
      success: true,
      message: completion,
      all: response.data.choices,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
