// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// create a command to create an account
Cypress.Commands.add("createAccount", (newEmail, newPassword) => {
	// visit the create account page
	cy.visit(Cypress.config().baseUrl + "/create_account.html");

	// ensure there is a form with inputs for email and password and type in inputs
	cy.get('form[name="create-account-form"]').within(($form) => {
		cy.get('input[name="email"][required][type="email"]').type(newEmail);
		cy.get('input[name="password"][required][type="password"]').type(
			newPassword,
		);

		// ensure the form submits
		cy.get('button[type="submit"]').click();
	});

	// ensure the user is redirected to the homepage and that a success message is displayed
	cy.url().should("eq", Cypress.config().baseUrl + "/");
	cy.get('p[id="message"]')
		.should("be.visible")
		.and("contain.text", "Account Created! ID: ")
		.and("contain.text", ", Email: " + newEmail);
});

// create a command to log into an account
Cypress.Commands.add("logIn", (email, password) => {
	cy.session(
		email,
		() => {
			// visit the login page
			cy.visit(Cypress.config().baseUrl + "/login.html");

			// log into the account
			cy.get('form[name="login-form"]').within(($form) => {
				// type in the account information
				cy.get('input[name="email"][required][type="email"]').type(
					email,
				);
				cy.get(
					'input[name="password"][required][type="password"]',
				).type(password);

				// submit the form
				cy.get('button[type="submit"]').click();
			});

			// ensure the user is redirected to the homepage and a success message is displayed
			cy.url().should("eq", Cypress.config().baseUrl + "/");
			cy.get('p[id="message"]')
				.should("be.visible")
				.and("contain.text", "Logged into account: " + email);
		},
		{
			validate: () => {
				// ensure there is a cookie that verifies the user's login status
				cy.getCookie("account").should("exist");
			},
		},
	);
});

// create a command to log out of the current account
Cypress.Commands.add("logOut", () => {
	// visit the homepage
	cy.visit(Cypress.config().baseUrl);

	// click the logout button
	cy.get('button[id="logout-button"]').click();

	// ensure a logout success message is displayed
	cy.url().should("eq", Cypress.config().baseUrl + "/");
	cy.get('p[id="message"]').should("be.visible");
});

// create a command to create a product
Cypress.Commands.add("createProduct", (productName, price, count, rating) => {
	// visit the products page
	cy.visit(Cypress.config().baseUrl);

	// clicks on create product button
	cy.get('button[name="create-product-button"]').click();

	// enter the form data and submit the form
	cy.get('form[name="create-product-form"]').within(($form) => {
		cy.get('input[name="name"][type="text"]').type(productName);
		cy.get('input[name="price"][type="number"]').type(price);
		cy.get('input[name="inventory count"][type="number"]').type(count);
		cy.get('input[name="rating"][type="number"]').type(rating);
		cy.get('button[type="submit"]').click();
	});

	// check that the new product was added to the product list
	cy.url().should("eq", "http://localhost:5173/");
	cy.get('ul[name="products-list"] li:last')
		.should("be.visible")
		.and(
			"contain.text",
			productName +
				": $" +
				price +
				", " +
				count +
				" in inventory, rating: " +
				rating,
		);
});

// create a command to order the last product on the products page
Cypress.Commands.add("orderLastProduct", (quantity) => {
	// visit the products page
	cy.visit(Cypress.config().baseUrl);

	// get the last product and order from it
	cy.get('ul[name="products-list"] > li:last > #purchase-button').click();
	cy.get('ul[name="products-list"] > li:last > #purchase-form').within(
		($form) => {
			cy.get('input[name="quantity"]').clear().type(quantity);
			cy.get('button[type="submit"]').click();
		},
	);
});
