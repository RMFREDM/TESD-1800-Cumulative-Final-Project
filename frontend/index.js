/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/23/2026
Dynamically pull products from the database and add them to a ul on index.html
*/
// import functions
import {
	getCookie,
	removeCookie,
	setCookie,
	validateAccount,
} from "./util/cookieFunctions";
import { createHeader } from "./util/createHeaderFunction.js";
import { databasePath } from "./util/pathConstants";

// create the header
createHeader(document.querySelector("header"));

// fetch data from the database
const getResponse = await fetch(databasePath + "/products", {
	credentials: "include",
});
const productsJson = await getResponse.json();

// log the contents of productsJson
console.log("productsJson:");
console.log(productsJson);

// if there is a success message, display it
const message = getCookie("message");
removeCookie("message");
if (message != null) {
	const successParagraph = document.getElementById("message");
	successParagraph.innerText = message;
	successParagraph.style.visibility = "visible";
}

// loop through every product in the database and add it to the ul in index as an li
const productsList = document.querySelector('ul[name="products-list"]');
productsJson.forEach((product) => {
	// create a new li and add the contents of the product to its text
	const newProduct = document.createElement("li");
	newProduct.innerText =
		product.name +
		": $" +
		product.price.toFixed(2) +
		", " +
		product.inventoryCount +
		" in inventory, rating: " +
		product.rating;

	// add a purchase button to the product if the inventory count is greater than zero and the user is signed in
	if (product.inventoryCount > 0 && getCookie("account") != null) {
		const purchaseButton = document.createElement("button");
		purchaseButton.id = "purchase-button";
		purchaseButton.innerText = "Purchase";
		purchaseButton.addEventListener("click", (e) => {
			// prevent the button's default action
			e.preventDefault();

			// create a form to purchase the product
			const purchaseForm = document.createElement("form");
			purchaseForm.id = "purchase-form";
			purchaseForm.innerHTML =
				'<label for="quantity">How much will you order?</label> <input type="number" min="1" max="' +
				product.inventoryCount +
				'" name="quantity" required>';

			// create the submit button
			const submitButton = document.createElement("button");
			submitButton.type = "submit";
			submitButton.innerText = "Purchase";
			purchaseForm.appendChild(submitButton);

			// create the cancel button
			const cancelButton = document.createElement("button");
			cancelButton.name = "cancel-button";
			cancelButton.innerText = "Cancel";
			cancelButton.addEventListener("click", (e) => {
				// prevent the button's default action
				e.preventDefault();

				// destroy the form and restore the purchase button
				purchaseButton.style.visibility = "visible";
				newProduct.removeChild(purchaseForm);
			});
			purchaseForm.appendChild(cancelButton);

			// handle form submission
			purchaseForm.addEventListener("submit", async (e) => {
				// prevent the form's default action
				e.preventDefault();

				// send a post request to the database with the form data
				const formData = new FormData(purchaseForm);
				const body = {
					Quantity: formData.get("quantity"),
					ProductId: product.id,
				};
				console.log("formData");
				console.log(body);
				const orderResponse = await fetch(databasePath + "/order", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
					credentials: "include",
				});
				const orderJson = await orderResponse.json();
				setCookie("message", orderJson.message);

				// reload the page
				location.reload();
			});

			// replace the purchase button with the form
			newProduct.appendChild(purchaseForm);
			purchaseButton.style.visibility = "hidden";
		});
		newProduct.appendChild(purchaseButton);
	}

	// add the new li to the products list ul
	productsList.appendChild(newProduct);
});

// if the account is valid, create the create product form and button
if ((await validateAccount()) == "account is valid") {
	// crete the create product form and add it to the document
	const createProductForm = document.createElement("form");
	createProductForm.method = "post";
	createProductForm.name = "create-product-form";
	createProductForm.style.visibility = "hidden";

	// add content to the form
	createProductForm.innerHTML =
		'<label for="name">Product Name</label> <input type="text" name="name"> <label for="Price">Product Price</label> <input type="number" step="0.01" min="0" name="price"> <label for="inventory count">Inventory Count</label> <input type="number" min="0" name="inventory count"> <label for="rating">Rating</label> <input type="number" min="0" max="5" name="rating"> <button type="submit">Create Product</button>';

	// handle adding new products to the database
	createProductForm.addEventListener("submit", async (e) => {
		// prevent the default form action and validate the user's account
		e.preventDefault();

		// only submit the form if the account is valid
		if ((await validateAccount()) == "account is valid") {
			// send a post request to the database with the form data
			const formData = new FormData(createProductForm);
			const body = {
				Name: formData.get("name"),
				Price: formData.get("price"),
				InventoryCount: formData.get("inventory count"),
				Rating: formData.get("rating"),
			};
			console.log("formData");
			console.log(body);
			const submitProduct = await fetch(databasePath + "/products", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				credentials: "include",
			});
			const productJson = await submitProduct.json();
			setCookie("message", productJson.message);
		} else {
			// set an error message if the account was invalid
			setCookie("message", "Your account is invalid");
		}

		// reload the page
		location.reload();
	});
	document.querySelector("body").appendChild(createProductForm);

	// create the form visibility button and add it to the bottom of the document
	const formVisibilityButton = document.createElement("button");
	formVisibilityButton.name = "create-product-button";
	formVisibilityButton.innerText = "Create New Product";
	formVisibilityButton.addEventListener("click", (e) => {
		// prevent the button's default action
		e.preventDefault();

		// change the visibility of the create-product-form and its visibility button
		formVisibilityButton.style.visibility = "hidden";
		createProductForm.style.visibility = "visible";
	});
	document.querySelector("body").appendChild(formVisibilityButton);
}
