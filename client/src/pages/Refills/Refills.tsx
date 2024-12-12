import { List } from "antd";
import styles from "./Refills.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { IRefill } from "../../interfaces/refill";
import { useNavigate } from "react-router-dom";

export default function Refills() {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<IRefill[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setInitLoading(true);
      const response = await axios.get<IRefill[]>(
        `${import.meta.env.VITE_API_URL}/refill/all`
      );

      setData(response.data);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className={styles.page}>
      <h2>Зарядные станции</h2>
      <List
        className={styles.list}
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={data}
        split={false}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <p>Станция №{item.id}</p>
            <p>{item.address}</p>
            <p>{item.power}W</p>
            {item.is_active ? (
              <p className={styles.active}>Активна</p>
            ) : (
              <p className={styles.inactive}>Неактивна</p>
            )}
            <button onClick={() => navigate(`/refill/${item.id}`)}>
              перейти
            </button>
          </List.Item>
        )}
      />
    </section>
  );
}
