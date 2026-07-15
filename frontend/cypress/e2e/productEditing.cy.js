// import faker
import { faker } from "@faker-js/faker";

describe("Order Editing Process", () => {
	// create account and product info to use throughout the tests
	const email = faker.internet.email();
	const password = faker.internet.password();

	const productName = faker.commerce.product();
	const price = faker.commerce.price();
	const count = faker.number.int(2147483647);
	const rating = faker.number.int(5);

	const updatedProductName = faker.commerce.product();
	const updatedPrice = faker.commerce.price();
	const updatedCount = faker.number.int(2147483647);
	const updatedRating = faker.number.int(5);

	// test form/form display button visibility
	it("does not display when logged-out", () => {
		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// ensure that no product edit buttons exist
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#edit-button").should("not.exist");
			});
	});
	it("displays when logged-in", () => {
		// create and log into an account and create a product to edit
		cy.createAccount(email, password);
		cy.logIn(email, password);
		cy.createProduct(productName, price, count, rating);

		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// ensure that the product edit button exists
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("li:last > #edit-button")
					.should("be.visible")
					.and("have.text", "Edit");
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

		// ensure that no product edit buttons exist
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("li:last > #edit-button").should("not.exist");
			});
	});
	it("displays a prepopulated form", () => {
		// log into the account
		cy.logIn(email, password);
		cy.visit(Cypress.config().baseUrl);

		// ensure the edit form doesn't exist, then click on the product's edit button
		cy.get(
			'ul[name="products-list"] > li:last > #product-edit-form',
		).should("not.exist");
		cy.get('ul[name="products-list"] > li:last > #edit-button')
			.should("be.visible")
			.click();
		cy.get('ul[name="products-list"] > li:last > #edit-button').should(
			"be.hidden",
		);

		// ensure the edit form displayed correctly
		cy.get('ul[name="products-list"] > li:last > #product-edit-form')
			.should("be.visible")
			.within(($form) => {
				// ensure the prepopulated data displays correctly
				cy.get('input[name="name"][type="text"]')
					.should("be.visible")
					.and("have.value", productName);

				cy.get('input[name="price"][type="number"]')
					.should("be.visible")
					.and("have.value", price);

				cy.get('input[name="inventory count"][type="number"]')
					.should("be.visible")
					.and("have.value", count);

				cy.get('input[name="rating"][type="number"]')
					.should("be.visible")
					.and("have.value", rating);

				// ensure the edit button displays correctly
				cy.get('button[type="submit"]')
					.should("be.visible")
					.and("have.text", "Edit Product");

				// ensure the cancel button displays correctly and functions correctly
				cy.get("#cancel-button")
					.should("be.visible")
					.and("have.text", "Cancel")
					.click();
			});

		// ensure the edit form is removed and the edit button is restored
		cy.get(
			'ul[name="products-list"] > li:last > #product-edit-form',
		).should("not.exist");
		cy.get('ul[name="products-list"] > li:last > #edit-button').should(
			"be.visible",
		);
	});

	// test functionality
	it("edits products", () => {
		// login and visit the products page
		cy.logIn(email, password);
		cy.visit(Cypress.config().baseUrl);

		// edit the last product (the one previously created)
		cy.get('ul[name="products-list"] > li:last > #edit-button').click();
		cy.get(
			'ul[name="products-list"] > li:last > #product-edit-form',
		).within(($form) => {
			cy.get('input[name="name"][type="text"]')
				.should("be.visible")
				.clear()
				.type(updatedProductName);

			cy.get('input[name="price"][type="number"]')
				.should("be.visible")
				.clear()
				.type(updatedPrice);

			cy.get('input[name="inventory count"][type="number"]')
				.should("be.visible")
				.clear()
				.type(updatedCount);

			cy.get('input[name="rating"][type="number"]')
				.should("be.visible")
				.clear()
				.type(updatedRating);

			// submit the form
			cy.get('button[type="submit"]').click();
		});

		// ensure the url is correct and that the product was removed
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.get('ul[name="products-list"] > li:last')
			.should(
				"not.contain.text",
				productName +
					": $" +
					price +
					", " +
					count +
					" in inventory, rating: " +
					rating,
			)
			.should(
				"contain.text",
				updatedProductName +
					": $" +
					updatedPrice +
					", " +
					updatedCount +
					" in inventory, rating: " +
					updatedRating,
			);

		// ensure a success message is displayed
		cy.get('p[id="message"]')
			.should("be.visible")
			.and("contain.text", "Edited Product! ID: ")
			.and(
				"contain.text",
				", Old Name: " +
					productName +
					", Old Price: $" +
					price +
					", Old Quantity: " +
					count +
					", Old Rating: " +
					rating +
					", Updated Name: " +
					updatedProductName +
					", Updated Price: $" +
					updatedPrice +
					", Updated Quantity: " +
					updatedCount +
					", Updated Rating: " +
					updatedRating,
			);
	});
});
