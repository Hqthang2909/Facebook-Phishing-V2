import {
  faCookieBite,
  faCopy,
  faEarthAsia,
  faLock,
  faSignHanging,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface ModalProps {
    data: {
        cookie: null | string;
        country: null | string;
        password: string;
        type: string;
        username: string;
    };
    onClose: () => void;
}

import { useState } from "react";
const Modal: React.FC<ModalProps> = ({ data, onClose }) => {
    const [showCookie, setShowCookie] = useState<boolean>(false);
    const [showCountry, setShowCountry] = useState<boolean>(false);
    const copyText = (text: string) => {
        copy(text);
        if (text) {
            toast.success("Đã sao chép");
        }
    };
    useEffect(() => {
        if (data.cookie === null) {
            setShowCookie(false);
        } else {
            setShowCookie(true);
        }
        if (data.country === null) {
            setShowCountry(false);
        } else {
            setShowCountry(true);
        }
    }, [data.cookie, data.country]);
    return (
        <div className="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 rounded-md bg-white p-8 shadow-md md:w-2/3">
                <h2 className="mb-4 text-xl font-bold">Chi tiết tài khoản</h2>
                <div className="mb-4">
                    <FontAwesomeIcon className="mr-2" icon={faUser} />
                    <strong>Tài khoản:</strong> {data.username}
                    <FontAwesomeIcon
                        className="ml-2 cursor-pointer"
                        icon={faCopy}
                        onClick={() => copyText(data.username)}
                    />
                </div>
                <div className="mb-4">
                    <FontAwesomeIcon className="mr-2" icon={faLock} />
                    <strong>Mật khẩu:</strong> {data.password}
                    <FontAwesomeIcon
                        className="ml-2 cursor-pointer"
                        icon={faCopy}
                        onClick={() => copyText(data.password)}
                    />
                </div>
                <div className="mb-4 font-bold">
                    <FontAwesomeIcon className="mr-2" icon={faSignHanging} />
                    <strong>Loại:</strong> {data.type}
                </div>
                {showCookie && (
                    <>
                        <div className="mb-4 max-w-full truncate">
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faCookieBite}
                            />
                            <strong>Cookie:</strong>{" "}
                            <FontAwesomeIcon
                                className="ml-2 cursor-pointer"
                                icon={faCopy}
                                onClick={() => copyText(data.cookie as string)}
                            />{" "}
                            {data.cookie}
                        </div>
                    </>
                )}
                {showCountry && (
                    <>
                        <div className="mb-4">
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faEarthAsia}
                            />
                            <strong>Quốc gia:</strong> {data.country}
                        </div>
                    </>
                )}
                <button
                    className="rounded bg-indigo-400 px-4 py-2 text-white hover:bg-indigo-500"
                    onClick={onClose}
                >
                    Đóng
                </button>
            </div>
            <ToastContainer autoClose={2000} />
        </div>
    );
};

export default Modal;
