import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from "react-router-dom";
import Data from "./components/Data";
import ProxyConfig from "./components/ProxyConfig";
import Settings from "./components/Settings";
import TelegramConfig from "./components/TelegramConfig";
import Welcome from "./components/Welcome";
import "./index.css";
import ErrorPage from "./pages/404";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
const routes = createRoutesFromElements(
    <>
        <Route path="/admin" element={<Login />} errorElement={<ErrorPage />} />
        <Route
            path="/dashboard"
            element={<Dashboard />}
            errorElement={<ErrorPage />}
        >
            <Route
                index
                element={<Navigate to="/dashboard/welcome" replace />}
            />
            <Route path="config" element={<TelegramConfig />} />
            <Route path="config/telegram" element={<TelegramConfig />} />
            <Route path="config/proxy" element={<ProxyConfig />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="setting" element={<Settings />} />
            <Route path="data" element={<Data />} />
        </Route>
    </>,
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
