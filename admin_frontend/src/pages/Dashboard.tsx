import { faFacebook, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faGear, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import Poster from "/poster.ico";
import Logo from "/poster.png";
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchIcon, setSearchIcon] = useState(true);
  const [isMenuShow, setIsMenuShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [infoShow, setInfoShow] = useState(true);
  const searchInput = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (location.pathname === "/dashboard/data") {
      setInfoShow(false);
    } else {
      setInfoShow(true);
    }
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setIsMenuShow(false);
    }
  }, [location]);
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="UTF-8" />
        <link rel="shortcut icon" href={Poster} type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dashboard</title>
      </Helmet>
      <div className="flex h-full min-h-screen flex-col items-center bg-gray-200">
        <nav className="fixed left-0 top-0 z-10 flex h-16 w-full items-center justify-between bg-white p-3 shadow-xl">
          <div className="flex items-center">
            <img
              src={Logo}
              className="mr-2 w-10 cursor-pointer select-none rounded-lg"
              onClick={() => navigate("/dashboard")}
            />
            {searchIcon && (
              <FontAwesomeIcon
                icon={faSearch}
                size="xs"
                fixedWidth
                className="h-6 rounded-full rounded-r-none border border-r-0 border-indigo-400 p-2 pl-3 text-indigo-500"
                onClick={() => {
                  setSearchIcon(false);
                  searchInput.current?.focus();
                }}
              />
            )}
            <input
              type="text"
              className={`rounded-full ${searchIcon ? "rounded-l-none border-l-0" : "rounded-l-full pl-5"} border border-indigo-400 py-2 pr-5`}
              placeholder="Tìm kiếm..."
              ref={searchInput}
              onFocus={() => setSearchIcon(false)}
              onBlur={() => setSearchIcon(true)}
            />
          </div>
          <FontAwesomeIcon
            icon={faGear}
            className="h-6 cursor-pointer rounded-full border border-indigo-400 p-2 text-indigo-500 focus:bg-indigo-500 focus:text-white md:hover:bg-indigo-500 md:hover:text-white"
            onClick={() => setIsMenuShow(!isMenuShow)}
          />
        </nav>
        <div className="absolute left-0 top-[64px] flex w-full">
          {isMenuShow && (
            <Menu
              className={`${isMobile ? "fixed" : "sticky"} left-0 top-[64px] z-10 h-[calc(100vh-64px)] self-start shadow-xl`}
            />
          )}
          <div className="w-full bg-gray-200">
            <Suspense fallback={<div>Đang tải ...</div>}>
              <Outlet />
            </Suspense>
            {infoShow && (
              <>
                <div className="fixed bottom-5 right-4 h-fit md:top-20">
                  <b>
                    <FontAwesomeIcon icon={faTelegram} className="mr-2" />
                    Telegram:{" "}
                    <a
                      className="cursor-pointer"
                      target="_blank"
                      href="https://t.me/tripleseven190504"
                      rel="noopener noreferrer"
                    >
                      @tripleseven190504
                    </a>
                  </b>
                  <br />

                  <b>
                    <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                    Facebook:{" "}
                    <a
                      href="https://facebook.com/tripleseven190504"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @tripleseven190504
                    </a>
                  </b>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
export default Dashboard;
