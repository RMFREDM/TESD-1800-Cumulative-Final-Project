import { setCookie, validateAccount } from "./cookieFunctions";
import { addCancelButton } from "./elementCreationHelperFunctions";
import { databasePath } from "./pathConstants";

export function createProductCreationForm(parentElement) {
	// create the create product form and add it to the document
	const createProductForm = document.createElement("form");
	createProductForm.method = "post";
	createProductForm.name = "create-product-form";

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

	// create the form visibility button and add it to the bottom of the document
	const formVisibilityButton = document.createElement("button");
	formVisibilityButton.name = "create-product-button";
	formVisibilityButton.innerText = "Create New Product";
	formVisibilityButton.addEventListener("click", (e) => {
		// prevent the button's default action
		e.preventDefault();

		// change the visibility of the create-product-form and its visibility button
		parentElement.appendChild(createProductForm);
		formVisibilityButton.hidden = true;
	});

	// add a cancel button to the product creation form
	addCancelButton(createProductForm, parentElement, formVisibilityButton);

	// add the form to the parent element
	parentElement.appendChild(formVisibilityButton);
}
