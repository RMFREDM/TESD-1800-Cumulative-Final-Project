/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/23/2026
Dynamically pull orders linked to the current account from the database and add them to a ul
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

// redirect the user if their account is invalid
if ((await validateAccount()) == "account is invalid") {
	location.replace("/");
}

// create the header
createHeader(document.querySelector("header"));

// fetch data from the database
const ordersResponse = await fetch(databasePath + "/orders", {
	credentials: "include",
});
const ordersJson = await ordersResponse.json();
const productsResponse = await fetch(databasePath + "/products", {
	credentials: "include",
});
const productsJson = await productsResponse.json();

// log the contents of ordersJson
console.log("ordersJson:");
console.log(ordersJson);
console.log("productsJson:");
console.log(productsJson);

// set the message cookie if applicable
if (ordersJson.message != "") {
	setCookie("message", ordersJson.message);
}

// if there is a message, display it
const message = getCookie("message");
removeCookie("message");
if (message != null) {
	const successParagraph = document.getElementById("message");
	successParagraph.innerText = message;
	successParagraph.style.visibility = "visible";
}

// loop through every order in the database and add it to the ul in index as an li
const ordersList = document.querySelector('ul[name="personal-orders-list"]');
// only try to add orders if there are orders to add
console.log("number of orders: " + ordersJson.orders.length);
if (ordersJson.orders.length > 0) {
	ordersJson.orders.forEach((order) => {
		// get the product associated with the order
		let product = productsJson[order.productId - 1];

		// create a new li and add the contents of the order to its text
		const newOrder = document.createElement("li");
		newOrder.innerText =
			"Order ID: " +
			order.id +
			", Product: " +
			product.name +
			", Total Price: $" +
			(product.price * order.quantity).toFixed(2);

		// add the new li to the order list ul
		ordersList.appendChild(newOrder);
	});
} else {
	const emptyMessage = document.createElement("p");
	emptyMessage.id = "empty-orders-message";
	emptyMessage.innerText = "You do not have any orders yet.";
	ordersList.appendChild(emptyMessage);
}
