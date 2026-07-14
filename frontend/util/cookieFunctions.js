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

// define a function to validate the account
export async function validateAccount() {
	// make a Put request to the account validate endpoint
	const validationResults = await fetch(databasePath + "/account/validate", {
		method: "put",
		credentials: "include",
	});
	const validationJson = await validationResults.json();

	// return the results of the validation
	return validationJson.message;
}

export async function productIdBelongsToUser(productId) {
	// make a Get request to ensure the product belongs to the user
	const validationResults = await fetch(
		databasePath + "/products/is_user_owned/" + productId,
		{
			method: "get",
			credentials: "include",
		},
	);

	// return the value of the request
	const validationJson = await validationResults.json();
	return validationJson;
}
