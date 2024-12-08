import { List } from "antd";
import styles from "./Refills.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { IRefill } from "../../interfaces/refill";

export default function Refills() {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState<IRefill[]>([]);

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
    <div>
      <List
        className={styles.list}
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <p>{item.address}</p>
            <p>{item.power}</p>
            <p>{item.id}</p>
          </List.Item>
        )}
      />
    </div>
  );
}
