// import faker
import { faker } from "@faker-js/faker";

describe("Products Page", () => {
	// test that products are listed
	it("lists products", () => {
		// visit the products page
		cy.visit("http://localhost:5173");

		// ensure there is a page header
		cy.get("h1").should("be.visible").and("have.text", "Products");

		// ensure there is an unordered list of products
		cy.get('ul[name="products-list"]').should("be.visible");
	});

	// test that products can be created
	it("creates products", () => {
		// visit the products page
		cy.visit("http://localhost:5173");

		// clicks on create product button
		cy.get('button[name="create-product-button"]')
			.should("be.visible")
			.and("have.text", "Create New Product")
			.click();

		// generate fake data using faker
		const randomName = faker.commerce.product();
		const randomPrice = faker.commerce.price();
		const randomCount = faker.number.int();
		const randomRating = faker.number.int(5);

		// ensure there is a form with inputs for product name, price, and inventory count and input the data
		cy.get('form[name="create-product-form"]').should("be.visible");

		cy.get(
			'form[name="create-product-form"] > input[name="name"][type="text"]',
		)
			.should("be.visible")
			.type(randomName);

		cy.get(
			'form[name="create-product-form"] > input[name="price"][type="number"]',
		)
			.should("be.visible")
			.type(randomPrice);

		cy.get(
			'form[name="create-product-form"] > input[name="inventory count"][type="number"]',
		)
			.should("be.visible")
			.type(randomCount);

		cy.get(
			'form[name="create-product-form"] > input[name="rating"][type="number"]',
		)
			.should("be.visible")
			.type(randomRating);

		cy.get('form[name="create-product-form"] > button[type="submit"]')
			.should("be.visible")
			.and("have.text", "Create Product")
			.click();

		cy.url().should("eq", "http://localhost:5173/");

		// check that the new product was added to the product list
		cy.get('ul[name="products-list"] li:last')
			.should("be.visible")
			.and(
				"have.text",
				randomName +
					": $" +
					randomPrice +
					", " +
					randomCount +
					" in inventory, rating: " +
					randomRating,
			);
	});
});
