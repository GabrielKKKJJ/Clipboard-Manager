import React from "react";
import styles from "./styles.module.css";
import Item from "../Item";

interface BoardProps {
  items: string[];
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const Board: React.FC<BoardProps> = ({ items }) => {
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
    </div>
  );
};

export default Board;
