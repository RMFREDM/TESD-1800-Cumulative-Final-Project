// imports
import { getCookie, setCookie, validateAccount } from "./cookieFunctions";
import { databasePath } from "./pathConstants";

// create a function that takes in a header element and adds navigation links to it
export async function createHeader(header) {
	// validate the user's account, get the value of the account cookie, and define a variable to hold the header elements
	console.log(await validateAccount());
	const account = getCookie("account");
	let headerElements = new Array();

	// create the navigation links
	const homepageLink = createLink(location.origin, "homepage-link", "Home");
	headerElements.push(homepageLink);

	// if the user is not logged in, create links to the create account and log in pages
	if (account == null) {
		const accountCreationLink = createLink(
			location.origin + "/create_account.html",
			"create-account-link",
			"Create Account",
		);
		headerElements.push(accountCreationLink);
		const loginLink = createLink(
			location.origin + "/login.html",
			"login-link",
			"Log In",
		);
		headerElements.push(loginLink);
	} else {
		// if the user is logged in, create a logout button
		const logoutButton = document.createElement("button");
		logoutButton.id = "logout-button";
		logoutButton.innerText = "Log Out";
		headerElements.push(logoutButton);

		// handle clicking on the button by logging out of the current account
		logoutButton.addEventListener("click", async (e) => {
			// prevent the button's default behavior
			e.preventDefault();

			// make a post request to the server to log out of the current account
			const logoutResults = await fetch(databasePath + "/logout", {
				method: "post",
				credentials: "include",
			});
			const logoutJson = await logoutResults.json();
			setCookie("message", logoutJson.message);

			// redirect the user to the homepage
			location.href = location.origin;
		});
	}

	// add every element in headerElements to the header
	headerElements.forEach((element) => {
		header.appendChild(element);
	});
}

// create a function that creates a new link element
function createLink(path = "/", id = "", innerText = "") {
	// create the link
	const newLink = document.createElement("a");
	newLink.href = path;
	newLink.id = id;
	newLink.innerText = innerText;

	// return the link
	return newLink;
}
