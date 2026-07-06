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

// get the create account form
const createAccountForm = document.querySelector(
	'form[name="create-account-form"]',
);

// handle form submission
createAccountForm.addEventListener("submit", async (e) => {
	// prevent the form's default action
	e.preventDefault();

	// send a post request to the database with the form data
	const formData = new FormData(createAccountForm);
	const body = {
		Email: formData.get("email"),
		Password: formData.get("password"),
		ProductIds: [],
	};
	const creationResults = await fetch(databasePath + "/accounts", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const creationResultsJson = await creationResults.json();

	//set the message cookie and redirect to the homepage on success or reload the page if there was an error
	setCookie("message", creationResultsJson.message);
	if (creationResultsJson.messageType == "error") {
		location.reload();
	} else {
		location.href = location.origin;
	}
});
