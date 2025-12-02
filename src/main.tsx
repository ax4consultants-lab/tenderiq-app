import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { migrateLegacyLocalStorage } from "@/lib/storageMigration";

migrateLegacyLocalStorage();

createRoot(document.getElementById("root")!).render(<App />);
