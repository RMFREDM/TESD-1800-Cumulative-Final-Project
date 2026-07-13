// import functions
import { getCookie, setCookie } from "./cookieFunctions";
import { addCancelButton } from "./elementCreationHelperFunctions";
import { databasePath } from "./pathConstants";

// create a function that creates a product element based on the passed in product
export function createProductElement(productElement, product) {
	productElement.innerText =
		product.name +
		": $" +
		product.price.toFixed(2) +
		", " +
		product.inventoryCount +
		" in inventory, rating: " +
		product.rating;

	// add a purchase form to the product if the inventory count is greater than zero and the user is signed in
	if (product.inventoryCount > 0 && getCookie("account") != null) {
		addPurchaseForm(productElement, product);
	}
}

// create a function that adds a purchase form to a product element
function addPurchaseForm(productElement, product) {
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
			'<label for="quantity">What quantity will you order?</label> <input type="number" value=' +
			product.id +
			' name="productId" hidden>';

		// create the quantity input
		const quantityInput = document.createElement("input");
		quantityInput.type = "number";
		quantityInput.min = 1;
		quantityInput.max = product.inventoryCount;
		quantityInput.value = 0;
		quantityInput.name = "quantity";
		quantityInput.required = true;
		purchaseForm.appendChild(quantityInput);

		// create the submit button
		const submitButton = document.createElement("button");
		submitButton.type = "submit";
		submitButton.disabled = true;
		submitButton.innerText = "Purchase";
		purchaseForm.appendChild(submitButton);

		// create the cancel button
		addCancelButton(purchaseForm, productElement, purchaseButton);

		// dynamically change whether the submit button is disabled
		quantityInput.addEventListener("input", (e) => {
			// get the value of the input
			const quantity = quantityInput.value;

			// change whether the submit button is disabled
			if (quantity <= 0) {
				submitButton.disabled = true;
			} else if (quantity > product.inventoryCount) {
				submitButton.disabled = true;
			} else {
				submitButton.disabled = false;
			}
		});

		// handle form submission
		purchaseForm.addEventListener("submit", async (e) => {
			// prevent the form's default action
			e.preventDefault();

			// send a post request to the database with the form data
			const formData = new FormData(purchaseForm);
			const body = {
				Quantity: formData.get("quantity"),
				ProductId: formData.get("productId"),
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
		productElement.appendChild(purchaseForm);
		purchaseButton.style.visibility = "hidden";
	});

	// add the purchase form to the product element
	productElement.appendChild(purchaseButton);
}
