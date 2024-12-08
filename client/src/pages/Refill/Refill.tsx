import axios from "axios";
import { useParams } from "react-router-dom";
import { IRefill } from "../../interfaces/refill";
import { useEffect, useState } from "react";

export default function Refill() {
  const { id } = useParams();
  const [isExist, setIsExist] = useState(true);
  const [refill, setRefill] = useState<IRefill>({
    address: "",
    power: 0,
    is_active: false,
  });

  const fetchRefill = async () => {
    try {
      const response = await axios.get<IRefill>(
        `${import.meta.env.VITE_API_URL}/refill/info`,
        {
          params: {
            refill_id: id,
          },
        }
      );
      setRefill(response.data);
    } catch (e: unknown) {
      console.error(e);
      setIsExist(false);
    } finally {
      // setInitLoading(false);
    }
  };

  useEffect(() => {
    fetchRefill();
  }, []);

  return (
    <>
      {isExist ? (
        <div>
          <p>address: {refill.address}</p>
          <p>power: {refill.power}</p>
          {refill.is_active ? <p>active</p> : <p>inacive</p>}
        </div>
      ) : (
        <p>refill doesn't exist</p>
      )}
    </>
  );
}
