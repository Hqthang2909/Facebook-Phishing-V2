import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
document.addEventListener("copy", (e) => {
  e.preventDefault();
});
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
