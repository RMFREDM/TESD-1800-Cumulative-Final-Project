import { faker } from "@faker-js/faker";

describe("Product Purchasing Process", () => {
	it("prevents purchasing when logged out", () => {
		// visit the products page
		cy.visit(Cypress.config().baseUrl);

		// get the products list and ensure the purchase buttons aren't visible
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#purchase-button").should("not.exist");
			});
	});

	// generate account and product data to use throughout the next tests
	const email = faker.internet.email();
	const password = faker.internet.password();
	const productName = faker.commerce.product();
	const price = faker.commerce.price();
	const count = faker.number.int(2147483647);
	const rating = faker.number.int(5);

	it("allows purchasing when logged in", () => {
		// create an account and log into it
		cy.createAccount(email, password);
		cy.logIn(email, password);

		// create a product to operate with
		cy.createProduct(productName, price, count, rating);

		// get the products list and ensure the purchase buttons are visible
		cy.get('ul[name="products-list"]')
			.should("be.visible")
			.within(($list) => {
				cy.get("#purchase-button").should("be.visible");
				// ensure the inventory count is equal to the count
				cy.get("li:last")
					.should("contain.text", count + " in inventory")
					.within(($li) => {
						// ensure the purchase form doesn't exist
						cy.get("#purchase-form").should("not.exist");

						// click on the purchase button
						cy.get("#purchase-button").click();
						cy.get("#purchase-form").should("be.visible");
						cy.get("#purchase-button").should("be.hidden");

						// test the cancel button
						cy.get('button[name="cancel-button"]')
							.should("be.visible")
							.and("have.text", "Cancel")
							.click();
						cy.get("#purchase-form").should("not.exist");
						cy.get("#purchase-button").should("be.visible").click();

						// ensure the purchase form was created and purchase 1 item
						cy.get('#purchase-form > label[for="quantity"]')
							.should("be.visible")
							.and("have.text", "How much will you order?");
						cy.get(
							'#purchase-form > input[name="quantity"][type="number"][min=1][max=' +
								count +
								"][required]",
						)
							.should("be.visible")
							.type("1");

						// submit the form
						cy.get('button[type="submit"]')
							.should("be.visible")
							.and("have.text", "Purchase")
							.click();
					});
			});

		// ensure an order success message is displayed
		cy.url().should("eq", Cypress.config().baseUrl + "/");

		cy.get("#message")
			.should("be.visible")
			.and(
				"contains.text",
				"Order made by " + email + "! OrderID: ",
				", Product: " + productName + ", Total Price: $" + price,
			);

		// ensure the inventory count of the product went down by 1
		cy.get('ul[name="products-list"] > li:last').should(
			"contain.text",
			count - 1 + " in inventory",
		);
	});
});
