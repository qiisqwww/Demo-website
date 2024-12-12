import styles from "./Header.module.css";
import Logo from "../../assets/Logo.svg";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { IProfileData } from "../../interfaces/profile";
import { useEffect } from "react";
import { getAxiosInstance } from "../../scripts/axiosInstance";

export default function Header() {
  const { user, login } = useUser();
  const axiosInstance = getAxiosInstance();

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get<IProfileData>(
        `${import.meta.env.VITE_API_URL}/profile/me`
      );
      login(response.data.username);
    } catch (e: unknown) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/">
        <img src={Logo} alt="logo"></img>
      </Link>
      <div>
        {user ? (
          <Link to="/me" style={{ color: "#fff" }}>
            {user.username}
          </Link>
        ) : (
          <Link to="/login" className={styles.login}>
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
