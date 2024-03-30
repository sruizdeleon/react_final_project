import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const SessionContext = createContext();

export function SessionProvider({ children }) {
	const [user, setUser] = useState(null);
	const [cookie, setCookie, removeCookie] = useCookies(["user"]);

	useEffect(() => {
		const posibleUsuario = cookie.user;
		const horaActual = saveTime()
		if (posibleUsuario && (horaActual - posibleUsuario.time) < 60) {
            setUser(posibleUsuario)
		} else {
			removeCookie("user", null);
		}
	}, []);

	function login(userData) {
		setUser(userData);
		setCookie("user", userData);
	}

	function logout() {
		setUser(null);
		removeCookie("user", null);
	}

	function saveTime() {
		const fechaHoraActual = new Date();

		const dia = fechaHoraActual.getDate();
		const mes = fechaHoraActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript
		const anio = fechaHoraActual.getFullYear();
		const hora = fechaHoraActual.getHours();
		const minutos = fechaHoraActual.getMinutes();

		// Convertir la fecha y hora actual a minutos
		const minutosTotales = minutos + hora * 60 + dia * 24 * 60 + mes * 30 * 24 * 60 + anio * 365 * 24 * 60;
		return minutosTotales;
	}

	return <SessionContext.Provider value={{ user, login, logout, saveTime }}>{children}</SessionContext.Provider>;
}
