import { useRef } from "react";
import styles from "./styles.module.css";

interface ItemProps {
  description: string;
  timestamp: string;
}

export default function Item({ description, timestamp }: ItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  const onClick = () => {
    navigator.clipboard.writeText(description);

    if (itemRef.current) {
      itemRef.current.classList.add(styles.containerItemCopied);
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.classList.remove(styles.containerItemCopied);
        }
      }, 1000);
    }
  };

  if (description != "") {
    return (
      <div className={styles.containerItem} ref={itemRef} onClick={onClick}>
        <div className={styles.content}>
          <p className={styles.label}>📋 {description}</p>
        </div>
        <p className={styles.timestamp}>{timestamp}</p>
      </div>
    );
  }
}
