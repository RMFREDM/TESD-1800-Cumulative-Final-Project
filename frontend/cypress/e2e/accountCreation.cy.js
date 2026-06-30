// import faker
import { faker } from "@faker-js/faker";

describe("Create Account Page", () => {
	it("has a link on the homepage", () => {
		// visit the homepage
		cy.visit("http://localhost:5173");

		// test for a link to the create account page in the header
		cy.get('header > a[id="create-account-link"]')
			.should("be.visible")
			.and("have.text", "Create Account")
			.click();

		cy.url().should("eq", "http://localhost:5173/create_account.html");
	});
	it("has a link to the homepage", () => {
		// visit the create account page
		cy.visit("http://localhost:5173/create_account.html");

		// test for a link to the homepage in the header
		cy.get('header > a[id="homepage-link"]')
			.should("be.visible")
			.and("have.text", "Home")
			.click();

		cy.url().should("eq", "http://localhost:5173/");
	});
	it("creates an account", () => {
		// visit the create account page
		cy.visit("http://localhost:5173/create_account.html");

		// ensure there is a form with inputs for email and password
		cy.get('form[name="create-account-form"]').should("be.visible");

		cy.get('form[name="create-account-form"] > label[for="email"]').should(
			"be.visible",
		);
		cy.get(
			'form[name="create-account-form"] > input[name="email" type="email"]',
		).should("be.visible");

		cy.get(
			'form[name="create-account-form"] > label[for="password"]',
		).should("be.visible");
		cy.get(
			'form[name="create-account-form"] > input[name="password" type="password"]',
		).should("be.visible");

		// ensure the form submits
		cy.get('form[name="create-account-form"] > button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Create Account");
	});
});
