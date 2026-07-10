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
const getResponse = await fetch(databasePath + "/orders", {
	credentials: "include",
});
const ordersJson = await getResponse.json();

// log the contents of ordersJson
console.log("ordersJson:");
console.log(ordersJson);

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
		// create a new li and add the contents of the order to its text
		const newOrder = document.createElement("li");
		newOrder.innerText =
			order.name +
			": $" +
			order.price.toFixed(2) +
			", " +
			order.inventoryCount +
			" in inventory, rating: " +
			order.rating;

		// add the new li to the order list ul
		ordersList.appendChild(newOrder);
	});
} else {
	const emptyMessage = document.createElement("p");
	emptyMessage.id = "empty-orders-message";
	emptyMessage.innerText = "You do not have any orders yet.";
	ordersList.appendChild(emptyMessage);
}
