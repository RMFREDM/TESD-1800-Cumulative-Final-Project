// import faker
import { faker } from "@faker-js/faker";

describe("Order Deletion Process", () => {
	// create account and product info to use throughout the tests
	const email = faker.internet.email();
	const password = faker.internet.password();

	const productName = faker.commerce.product();
	const price = faker.commerce.price();
	const count = faker.number.int(2147483647);
	const rating = faker.number.int(5);

	// test form/form display button visibility
	it("does not display when logged-out", () => {
		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// ensure that no product deletion buttons exist
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#deletion-button").should("not.exist");
			});
	});
	it("displays when logged-in", () => {
		// create and log into an account and create a product with a purchase to delete
		cy.createAccount(email, password);
		cy.logIn(email, password);
		cy.createProduct(productName, price, count, rating);
		cy.orderLastProduct(1);

		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// ensure that the product deletion button exists
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("li:last > #deletion-button")
					.should("be.visible")
					.and("have.text", "Delete");
			});
	});
	it("does not display on products not created by the current user", () => {
		// create and log into a new account
		const newEmail = faker.internet.email();
		const newPassword = faker.internet.password();
		cy.createAccount(newEmail, newPassword);
		cy.logIn(newEmail, newPassword);

		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// ensure that no product deletion buttons exist
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("li:last > #deletion-button").should("not.exist");
			});
	});
	it("displays a confirmation form", () => {
		// log into the account
		cy.logIn(email, password);
		cy.visit(Cypress.config().baseUrl);

		// ensure the deletion form doesn't exist, then click on the product's delete button
		cy.get(
			'ul[name="products-list"] > li:last > #product-deletion-form',
		).should("not.exist");
		cy.get('ul[name="products-list"] > li:last > #deletion-button')
			.should("be.visible")
			.click();
		cy.get('ul[name="products-list"] > li:last > #deletion-button').should(
			"be.hidden",
		);

		// ensure the deletion form displayed correctly
		cy.get('ul[name="products-list"] > li:last > #product-deletion-form')
			.should("be.visible")
			.within(($form) => {
				// ensure the confirmation message and delete button displays correctly
				cy.get('[id="deletion-text"]')
					.should("be.visible")
					.and(
						"have.text",
						"Are you sure you want to delete the product " +
							productName +
							"?",
					);
				cy.get('button[type="submit"]')
					.should("be.visible")
					.and("have.text", "Delete");

				// ensure the cancel button displays correctly and functions correctly
				cy.get("#cancel-button")
					.should("be.visible")
					.and("have.text", "Cancel")
					.click();
			});

		// ensure the deletion form is removed and the delete button is restored
		cy.get(
			'ul[name="products-list"] > li:last > #product-deletion-form',
		).should("not.exist");
		cy.get('ul[name="products-list"] > li:last > #deletion-button').should(
			"be.visible",
		);
	});

	// test functionality
	it("deletes products", () => {
		// login and visit the products page
		cy.logIn(email, password);
		cy.visit(Cypress.config().baseUrl);

		// delete the last product (the one previously created)
		cy.get('ul[name="products-list"] > li:last > #deletion-button').click();
		cy.get(
			'ul[name="products-list"] > li:last > #product-deletion-form > button[type="submit"]',
		).click();

		// ensure the url is correct and that the product was removed
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.get('ul[name="products-list"] > li:last').should(
			"not.contain.text",
			productName +
				": $" +
				price +
				", " +
				count +
				" in inventory, rating: " +
				rating,
		);

		// ensure that the order was removed
		cy.visit(Cypress.config().baseUrl + "/orders.html");
		cy.get(
			'ul[name="your-product-orders-list"] > #empty-orders-message',
		).should("exist");
	});
});
