// create a function that adds a cancel button to a form
export function addCancelButton(form, formParent, formDisplayButton) {
	// create the cancel button
	const cancelButton = document.createElement("button");
	cancelButton.name = "cancel-button";
	cancelButton.innerText = "Cancel";

	// handle clicking on the cancel button
	cancelButton.addEventListener("click", (e) => {
		// prevent the button's default action
		e.preventDefault();

		// destroy the form and restore the purchase button
		formDisplayButton.hidden = false;
		formParent.removeChild(form);
	});

	// add the cancel button to the form
	form.appendChild(cancelButton);
}
