// if there is an error message, display it
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has("error")) {
	const errorParagraph = document.getElementById("error-message");
	errorParagraph.innerText = "Error: " + urlParams.get("error");
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
	const creationResults = await fetch("http://localhost:5287/accounts", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const creationResultsJson = await creationResults.json();

	// redirect to the homepage on success or reload the page if there was an error
	if (creationResultsJson.messageType == "error") {
		location.href =
			location.pathname + "?error=" + creationResultsJson.message;
	} else {
		location.href =
			location.hostname + "?success=" + creationResultsJson.message;
	}
});
