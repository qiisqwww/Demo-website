import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IRefill } from "../../interfaces/refill";
import { useEffect, useState } from "react";
import { IProfileData } from "../../interfaces/profile";
import { getAxiosInstance } from "../../scripts/axiosInstance";
import { IListRefills } from "../../interfaces/lastRefills";

export default function Refill() {
  const { id } = useParams();
  const [isExist, setIsExist] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastRefills, setLastRefills] = useState<IListRefills[]>([]);
  const [isCharging, setIsCharging] = useState(false);
  const [refill, setRefill] = useState<IRefill>({
    address: "",
    power: 0,
    is_active: false,
  });
  const axiosInstance = getAxiosInstance();
  const navigate = useNavigate();

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

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get<IProfileData>(
        `${import.meta.env.VITE_API_URL}/profile/me`
      );
      if (response.data.role === "admin") {
        setIsAdmin(true);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      // setInitLoading(false);
    }
  };

  const deleteRefill = async () => {
    try {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/refill/delete`,
        {
          data: {
            refill_id: id,
          },
        }
      );
      if (response.status === 200) {
        navigate("/refills");
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const charge = async () => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/refill/rent/start`,
        {
          refill_id: id,
        }
      );
      if (response.status === 200) {
        setIsCharging(true);
        setLastRefills([response.data, ...lastRefills]);
      }
    } catch (e: unknown) {
      console.error(e);
      console.log();
    }
  };

  const finish = async () => {
    try {
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_API_URL}/refill/rent/finish`,
        {
          refill_rent_id: lastRefills[0].id,
        }
      );
      if (response.status === 200) {
        setIsCharging(false);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const getLastCharges = async () => {
    try {
      const response = await axiosInstance.get<IListRefills[]>(
        `${import.meta.env.VITE_API_URL}/refill/rent/last`
      );
      const data = response.data;
      console.log(data);

      setLastRefills(data);

      if (data[0]?.refill_id === Number(id) && data[0]?.time_end === null) {
        setIsCharging(true);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRefill();
    fetchUser();
    getLastCharges();
  }, []);

  return (
    <>
      {isAdmin && <button onClick={() => deleteRefill()}>Delete</button>}
      {isExist ? (
        <div>
          <p>address: {refill.address}</p>
          <p>power: {refill.power}</p>
          {refill.is_active ? <p>active</p> : <p>inacive</p>}
          {isCharging ? (
            <button onClick={() => finish()}>Остановиться</button>
          ) : (
            <button onClick={() => charge()}>Зарядиться</button>
          )}
        </div>
      ) : (
        <p>refill doesn't exist</p>
      )}
    </>
  );
}
