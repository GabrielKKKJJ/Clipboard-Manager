import { useState, useEffect } from "react";
import Board from "./Components/Board";

declare global {
  interface Window {
    electronAPI: {
      onClipboardChanged: (listener: (text: string) => void) => void;
    };
  }
}

function App() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const handleClipboardChange = (text: string) => {
      setItems((prevItems) => {
        // Verifica se o item já está na lista
        if (prevItems.includes(text)) {
          return prevItems;
        }
        return [...prevItems, text];
      });
    };

    window.electronAPI.onClipboardChanged(handleClipboardChange);

    return () => {
      // Limpar listener quando o componente for desmontado
      window.electronAPI.onClipboardChanged(() => {});
    };
  }, []);

  return <Board items={items} />;
}

export default App;
