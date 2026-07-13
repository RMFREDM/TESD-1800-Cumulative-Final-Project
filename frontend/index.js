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
	validateAccount,
} from "./util/cookieFunctions";
import { createHeader } from "./util/createHeaderFunction.js";
import { createProductCreationForm } from "./util/createProductCreationFormFunctions";
import { createProductElement } from "./util/createProductElementFunctions";
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
	// create a new li and add it to to the products list ul
	const newProduct = document.createElement("li");
	createProductElement(newProduct, product);
	productsList.appendChild(newProduct);
});

// if the account is valid, create the create product form and button
if ((await validateAccount()) == "account is valid") {
	// create the create product form
	createProductCreationForm(document.querySelector("body"));
}
