// import faker
import { faker } from "@faker-js/faker";

describe("Create Account Page", () => {
	it("has a link on the homepage", () => {
		// visit the homepage
		cy.visit(Cypress.config().baseUrl);

		// test for a link to the create account page in the header
		cy.get('header > a[id="create-account-link"]')
			.should("be.visible")
			.and("have.text", "Create Account")
			.click();

		cy.url().should(
			"eq",
			Cypress.config().baseUrl + "/create_account.html",
		);
	});
	it("has a link to the homepage", () => {
		// visit the create account page
		cy.visit(Cypress.config().baseUrl + "/create_account.html");

		// test for a link to the homepage in the header
		cy.get('header > a[id="homepage-link"]')
			.should("be.visible")
			.and("have.text", "Home")
			.click();

		cy.url().should("eq", Cypress.config().baseUrl + "/");
	});

	// define variables to hold the form data
	const newEmail = faker.internet.email();
	const newPassword = faker.internet.password();

	it("creates accounts", () => {
		// visit the create account page
		cy.visit(Cypress.config().baseUrl + "/create_account.html");

		// ensure there is a form with inputs for email and password and type in inputs
		cy.get('form[name="create-account-form"]').should("be.visible");

		cy.get('form[name="create-account-form"] > label[for="email"]').should(
			"be.visible",
		);
		cy.get(
			'form[name="create-account-form"] > input[name="email"][required][type="email"]',
		)
			.should("be.visible")
			.type(newEmail);

		cy.get(
			'form[name="create-account-form"] > label[for="password"]',
		).should("be.visible");
		cy.get(
			'form[name="create-account-form"] > input[name="password"][required][type="password"]',
		)
			.should("be.visible")
			.type(newPassword);

		// ensure the form submits
		cy.get('form[name="create-account-form"] > button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Create Account")
			.click();

		// ensure the user is redirected to the homepage and that a success message is displayed
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.get('p[id="message"]')
			.should("be.visible")
			.and("contain.text", "Account Created! ID: ")
			.and("contain.text", ", Email: " + newEmail);
	});
	it("prevents duplicate accounts", () => {
		// visit the create account page
		cy.visit(Cypress.config().baseUrl + "/create_account.html");

		// retype the previous account data
		cy.get('form[name="create-account-form"] > input[name="email"]').type(
			newEmail,
		);

		cy.get(
			'form[name="create-account-form"] > input[name="password"]',
		).type(newPassword);

		// submit the form
		cy.get(
			'form[name="create-account-form"] > button[type="submit"]',
		).click();

		// ensure the user is not redirected to the homepage and that an error message is displayed
		cy.url().should(
			"eq",
			Cypress.config().baseUrl + "/create_account.html",
		);
		cy.get('p[id="message"]')
			.should("be.visible")
			.and(
				"contain.text",
				"Error: An account with that email address already exists",
			);
	});
});
