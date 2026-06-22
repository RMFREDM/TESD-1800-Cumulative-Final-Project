describe("Products", () => {
	it("lists products", () => {
		// visit the products page
		cy.visit("http://localhost:5173");

		// ensure there is a page header
		cy.get("h1").should("be.visible").and("have.text", "Products");

		// ensure there is an unordered list of products
		cy.get('ul[name="products-list"]').should("be.visible");
	});
});
