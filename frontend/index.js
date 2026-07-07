/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/23/2026
Dynamically pull products from the database and add them to a ul on index.html
*/
// import functions
import { getCookie, removeCookie } from "./util/cookieFunctions";
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
	const newLi = document.createElement("li");
	newLi.innerText =
		product.name +
		": $" +
		product.price.toFixed(2) +
		", " +
		product.inventoryCount +
		" in inventory, rating: " +
		product.rating;

	// add the new li to the products list ul
	productsList.appendChild(newLi);
});

// manage the visibility of the create-product-form
const formVisibilityButton = document.querySelector(
	'button[name="create-product-button"]',
);
const createProductForm = document.querySelector(
	'form[name="create-product-form"]',
);
formVisibilityButton.addEventListener("click", (e) => {
	// prevent the button's default action
	e.preventDefault();

	// change the visibility of the create-product-form and its visibility button
	formVisibilityButton.style.visibility = "hidden";
	createProductForm.style.visibility = "visible";
});

// handle adding new products to the database
createProductForm.addEventListener("submit", async (e) => {
	// prevent the default form action
	e.preventDefault();

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
	const submitProduct = fetch(databasePath + "/products", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	// reload the page
	location.reload();
});
