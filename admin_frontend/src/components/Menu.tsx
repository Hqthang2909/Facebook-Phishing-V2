import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import {
  faCaretDown,
  faCaretRight,
  faDatabase,
  faGears,
  faNetworkWired,
  faPersonThroughWindow,
  faRunning,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "./Logout";
interface MenuProps {
  className: string;
}

const Menu: React.FC<MenuProps> = ({ className }) => {
  const navigate = useNavigate();
  const [configDirection, setConfigDirection] = useState("right");
  const [configShow, setConfigShow] = useState(false);
  const [dataShow, setDataShow] = useState(false);
  const [exitIcon, setExitIcon] = useState("faRunning");
  const [proxyShow, setProxyShow] = useState(false);
  const [settingsShow, setSettingsShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [telegramShow, setTelegramShow] = useState(false);
  const location = useLocation();
  const changeConfigShow = () => {
    if (configShow) {
      navigate("/dashboard");
      setConfigDirection("right");
    } else {
      navigate("/dashboard/config");
      setConfigDirection("down");
    }

    setConfigShow(!configShow);
  };

  useEffect(() => {
    setConfigDirection(
      location.pathname.includes("/dashboard/config") ? "down" : "right",
    );
    setConfigShow(location.pathname.includes("/dashboard/config"));
    setDataShow(location.pathname.includes("/dashboard/data"));
    setExitIcon(
      location.pathname === "/dashboard"
        ? "faRunning"
        : "faPersonThroughWindow",
    );
    setProxyShow(location.pathname.includes("/dashboard/config/proxy"));
    setSettingsShow(location.pathname.includes("/dashboard/setting"));
    setTelegramShow(location.pathname.includes("/dashboard/config/telegram"));
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, [location]);
  return (
    <div className={className}>
      <div className="flex h-full w-full flex-col items-center justify-center bg-white py-4 shadow-md">
        <div className="w-full">
          <div
            className={`w-full1 flex cursor-pointer items-center justify-between gap-1 border-y px-4 text-xl md:hover:bg-indigo-500 md:hover:text-white ${configShow ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"}`}
            onClick={changeConfigShow}
          >
            <div>
              <FontAwesomeIcon icon={faSliders} /> Config
            </div>
            <FontAwesomeIcon
              icon={configDirection === "right" ? faCaretRight : faCaretDown}
              className="justify-self-end"
            />
          </div>
          {configShow && (
            <>
              <div
                className={`w-full cursor-pointer border-y pl-6 text-lg md:hover:bg-indigo-500 md:hover:text-white ${telegramShow ? "bg-indigo-400 text-white" : "bg-white text-indigo-500"}`}
                onClick={() => navigate("/dashboard/config/telegram")}
              >
                • <FontAwesomeIcon icon={faTelegram} size="xs" fixedWidth />{" "}
                Telegram Config
              </div>
              <div
                className={`w-full cursor-pointer border-y pl-6 text-lg md:hover:bg-indigo-500 md:hover:text-white ${proxyShow ? "bg-indigo-400 text-white" : "bg-white text-indigo-500"}`}
                onClick={() => navigate("/dashboard/config/proxy")}
              >
                • <FontAwesomeIcon icon={faNetworkWired} size="xs" fixedWidth />{" "}
                Proxy Config
              </div>
            </>
          )}
        </div>
        <div className="w-full">
          <div
            className={`w-full cursor-pointer px-4 text-xl md:hover:bg-indigo-500 md:hover:text-white ${dataShow ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"}`}
            onClick={() => navigate("/dashboard/data")}
          >
            <FontAwesomeIcon icon={faDatabase} /> Data
          </div>
        </div>
        <div className="w-full">
          <div
            className={`w-full cursor-pointer border-y px-4 text-xl md:hover:bg-indigo-500 md:hover:text-white ${settingsShow ? "bg-indigo-500 text-white" : "bg-white text-indigo-500"}`}
            onClick={() => navigate("/dashboard/setting")}
          >
            <FontAwesomeIcon icon={faGears} /> Setting
          </div>
        </div>
        <div className="w-full">
          <div
            className="w-full cursor-pointer border-y px-4 text-xl md:hover:bg-indigo-500 md:hover:text-white"
            onMouseEnter={() => setExitIcon("faPersonThroughWindow")}
            onMouseLeave={() => setExitIcon("faRunning")}
            onPointerEnter={() => setExitIcon("faPersonThroughWindow")}
            onPointerLeave={() => setExitIcon("faRunning")}
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon
              icon={
                exitIcon === "faPersonThroughWindow"
                  ? faPersonThroughWindow
                  : faRunning
              }
            />{" "}
            Logout
          </div>
        </div>
        <span className="pointer-events-none mx-4 mt-auto select-none whitespace-nowrap">
          Made with ❤️ by OvFTeam
        </span>
      </div>
      {showModal && <Logout onCancel={() => setShowModal(false)} />}
    </div>
  );
};

export default Menu;
