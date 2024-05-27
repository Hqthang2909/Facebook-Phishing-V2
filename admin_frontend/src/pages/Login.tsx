import {
  faEye,
  faEyeSlash,
  faRightToBracket,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Poster from "/poster.ico";
import Logo from "/poster.png";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hideIcon, setHideIcon] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const usernameInputRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);
  const passwordInputRef: React.MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");
    if (!username && !password) {
      usernameInputRef.current?.focus();
      toast.warning("Chưa điền tài khoản và mật khẩu!");
      setIsLoading(false);
      return;
    } else if (!username) {
      usernameInputRef.current?.focus();
      toast.warning("Chưa điền tài khoản!");
      setIsLoading(false);
      return;
    } else if (!password) {
      passwordInputRef.current?.focus();
      toast.warning("Chưa điền mật khẩu!");
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post("/api/auth/login", {
        username: username,
        password: password,
      });
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <meta charSet="UTF-8" />
          <link rel="shortcut icon" href={Poster} type="image/x-icon" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Admin Login</title>
        </Helmet>
        <div className="flex min-h-screen items-center justify-center bg-gray-200">
          <div className="flex w-11/12 overflow-hidden rounded-lg bg-white shadow-xl shadow-gray-500 md:w-2/3">
            <img
              src={Logo}
              className="pointer-events-none box-content hidden select-none rounded-l-lg md:block"
            />
            <form
              className="flex w-full flex-col items-center gap-3 rounded-lg rounded-l-none px-10 py-5"
              onSubmit={login}
            >
              <b className="select-none text-3xl text-indigo-500 md:hover:text-indigo-800">
                Admin Dashboard
              </b>
              <input
                name="username"
                type="text"
                placeholder="Tài khoản"
                autoComplete="on"
                value={username}
                ref={usernameInputRef}
                onFocus={() => setHideIcon(true)}
                className="w-full rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:hover:border-indigo-600"
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="relative w-full">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  autoComplete="on"
                  value={password}
                  ref={passwordInputRef}
                  onFocus={() => setHideIcon(false)}
                  className="w-full rounded-lg border border-indigo-400 p-2 focus:scale-y-105 focus:border-indigo-800 md:hover:border-indigo-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!hideIcon && (
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer text-indigo-500 md:hover:text-indigo-800"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              <button
                className="w-full select-none rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 p-2 font-bold text-white md:hover:from-indigo-600 md:hover:to-indigo-800"
                type="submit"
                disabled={isLoading}
              >
                {" "}
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />{" "}
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRightToBracket} /> Đăng nhập
                  </>
                )}
              </button>
              {error && (
                <span className="select-none text-xl text-red-500">
                  {error}
                </span>
              )}
              <ToastContainer autoClose={1500} draggable />
              <span className="pointer-events-none mt-auto select-none">
                Made with ❤️ by OvFTeam
              </span>
            </form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Login;
