// import faker
import { faker } from "@faker-js/faker";

describe("Log Out Process", () => {
	it("logs out of accounts", () => {
		// create account to log out of and log into it
		const email = faker.internet.email();
		const password = faker.internet.password();
		cy.createAccount(email, password);
		cy.logIn(email, password);

		// visit the homepage
		cy.visit(Cypress.config().baseUrl);

		// ensure the logout button is visible and click on it
		cy.get('button[id="logout-button"]')
			.should("be.visible")
			.and("have.text", "Log Out")
			.click();

		// ensure a logout success message is displayed
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.get('p[id="message"]')
			.should("be.visible")
			.and("contain.text", "Logged out!");
	});
});
