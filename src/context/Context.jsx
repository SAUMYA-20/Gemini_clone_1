// Context.jsx
import { createContext, useState, useEffect } from "react";
import main from "../config/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState(localStorage.getItem("recentPrompt") || "");
  const [prevPrompts, setPrevPrompts] = useState(() => {
    const stored = localStorage.getItem("prevPrompts");
    return stored ? JSON.parse(stored) : [];
  });

  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [abortController, setAbortController] = useState(null);

  useEffect(() => {
    localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
  }, [prevPrompts]);

  useEffect(() => {
    localStorage.setItem("recentPrompt", recentPrompt);
  }, [recentPrompt]);

  const simulateTyping = async (text, delay = 10, signal) => {
    let result = "";
    let timeoutIds = [];

    return new Promise((resolve) => {
      const typeChar = (index) => {
        if (signal.aborted) {
          timeoutIds.forEach(clearTimeout);
          console.log("Typing simulation stopped");
          resolve();
          return;
        }

        if (index >= text.length) {
          resolve();
          return;
        }

        result += text[index];
        setResultData(result);

        const id = setTimeout(() => {
          typeChar(index + 1);
        }, delay);

        timeoutIds.push(id);
      };

      typeChar(0);
    });
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt, fromSidebar = false) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    const finalPrompt = prompt || input;
    if (!finalPrompt.trim()) return;

    const controller = new AbortController();
    const { signal } = controller;
    setAbortController(controller);

    if (!fromSidebar) {
      setPrevPrompts((prev) => [...prev, finalPrompt]);
    }

    setRecentPrompt(finalPrompt);

    try {
      const response = await main(finalPrompt, { signal });

      let formatted = response
        .split("**").map((part, i) => i % 2 ? `<b>${part}</b>` : part).join("")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/^### (.*)$/gm, "<h3>$1</h3>")
        .replace(/^## (.*)$/gm, "<h2>$1</h2>")
        .replace(/^# (.*)$/gm, "<h1>$1</h1>")
        .replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>")
        .replace(/(<li>.*?<\/li>)/gms, "<ul>$1</ul>")
        .replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n/g, "<br />");

      await simulateTyping(formatted, 10, signal);
    } catch (error) {
      if (signal.aborted) {
        console.log("Request was aborted.");
        setResultData("");
      } else {
        console.error("Error processing response:", error);
        setResultData("An error occurred while processing your request.");
      }
    } finally {
      setLoading(false);
      setInput("");
      setAbortController(null);
    }
  };

  return (
    <Context.Provider
      value={{
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        prevPrompts,
        setPrevPrompts,
        showResult,
        loading,
        resultData,
        onSent,
        newChat,
        abortController,
        setAbortController,
        setLoading,
        setResultData,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
