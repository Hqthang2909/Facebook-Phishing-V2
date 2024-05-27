import { faChrome } from "@fortawesome/free-brands-svg-icons";
import {
  faCookie,
  faFloppyDisk,
  faScrewdriverWrench,
  faUserPen,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Poster from "/poster.ico";
const Settings = () => {
  const [cookieType, setCookieType] = useState<string>("");
  const [loadImage, setLoadImage] = useState<boolean>(false);
  const [loadCss, setLoadCss] = useState<boolean>(false);
  const [hideChrome, setHideChrome] = useState<boolean>(false);
  const [autoClose, setAutoClose] = useState<boolean>(true);
  const [routeAdmin, setRouteAdmin] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.warning("Vui lòng nhập username!");
      usernameRef.current?.focus();
      return;
    } else if (!password) {
      toast.warning("Vui lòng nhập password!");
      passwordRef.current?.focus();
      return;
    } else if (!routeAdmin || routeAdmin === "/") {
      toast.warning("Ấn lưu một lần nữa để xác nhận thay đổi!");
      setRouteAdmin("/admin");
      return;
    }
    const res = await axios.post("/api/change-setting-info", {
      auto_close: autoClose,
      cookie_type: cookieType,
      hide_chrome: hideChrome,
      load_css: loadCss,
      load_image: loadImage,
      password: password,
      route_admin: routeAdmin,
      username: username,
    });
    if (res.status === 200) {
      toast.success("Đã cập nhật setting");
    } else {
      toast.error("Lỗi không xác định =)))");
    }
  };
  const handleChangeAdminRoute = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1 && e.target.value !== "/") {
      setRouteAdmin("/" + e.target.value);
      return;
    }
    setRouteAdmin(e.target.value);
  };
  useEffect(() => {
    const getSettings = async () => {
      const { data } = await axios.get("/api/get-setting-info");
      setAutoClose(data.auto_close);
      setCookieType(data.cookie_type);
      setHideChrome(data.hide_chrome);
      setLoadCss(data.load_css);
      setLoadImage(data.load_image);
      setPassword(data.password);
      setRouteAdmin(data.route_admin);
      setUsername(data.username);
    };
    getSettings();
  }, []);
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href={Poster} type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Settings</title>
      </Helmet>
      <div className="flex flex-col">
        <div className="flex w-full flex-col items-center gap-3 rounded-lg rounded-l-none py-5 md:px-10">
          <b className="select-none text-3xl text-indigo-500 md:hover:text-indigo-800">
            <FontAwesomeIcon icon={faScrewdriverWrench} /> Settings
          </b>
          <div className="flex w-11/12 flex-col gap-4">
            <div className="flex flex-col items-center justify-center border border-indigo-500 bg-white shadow-xl">
              <p className="text-md font-bold">
                <FontAwesomeIcon icon={faCookie} /> Loại Cookie
              </p>
              <div className="flex w-full items-center justify-center border-t border-indigo-500">
                <label
                  htmlFor="min"
                  className="flex h-fit w-full cursor-pointer items-center justify-center border-r border-indigo-500  "
                >
                  <input
                    className="mx-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-red-500 checked:bg-red-500"
                    type="radio"
                    name="cookie"
                    id="min"
                    value="min"
                    checked={cookieType === "min"}
                    onChange={(e) => setCookieType(e.target.value)}
                  />
                  <label htmlFor="min" className="cursor-pointer text-center">
                    Rút gọn
                  </label>
                </label>
                <label
                  htmlFor="max"
                  className="flex w-full cursor-pointer items-center justify-center"
                >
                  <input
                    className="mx-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-green-500 checked:bg-green-500"
                    type="radio"
                    name="cookie"
                    id="max"
                    value="max"
                    checked={cookieType === "max"}
                    onChange={(e) => setCookieType(e.target.value)}
                  />
                  <label htmlFor="max" className="cursor-pointer ">
                    Đầy đủ
                  </label>
                </label>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center border border-indigo-500 bg-white shadow-xl">
              <p className="text-md font-bold">
                <FontAwesomeIcon icon={faChrome} /> Chrome Config
              </p>
              <div className="flex h-fit w-full flex-col items-center justify-center border-t border-indigo-500 md:flex-row">
                <div className="flex h-fit w-full items-center justify-center">
                  <label
                    htmlFor="image"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center md:flex-row md:hover:font-bold"
                  >
                    <input
                      className="mx-2 mt-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-green-500 checked:bg-green-500 md:my-0"
                      type="checkbox"
                      name="image"
                      id="image"
                      checked={loadImage}
                      onChange={() => setLoadImage(!loadImage)}
                    />
                    <label htmlFor="image" className="cursor-pointer ">
                      Load ảnh
                    </label>
                  </label>
                  <label
                    htmlFor="css"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-l border-indigo-500 md:flex-row md:hover:font-bold"
                  >
                    <input
                      className="mx-2 mt-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-green-500 checked:bg-green-500 md:my-0"
                      type="checkbox"
                      name="css"
                      id="css"
                      checked={loadCss}
                      onChange={() => setLoadCss(!loadCss)}
                    />
                    <label htmlFor="css" className="cursor-pointer text-center">
                      Load CSS
                    </label>
                  </label>
                </div>
                <div className="flex h-fit w-full items-center justify-center border-t border-indigo-500 md:border-t-0">
                  <label
                    htmlFor="headless"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-l border-indigo-500 md:flex-row md:hover:font-bold"
                  >
                    <input
                      className="mx-2 mt-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-green-500 checked:bg-green-500 md:my-0"
                      type="checkbox"
                      name="headless"
                      id="headless"
                      checked={hideChrome}
                      onChange={() => setHideChrome(!hideChrome)}
                    />
                    <label
                      htmlFor="headless"
                      className="cursor-pointer text-center"
                    >
                      Ẩn Chrome
                    </label>
                  </label>
                  <label
                    htmlFor="detach"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-l border-indigo-500 md:flex-row md:hover:font-bold"
                  >
                    <input
                      className="mx-2 mt-2 cursor-pointer rounded-full border border-indigo-500 p-2 checked:border-green-500 checked:bg-green-500 md:my-0"
                      type="checkbox"
                      name="detach"
                      id="detach"
                      checked={autoClose}
                      onChange={() => setAutoClose(!autoClose)}
                    />
                    <label
                      htmlFor="detach"
                      className="cursor-pointer text-center"
                    >
                      Tự đóng Chrome
                    </label>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-11/12 flex-wrap items-center justify-start">
            <div className="mr-2  font-bold">
              {" "}
              <FontAwesomeIcon icon={faUserShield} /> Route Admin:
            </div>
            <input
              name="admin"
              type="text"
              value={routeAdmin}
              onChange={handleChangeAdminRoute}
              onFocus={(e) => {
                if (e.target.value === "") {
                  e.target.value = "/";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "/") {
                  e.target.value = "";
                }
              }}
              placeholder="VD: /admin,/abc,..."
              autoComplete="off"
              readOnly
              className="w-full rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:hover:border-indigo-600"
            />
          </div>
          <div className="flex w-11/12 flex-col items-start justify-center">
            <div className="mr-2 font-bold">
              {" "}
              <FontAwesomeIcon icon={faUserPen} /> Đổi thông tin tài khoản:
            </div>
            <input
              ref={usernameRef}
              name="username"
              type="text"
              placeholder="Tài khoản"
              autoComplete="on"
              className="w-full rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:hover:border-indigo-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              ref={passwordRef}
              name="password"
              type="text"
              placeholder="Mật khẩu"
              autoComplete="on"
              className="my-3 w-full rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:hover:border-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full select-none rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 p-2 font-bold text-white md:hover:from-indigo-600 md:hover:to-indigo-800"
              type="submit"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1500} draggable />
    </HelmetProvider>
  );
};

export default Settings;
