import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [prompt, updatePrompt] = React.useState(undefined);
  const [loading, setLoading] = React.useState(false);
  const [answer, setAnswer] = React.useState(undefined);

  React.useEffect(() => {
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

      const { message } = await res.json();
      console.log(message);
      setAnswer(message);
    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
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

export default App;
