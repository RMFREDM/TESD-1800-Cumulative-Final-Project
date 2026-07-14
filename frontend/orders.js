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
const personalOrdersResponse = await fetch(databasePath + "/my_orders", {
	credentials: "include",
});
const personalOrdersJson = await personalOrdersResponse.json();

const productOrdersResponse = await fetch(databasePath + "/product_orders", {
	credentials: "include",
});
const productOrdersJson = await productOrdersResponse.json();

const productsResponse = await fetch(databasePath + "/products", {
	credentials: "include",
});
const productsJson = await productsResponse.json();

// log the contents of personalOrdersJson
console.log("personalOrdersJson:");
console.log(personalOrdersJson);
console.log("productsJson:");
console.log(productsJson);

// set the message cookie if applicable
if (personalOrdersJson.message != "" && productOrdersJson.message != "") {
	setCookie(
		"message",
		personalOrdersJson.message + ", " + productOrdersJson.message,
	);
} else if (
	personalOrdersJson.message != "" &&
	productOrdersJson.message == ""
) {
	setCookie("message", personalOrdersJson.message);
} else if (
	personalOrdersJson.message == "" &&
	productOrdersJson.message != ""
) {
	setCookie("message", productOrdersJson.message);
}

// if there is a message, display it
const message = getCookie("message");
removeCookie("message");
if (message != null) {
	const successParagraph = document.getElementById("message");
	successParagraph.innerText = message;
	successParagraph.style.visibility = "visible";
}

// loop through every order the user made and add it to the ul in index as an li
const personalOrdersList = document.querySelector(
	'ul[name="personal-orders-list"]',
);
// only try to add orders if there are orders to add
console.log(
	"number of orders you've made: " + personalOrdersJson.orders.length,
);
if (personalOrdersJson.orders.length > 0) {
	personalOrdersJson.orders.forEach((order) => {
		// get the product associated with the order
		let product;
		productsJson.forEach((productItem) => {
			if (productItem.id == order.productId) {
				product = productItem;
			}
		});

		// create a new li and add the contents of the order to its text
		const newOrder = document.createElement("li");
		newOrder.innerText =
			"Order ID: " +
			order.id +
			", Product: " +
			product.name +
			", Quantity Purchased: " +
			order.quantity +
			", Total Price: $" +
			(product.price * order.quantity).toFixed(2);

		// add the new li to the order list ul
		personalOrdersList.appendChild(newOrder);
	});
} else {
	const emptyMessage = document.createElement("p");
	emptyMessage.id = "empty-orders-message";
	emptyMessage.innerText = "You do not have any orders yet.";
	personalOrdersList.appendChild(emptyMessage);
}

// loop through every order the user made and add it to the ul in index as an li
const productOrdersList = document.querySelector(
	'ul[name="your-product-orders-list"]',
);
// only try to add orders if there are orders to add
console.log(
	"number of orders for your products: " + productOrdersJson.orders.length,
);
if (productOrdersJson.orders.length > 0) {
	productOrdersJson.orders.forEach((order) => {
		// get the product associated with the order
		let product;
		productsJson.forEach((productItem) => {
			if (productItem.id == order.productId) {
				product = productItem;
			}
		});

		// create a new li and add the contents of the order to its text
		const newOrder = document.createElement("li");
		newOrder.innerText =
			"Order ID: " +
			order.id +
			", Product: " +
			product.name +
			", Quantity Purchased: " +
			order.quantity +
			", Total Price: $" +
			(product.price * order.quantity).toFixed(2);

		// add the new li to the order list ul
		productOrdersList.appendChild(newOrder);
	});
} else {
	const emptyMessage = document.createElement("p");
	emptyMessage.id = "empty-orders-message";
	emptyMessage.innerText = "There are no orders for your products yet.";
	productOrdersList.appendChild(emptyMessage);
}
