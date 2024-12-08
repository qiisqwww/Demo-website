import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./Profile.module.css";
import { Navigate } from "react-router-dom";
import { Form, Input, message, Modal, Radio, Upload } from "antd";
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

interface IProfileData {
  username: string;
  email: string;
  birthdate: dayjs.Dayjs;
  photo_url: string;
  role: string;
}

export default function Profile() {
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
  const [form] = Form.useForm();

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

  const token = Cookies.get("token");

  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IProfileData>(
        `${import.meta.env.VITE_API_URL}/profile/me`
      );
      setUser(response.data);
      console.log(user.birthdate);
      setAge(dayjs().diff(user.birthdate, "year"));
    } catch (e: unknown) {
      logout();
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createRefill = async (refill: IRefill) => {
    try {
      console.log(refill);
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

  const logout = () => {
    Cookies.remove("token");
    setIsLogged(false);
  };

  const confirm = () => {
    modal.confirm({
      title: "Log out???",
      content: "Are you sure you want to log out?",
      icon: <ExclamationCircleOutlined style={{ color: "#D00" }} />,
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: logout,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLogged) {
    return (
      <>
        <div className={styles.page}>
          <h1 className={styles.title}>Profile</h1>
          <hr />
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
                  <h2 className={styles.username}>{user.username}</h2>
                  <div className={styles.flex}>
                    <h3 className={styles.email}>{user.email}</h3>
                    <span className={styles.birth}>(age: {age})</span>
                    {user.role === "admin" && (
                      <span className={styles.admin}>admin</span>
                    )}
                  </div>
                </div>
                <button className={styles.button} onClick={confirm}>
                  Log out
                </button>
              </div>
              {user.role === "admin" && (
                <div className={styles.adminPanel}>
                  <button
                    className={styles.addRefill}
                    onClick={() => setAddRefillModal(true)}
                  >
                    create refill
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <Modal
          open={addRefillModal}
          centered
          title="Create a new refill"
          okText="Create"
          cancelText="Cancel"
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
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input the address of refill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="power"
            label="Power"
            rules={[
              {
                required: true,
                message: "Please input the power of refill!",
              },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Activity"
            rules={[
              {
                required: true,
                message: "Please select activity",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="true">Active</Radio>
              <Radio value="false">Inactive</Radio>
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
