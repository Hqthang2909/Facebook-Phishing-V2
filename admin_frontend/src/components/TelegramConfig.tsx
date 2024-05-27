import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import {
    faFingerprint,
    faFloppyDisk,
    faKey,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Poster from "/poster.ico";
const TelegramConfig = () => {
    const [apiToken, setApiToken] = useState<string>("");
    const [chatId, setChatId] = useState<string>("");
    const [proxy, setProxy] = useState<string>("");
    const getInfo = async () => {
        const res = await axios.get("/api/get-config-info");
        if (res.status === 200) {
            setApiToken(res.data.api_token);
            setChatId(res.data.chat_id);
            setProxy(res.data.proxy);
        }
    };
    const handleSubit = async (e: FormEvent) => {
        e.preventDefault();
        if (!apiToken || !chatId) {
            toast.warning("Vui lòng nhập API Token và Chat ID");
            return;
        }
        const res = await axios.post("/api/change-config-info", {
            api_token: apiToken,
            chat_id: chatId,
            proxy: proxy,
        });
        if (res.status === 200) {
            toast.success("Cập nhật cấu hình thành công!");
        }
        if (res.status !== 200) {
            toast.error("Lỗi không xác định =)))");
        }
    };
    useEffect(() => {
        getInfo();
    }, []);

    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="UTF-8" />
                <link rel="shortcut icon" href={Poster} type="image/x-icon" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Telegram Config</title>
            </Helmet>
            <div className="flex flex-col">
                <form className="flex w-full flex-col items-center gap-3 rounded-lg rounded-l-none py-5 md:px-10">
                    <b className="select-none text-3xl text-indigo-500 md:hover:text-indigo-800">
                        <FontAwesomeIcon icon={faTelegram} /> Telegram Config
                    </b>
                    <label
                        className="w-11/12 font-bold md:w-3/4"
                        htmlFor="token"
                    >
                        <FontAwesomeIcon icon={faKey} /> API Token:
                    </label>
                    <input
                        name="token"
                        type="text"
                        value={apiToken}
                        onInput={(e) => setApiToken(e.currentTarget.value)}
                        placeholder="API Token"
                        autoComplete="on"
                        className="w-11/12 rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:w-3/4 md:hover:border-indigo-600"
                    />
                    <label
                        className="w-11/12 font-bold md:w-3/4"
                        htmlFor="chatid"
                    >
                        <FontAwesomeIcon icon={faFingerprint} /> Chat ID:
                    </label>
                    <input
                        name="chatid"
                        type="text"
                        value={chatId}
                        onInput={(e) => setChatId(e.currentTarget.value)}
                        placeholder="Chat ID"
                        autoComplete="on"
                        className="w-11/12 rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:w-3/4 md:hover:border-indigo-600"
                    />
                    <button
                        className="w-11/12 select-none rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 p-2 font-bold text-white md:w-3/4 md:hover:from-indigo-600 md:hover:to-indigo-800"
                        type="submit"
                        onClick={handleSubit}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thay đổi
                    </button>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://chatgpt.com/share/3788b57b-afc0-468e-b310-74242fb52616"
                        className="cursor-context-menu md:hover:scale-110 md:hover:font-bold"
                    >
                        Hướng dẫn lấy API Token và Chat ID
                    </a>
                </form>
                <ToastContainer autoClose={1500} draggable />
            </div>
        </HelmetProvider>
    );
};

export default TelegramConfig;
