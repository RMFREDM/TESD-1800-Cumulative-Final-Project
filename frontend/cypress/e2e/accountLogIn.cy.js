// import faker
import { faker } from "@faker-js/faker";

describe("Log In Page", () => {
	it("has a link on the homepage", () => {
		// visit the homepage
		cy.visit(Cypress.config().baseUrl);

		// test for a link to the log in page in the header
		cy.get('header > a[id="login-link"]')
			.should("be.visible")
			.and("have.text", "Log In")
			.click();

		cy.url().should("eq", Cypress.config().baseUrl + "/login.html");
	});
	it("has a link to the homepage", () => {
		// visit the log in page
		cy.visit(Cypress.config().baseUrl + "/login.html");

		// test for a link to the homepage in the header
		cy.get('header > a[id="homepage-link"]')
			.should("be.visible")
			.and("have.text", "Home")
			.click();

		cy.url().should("eq", Cypress.config().baseUrl + "/");
	});
	it("has a link to the create account page in the form", () => {
		// visit the log in page
		cy.visit(Cypress.config().baseUrl + "/login.html");

		// test for a link to the homepage in the header
		cy.get('form > a[href="create_account.html"]')
			.should("be.visible")
			.and("have.text", "No account? Click here!")
			.click();

		cy.url().should(
			"eq",
			Cypress.config().baseUrl + "/create_account.html",
		);
	});
	it("logs into accounts", () => {
		// create an account to log into
		const email = faker.internet.email();
		const password = faker.internet.password();
		cy.createAccount(email, password);

		// visit the login page
		cy.visit(Cypress.config().baseUrl + "/login.html");

		// log into the account
		cy.get('form[name="login-form"]')
			.should("be.visible")
			.within(($form) => {
				// type in the account information
				cy.get('label[for="email"]').should("be.visible");
				cy.get('input[name="email"][required][type="email"]')
					.should("be.visible")
					.type(email);

				cy.get('label[for="password"]').should("be.visible");
				cy.get('input[name="password"][required][type="password"]')
					.should("be.visible")
					.type(password);

				// ensure the form submits
				cy.get('button[type="submit"]')
					.should("be.visible")
					.and("have.text", "Log In")
					.click();
			});

		// ensure the user is redirected to the homepage and a success message is displayed
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.get('p[id="message"]')
			.should("be.visible")
			.and("contain.text", "Logged into account: " + email);

		// ensure there is a cookie that verifies the user's login status
		cy.getCookie("account").should("exist");
	});
});
