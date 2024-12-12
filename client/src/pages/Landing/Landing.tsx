import { Link } from "react-router-dom";
import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <section>
      <Link to="/refills" className={styles.button}>
        Воспользоваться зарядной станцией
      </Link>
    </section>
  );
}
