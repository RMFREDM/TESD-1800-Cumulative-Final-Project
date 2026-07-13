import { faker } from "@faker-js/faker";

describe("View Orders Page", () => {
	// generate account data to use throughout the next tests
	const email = faker.internet.email();
	const password = faker.internet.password();

	// test that orders are displayed properly
	it("displays a message when there are no orders", () => {
		// create and log into the account
		cy.createAccount(email, password);
		cy.logIn(email, password);

		// visit the orders page
		cy.visit(Cypress.config().baseUrl + "/orders.html");

		// ensure there is a page header
		cy.get("h1").should("be.visible").and("have.text", "Orders");
		cy.get("h2")
			.should("be.visible")
			.and("have.text", "Orders for Your Products");

		// ensure there is an empty list of orders
		cy.get('ul[name="your-product-orders-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#empty-orders-message")
					.should("be.visible")
					.and(
						"have.text",
						"There are no orders for your products yet.",
					);
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
		cy.get('ul[name="products-list"] > li:last > #purchase-button').click();
		cy.get('ul[name="products-list"] > li:last > #purchase-form').within(
			($form) => {
				cy.get('input[name="quantity"]').clear().type(1);
				cy.get('button[type="submit"]').click();
			},
		);

		// ensure there is a list of orders
		cy.visit(Cypress.config().baseUrl + "/orders.html");
		cy.get('ul[name="your-product-orders-list"]').within(($list) => {
			cy.get("#empty-orders-message").should("not.exist");
			cy.get("li:last")
				.should("be.visible")
				.and("contain.text", "Order ID: ")
				.and(
					"contain.text",
					"Product: " +
						productName +
						", Quantity Purchased: 1, Total Price: $",
				);
		});
	});
});
