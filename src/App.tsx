import { useState, useEffect } from "react";
import Board from "./Components/Board";

declare global {
  interface Window {
    electronAPI: {
      onClipboardChanged: (listener: (text: string) => void) => void;
      clearClipboardContent: () => void;
    };
  }
}

function App() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const handleClipboardChange = (text: string) => {
      setItems((prevItems) => {
        if (prevItems.includes(text)) {
          return prevItems;
        }
        return [...prevItems, text];
      });
    };

    window.electronAPI.onClipboardChanged(handleClipboardChange);

    return () => {
      window.electronAPI.onClipboardChanged(() => {});

      setItems([]);
      console.log("App unmounted");
    };
  }, []);

  const clearClipboard = () => {
    window.electronAPI.clearClipboardContent();
    setItems([]);
  };

  return <Board items={items} clearClipboard={clearClipboard} />;
}

export default App;
