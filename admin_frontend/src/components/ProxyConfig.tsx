import {
  faEthernet,
  faFloppyDisk,
  faServer,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Poster from "/poster.ico";
const ProxyConfig = () => {
  const [proxy, setProxy] = useState<string>("");
  const proxyInputRef = useRef<HTMLInputElement>(null);
  const proxyRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}$/;
  const [haveProxy, setHaveProxy] = useState<boolean>(false);
  const [apiToken, setApiToken] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!haveProxy) {
      if (!proxy) {
        toast.warning("Vui lòng nhập proxy!");
        proxyInputRef.current?.focus();
        return;
      }
      if (!proxyRegex.test(proxy)) {
        toast.error("Proxy không đúng định dạng");
      } else {
        const res = await axios.post("/api/change-config-info", {
          api_token: apiToken,
          chat_id: chatId,
          proxy: proxy,
        });
        if (res.status === 200) {
          toast.success("Đã cập nhật proxy mới thành công");
          setHaveProxy(true);
          setProxy(proxy);
        } else {
          toast.error("Lỗi không xác định =)))");
        }
      }
    } else {
      const res = await axios.post("/api/change-config-info", {
        api_token: apiToken,
        chat_id: chatId,
        proxy: "",
      });
      if (res.status === 200) {
        toast.success("Đã xóa proxy!");
        setHaveProxy(false);
        setProxy("");
      } else {
        toast.error("Lỗi không xác định =)))");
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/get-config-info");
      if (res.data.proxy) {
        setHaveProxy(true);
        setProxy(res.data.proxy);
      }
      if (res.data.api_token) {
        setApiToken(res.data.api_token);
      }
      if (res.data.chat_id) {
        setChatId(res.data.chat_id);
      }
    };
    fetchData();
  }, [proxy]);
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href={Poster} type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ProxyConfig</title>
      </Helmet>
      <div className="flex flex-col">
        <form className="flex w-full flex-col items-center gap-3 rounded-lg rounded-l-none py-5 md:px-10">
          <b className="select-none text-3xl text-indigo-500 md:hover:text-indigo-800">
            <FontAwesomeIcon icon={faEthernet} /> ProxyConfig
          </b>
          <label className="w-11/12 font-bold md:w-3/4" htmlFor="proxy">
            <FontAwesomeIcon icon={faServer} /> Nhập proxy:
          </label>
          <input
            ref={proxyInputRef}
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            name="proxy"
            type="text"
            placeholder="VD: 127.0.0.1:8080"
            autoComplete="on"
            className="w-11/12 rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:w-3/4 md:hover:border-indigo-600"
          />
          <button
            className={`w-11/12 select-none rounded-lg bg-gradient-to-r p-2  font-bold text-white md:w-3/4 ${haveProxy ? "from-red-600 via-red-500 to-red-400 focus:from-red-600 focus:to-red-800 md:hover:from-red-600 md:hover:to-red-800" : "from-indigo-600 via-indigo-500 to-indigo-400 focus:from-indigo-600 focus:to-indigo-800 md:hover:from-indigo-600 md:hover:to-indigo-800"} `}
            type="submit"
            onClick={handleSubmit}
          >
            {" "}
            {haveProxy ? (
              <>
                <FontAwesomeIcon icon={faTrash} /> Xóa proxy
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thay đổi
              </>
            )}
          </button>
          <p className="w-11/12 md:w-3/4">
            Hãy nhập proxy mà bạn muốn sử dụng vào ô bên trên. <br />
            Proxy nên được nhập theo định dạng:
            <span className="font-bold">IP:Port</span>. Ví dụ:{" "}
            <span className="font-bold">127.0.0.1:8080</span>.
          </p>
          <p className="w-11/12 text-red-500 md:w-3/4">
            Lưu ý: Proxy không nên có mật khẩu. Sử dụng proxy có tài khoản mật
            khẩu sẽ bị lỗi khi chạy.
          </p>
        </form>
      </div>
      <ToastContainer autoClose={1500} draggable />
    </HelmetProvider>
  );
};

export default ProxyConfig;
