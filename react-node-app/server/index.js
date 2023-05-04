require("dotenv").config();
const path = require("path");
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 3001;

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

app.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion createChatCompletion
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });
    // retrieve the completion text from response
    const completion = response.data.choices[0].text;
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

/*
let key = "no data";
fs.readFile("/Users/ivalenzuela/Desktop/react_key.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  key = data;
});

console.log("THIS IS THE KEY");
console.log(key);
*/
