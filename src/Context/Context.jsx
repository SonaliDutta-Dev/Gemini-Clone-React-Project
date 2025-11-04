import { createContext, useState, useEffect } from "react";
import { run } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState(() => {
    const stored = localStorage.getItem("prevPrompts");
    return stored ? JSON.parse(stored) : [];
  });
  const [showResult, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // save to localStorage whenever prompts update
  useEffect(() => {
    localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
  }, [prevPrompts]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResults(true);

    let finalPrompt = prompt ?? input; // use whichever is available

    // ✅ only add if not already in list
    setPrevPrompts((prev) => {
      if (!prev.includes(finalPrompt)) {
        return [...prev, finalPrompt];
      }
      return prev;
    });

    setRecentPrompt(finalPrompt);

    const response = await run(finalPrompt);

    let resArray = response.split("**");
    let formattedResponse = "";
    for (let i = 0; i < resArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        formattedResponse += resArray[i];
      } else {
        formattedResponse += "<b>" + resArray[i] + "</b>";
      }
    }

    let newResponse = formattedResponse.split("*").join("</br>");
    let words = newResponse.split(" ");
    for (let i = 0; i < words.length; i++) {
      const nextWord = words[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    input,
    setInput,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResults,
    loading,
    resultData,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
