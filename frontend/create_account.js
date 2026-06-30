// get the create account form
const createAccountForm = document.querySelector(
	'form[name="create-account-form"]',
);

// handle form submission
createAccountForm.addEventListener("submit", (e) => {
	// prevent the form's default action
	e.preventDefault();

	// send a post request to the database with the form data
	const formData = new FormData(createAccountForm);
	const body = {
		Email: formData.get("email"),
		Password: formData.get("password"),
		ProductIds: [],
	};
	const accountCreationResults = fetch("http://localhost:5287/accounts", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	console.log(accountCreationResults);
	console.log(accountCreationResults.body);
	console.log(accountCreationResults.message);
	console.log(accountCreationResults.errors);

	// reload the page
	// location.reload();
});
