import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface LogoutProps {
  onCancel: () => void;
}
const Logout = ({ onCancel }: LogoutProps) => {
  const [animation, setAnimation] = useState(true);
  const logOut = async () => {
    const res = await axios.post(
      "/api/auth/logout",
      {},
      {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      },
    );
    if (res.data.status === "success") {
      toast.info(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    if (res.status !== 200) {
      toast.error("Lỗi không xác định =)))");
      setTimeout(() => {
        onCancel();
      }, 1500);
    }
    if (!res.data.status) {
      toast.error("Tài khoản đã thay đổi, vui lòng đăng nhập lại!");
      setTimeout(() => {
        onCancel();
      }, 1500);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
    }, 500);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black/50">
      <div className="flex w-11/12 flex-col items-center justify-center rounded-lg bg-white p-5 md:w-1/3">
        <FontAwesomeIcon
          className={`mb-4 text-5xl text-red-500 hover:animate-bounce ${
            animation ? "animate-bounce" : ""
          }`}
          icon={faCircleExclamation}
        />
        <h1 className="text-2xl font-bold">Đăng xuất</h1>
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
        <div className="m-2 flex w-2/3 items-center justify-center">
          <button
            className="mr-2 flex-1 rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 focus:bg-red-600"
            onClick={logOut}
          >
            Xác nhận
          </button>
          <button
            className="ml-2 flex-1 rounded-lg bg-indigo-400 p-2 text-center text-white hover:bg-indigo-500 focus:bg-indigo-500"
            onClick={onCancel}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
};
export default Logout;
