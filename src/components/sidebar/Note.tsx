'use client';

import styles from './Note.module.css';

interface NoteProps {
  children: React.ReactNode;
}

export function Note({ children }: NoteProps) {
  return <div className={styles.note}>{children}</div>;
}

