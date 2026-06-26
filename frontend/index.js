/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/23/2026
Dynamically pull products from the database and add them to a ul on index.html
*/

// fetch data from the database
const getResponse = await fetch("http://localhost:5287/products");
const productsJson = await getResponse.json();

// log the contents of productsJson
console.log("productsJson:");
console.log(productsJson);

// loop through every product in the database and add it to the ul in index as an li
const productsList = document.querySelector('ul[name="products-list"]');
productsJson.forEach((product) => {
	// create a new li and add the contents of the product to its text
	const newLi = document.createElement("li");
	newLi.innerText =
		product.name +
		": $" +
		product.price +
		", " +
		product.inventoryCount +
		" in inventory";

	// add the new li to the products list ul
	productsList.appendChild(newLi);
});

// handle adding new products to the database
const createProductForm = document.querySelector(
	'form[name="create-product-form"]',
);
createProductForm.addEventListener("submit", async (e) => {
	// prevent the default form action
	e.preventDefault();

	// send a post request to the database with the form data
	const submitProduct = fetch("http://localhost:5287/products", {
		method: "post",
	});

	// reload the page
	location.reload();
});
