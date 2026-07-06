// import functions
import { getCookie, setCookie, removeCookie } from "./util/cookieFunctions";
import { databasePath } from "./util/pathConstants";

// if there is an error message, display it
const message = getCookie("message");
removeCookie("message");
if (message != null) {
	const errorParagraph = document.getElementById("message");
	errorParagraph.innerText = "Error: " + message;
	errorParagraph.style.visibility = "visible";
}

// get the login form
const loginForm = document.querySelector('form[name="login-form"]');

// override form behavior to log in the user
loginForm.addEventListener("submit", async (e) => {
	// prevent default behavior
	e.preventDefault();

	// send a get request to the database with the form data
	const formData = new FormData(loginForm);
	const body = {
		Email: formData.get("email"),
		Password: formData.get("password"),
	};
	const loginResults = await fetch(databasePath + "/login", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const loginJson = await loginResults.json();

	//set the message cookie and redirect to the homepage on success or reload the page if there was an error
	setCookie("message", loginJson.message);
	if (loginJson.messageType == "error") {
		location.reload();
	} else {
		location.href = location.origin;
	}
});
