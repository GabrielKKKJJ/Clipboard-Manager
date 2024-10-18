import styles from "./styles.module.css";
import Item from "../Item";

interface BoardProps {
  items: string[];
  clearClipboard: () => void;
}

const formatDate = (date: Date) => {
  const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `${timeFormatter.format(date)} ${dateFormatter.format(date)}`;
};

function Board({ items, clearClipboard }: BoardProps) {
  return (
    <div className={styles.board}>
      <h1 className={styles.boardTitle}>CLIPBOARD</h1>
      <div className={styles.container}>
        {items
          .slice()
          .reverse()
          .map((item, index) => (
            <Item
              key={index}
              description={item}
              timestamp={formatDate(new Date())}
            />
          ))}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={clearClipboard} className={styles.button}>
          clear
        </button>
      </div>
    </div>
  );
}

export default Board;
