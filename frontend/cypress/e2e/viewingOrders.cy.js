import { faker } from "@faker-js/faker";

describe("View Orders Page", () => {
	// generate account data to use throughout the next tests
	const email = faker.internet.email();
	const password = faker.internet.password();

	// test the pages links
	it("does not have a link on the homepage when logged-out", () => {
		// visit the homepage
		cy.visit(Cypress.config().baseUrl);

		// test for a link to the log in page in the header
		cy.get('header > a[id="view-orders-link"]').should("not.exist");
	});
	it("has a link on the homepage when logged-in", () => {
		// create and log into the account
		cy.createAccount(email, password);
		cy.logIn(email, password);

		// visit the homepage
		cy.visit(Cypress.config().baseUrl);

		// test for a link to the log in page in the header
		cy.get('header > a[id="view-orders-link"]')
			.should("be.visible")
			.and("have.text", "Your Orders")
			.click();

		// ensure the url is correct
		cy.url().should("eq", Cypress.config().baseUrl + "/orders.html");
	});
	it("has a link to the homepage", () => {
		// log into the account
		cy.logIn(email, password);

		// visit the orders page
		cy.visit(Cypress.config().baseUrl + "/orders.html");

		// test for a link to the log in page in the header
		cy.get('header > a[id="homepage-link"]')
			.should("be.visible")
			.and("have.text", "Home")
			.click();

		// ensure the url is correct
		cy.url().should("eq", Cypress.config().baseUrl + "/");
	});

	// test that orders are displayed properly
	it("displays a message when there are no orders", () => {
		// log into the account
		cy.logIn(email, password);

		// visit the orders page
		cy.visit(Cypress.config().baseUrl + "/orders.html");

		// ensure there is a page header
		cy.get("h1").should("be.visible").and("have.text", "Your Orders");

		// ensure there is an empty list of orders
		cy.get('ul[name="personal-orders-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#empty-orders-message")
					.should("be.visible")
					.and("have.text", "You do not have any orders yet.");
				cy.get("li").should("not.exist");
			});
	});
	it("lists existing orders", () => {
		// log into the account
		cy.logIn(email, password);

		// create a product to order from
		const productName = faker.commerce.product();
		const price = faker.commerce.price();
		const count = faker.number.int(2147483647);
		const rating = faker.number.int(5);
		cy.createProduct(productName, price, count, rating);

		// order from the product and return to the orders page
		cy.visit(Cypress.config().baseUrl);
		cy.get(
			'ul[name="personal-orders-list"] > li:last > #purchase-button',
		).click();
		cy.get(
			'ul[name="personal-orders-list"] > li:last > #purchase-form',
		).within(($form) => {
			cy.get('input[name="quantity"]').clear().type(1);
			cy.get('button[type="submit"]').click();
		});
		cy.visit(Cypress.config().baseUrl + "/orders.html");

		// ensure there is an empty list of orders
		cy.get('ul[name="personal-orders-list"]').within(($list) => {
			cy.get("#empty-orders-message").should("not.exist");
			cy.get("li:last")
				.should("be.visible")
				.and(
					"contain.text",
					"Product: ",
					"Total Price: $",
					"Order ID: 1",
					productName,
				);
		});
	});
});
