import ReactDOM from "react-dom/client";
import { AppWrapper } from "./AppWrapper";
import "./index.css";

// Render the App component as a JSX element
const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Missing root element");
}
const root = ReactDOM.createRoot(rootElement);
root.render(<AppWrapper />);
