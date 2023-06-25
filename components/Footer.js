import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <a className="plainlink" href="https://github.com/juhis/lounas">
          GitHub
        </a>
      </footer>
    </>
  );
}
