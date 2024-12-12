import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./Profile.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Input, List, message, Modal, Radio, Upload } from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CustomModal from "../../components/CustomModal/CustomModal";
import { RcFile } from "antd/es/upload";
import ImgCrop from "antd-img-crop";
import { IRefill } from "../../interfaces/refill";
import { getAxiosInstance } from "../../scripts/axiosInstance";
import { IProfileData } from "../../interfaces/profile";
import { IListRefills } from "../../interfaces/lastRefills";
import { useUser } from "../../context/UserContext";

export default function Profile() {
  const { login, logout } = useUser();
  const [isLogged, setIsLogged] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const [age, setAge] = useState(0);
  const [user, setUser] = useState<IProfileData>({
    username: "",
    email: "",
    birthdate: dayjs(),
    photo_url: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [addRefillModal, setAddRefillModal] = useState(false);
  const [lastCharges, setlastCharges] = useState<IListRefills[]>([]);
  const [form] = Form.useForm();
  const axiosInstance = getAxiosInstance();
  const navigate = useNavigate();

  const changePhoto = async (file: RcFile): Promise<void> => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_image", file);
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_API_URL}/profile/edit/avatar`,
        formData
      );
      setUser(response.data);
    } catch (error: unknown) {
      const e = error as AxiosError;
      if (e.request.status === 422) {
        const m = JSON.parse(e.request.response);
        message.error(m.detail);
      }
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("Image must smaller than 10MB!");
    }
    if (isJpgOrPng && isLt2M) {
      changePhoto(file);
    }
    return false;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IProfileData>(
        `${import.meta.env.VITE_API_URL}/profile/me`
      );
      setUser(response.data);
      login(response.data.username);
      console.log(user.birthdate);
      setAge(dayjs().diff(user.birthdate, "year"));
    } catch (e: unknown) {
      logout();
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastRefills = async () => {
    try {
      const response = await axiosInstance.get<IListRefills[]>(
        `${import.meta.env.VITE_API_URL}/refill/rent/last`
      );
      if (response.status === 200) {
        setlastCharges(response.data);
      }
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const createRefill = async (refill: IRefill) => {
    try {
      const response = await axiosInstance.post<IRefill>(
        `${import.meta.env.VITE_API_URL}/refill/create`,
        refill
      );
      console.log(response.data);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setAddRefillModal(false);
    }
  };

  const logoutUser = () => {
    Cookies.remove("token");
    setIsLogged(false);
    logout();
  };

  const confirm = () => {
    modal.confirm({
      title: "Выйти???",
      content: "Выуверены что хотите выйти?",
      icon: <ExclamationCircleOutlined style={{ color: "#D00" }} />,
      okText: "Да",
      cancelText: "Нет",
      centered: true,
      onOk: logoutUser,
    });
  };

  useEffect(() => {
    fetchData();
    fetchLastRefills();
  }, []);

  if (isLogged) {
    return (
      <>
        <div className={styles.page}>
          {loading ? (
            <LoadingOutlined
              style={{
                position: "absolute",
                left: "50%",
                fontSize: 30,
                marginTop: 20,
              }}
            />
          ) : (
            <div className={styles.profile}>
              <div className={styles.flex}>
                <ImgCrop rotationSlider>
                  <Upload
                    name="avatar"
                    listType="picture"
                    className={styles.avatarUploader}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                  >
                    <img
                      src={import.meta.env.VITE_STATIC_URL + user.photo_url}
                      alt="avatar"
                      style={{ width: "100%" }}
                      className={styles.avatar}
                    />
                    <div className={styles.editAvatar}>
                      <EditOutlined className={styles.editAvatarIcon} />
                    </div>
                  </Upload>
                </ImgCrop>
                <div>
                  <div className={styles.flex}>
                    <h2 className={styles.username}>{user.username}</h2>
                    {user.role === "admin" && (
                      <span className={styles.admin}>admin</span>
                    )}
                  </div>
                  <h3 className={styles.email}>{user.email}</h3>
                  <span className={styles.birth}>(age: {age})</span>
                </div>
                <button className={styles.button} onClick={confirm}>
                  Выйти
                </button>
              </div>
              <hr />
              <h3>История зарядок</h3>
              <List
                className={styles.list}
                loading={loading}
                split={false}
                itemLayout="horizontal"
                dataSource={lastCharges}
                renderItem={(item) => (
                  <List.Item className={styles.listItem}>
                    <p>Станция №{item.refill_id}</p>
                    <p>
                      Начало зарядки:{" "}
                      <span className={styles.date}>
                        {dayjs(item.time_start).format("DD-MM-YYYY | HH:mm:ss")}
                      </span>
                    </p>
                    {item.time_end && (
                      <p>
                        Конец зарядки:{" "}
                        <span className={styles.date}>
                          {dayjs(item.time_end).format("DD-MM-YYYY | HH:mm:ss")}
                        </span>
                      </p>
                    )}
                    <button
                      onClick={() => navigate(`/refill/${item.refill_id}`)}
                    >
                      перейти
                    </button>
                  </List.Item>
                )}
              ></List>
              {user.role === "admin" && (
                <div className={styles.adminPanel}>
                  <button
                    className={styles.addRefill}
                    onClick={() => setAddRefillModal(true)}
                  >
                    Добавить станцию
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <Modal
          open={addRefillModal}
          centered
          title="Добавление новой зарядной станции"
          okText="Добавить"
          cancelText="Отмена"
          okButtonProps={{ autoFocus: true, htmlType: "submit" }}
          onCancel={() => setAddRefillModal(false)}
          destroyOnClose
          modalRender={(dom) => (
            <Form
              layout="vertical"
              form={form}
              name="form_in_modal"
              initialValues={{ modifier: "public" }}
              clearOnDestroy
              onFinish={(values) => {
                values.is_active = values.is_active === "true";
                createRefill(values);
              }}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item
            name="address"
            label="Адрес зарядной станции"
            rules={[
              {
                required: true,
                message: "Пожалуйста, заполните поле с адресом!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="power"
            label="Мощность"
            rules={[
              {
                required: true,
                message: "Пожалйста, введите мощность зарядной станции",
              },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Активность"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите состояние зарядного устройства",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="true">Активна</Radio>
              <Radio value="false">Неактивна</Radio>
            </Radio.Group>
          </Form.Item>
        </Modal>
        <CustomModal />
        {contextHolder}
      </>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
