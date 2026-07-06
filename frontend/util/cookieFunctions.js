// imports
import { databasePath } from "./pathConstants";

// define a function to set cookies
export function setCookie(cookieName, cookieContent, maxAge = 1800) {
	document.cookie = cookieName + "=" + cookieContent + "; max-age=" + maxAge;
}

// define a function to retrieve cookie values
export function getCookie(cookieName) {
	const cookie = document.cookie
		.split("; ")
		.find((row) => row.startsWith(cookieName + "="))
		?.split("=")[1];

	return cookie;
}

// define a function to delete cookies
export function removeCookie(cookieName) {
	document.cookie = cookieName + "=; max-age=0";
}
