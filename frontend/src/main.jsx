import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "./contexts/SessionContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<CookiesProvider>
			<SessionProvider>
				<BrowserRouter>
					<App></App>
				</BrowserRouter>
			</SessionProvider>
		</CookiesProvider>
	</React.StrictMode>
);
