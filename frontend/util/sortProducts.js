function sortProducts(products, sortMethod) {
	// define a set of products to sort
	let sortedProducts = products;

	// sort the products based on the sort method
	switch (sortMethod) {
		case "nameAscending":
			sortedProducts.sort((first, second) => {
				if (first.name < second.name) {
					return -1;
				} else if (first.name > second.name) {
					return 1;
				} else {
					return 0;
				}
			});
			break;
		case "priceAscending":
			sortedProducts.sort((first, second) => {
				if (first.price < second.price) {
					return -1;
				} else if (first.price > second.price) {
					return 1;
				} else {
					return 0;
				}
			});
			break;
		case "priceDescending":
			sortedProducts.sort((first, second) => {
				if (first.price > second.price) {
					return -1;
				} else if (first.price < second.price) {
					return 1;
				} else {
					return 0;
				}
			});
			break;
		case "ratingDescending":
			sortedProducts.sort((first, second) => {
				if (first.rating > second.rating) {
					return -1;
				} else if (first.rating < second.rating) {
					return 1;
				} else {
					return 0;
				}
			});
			break;
	}

	// return the sorted products
	return sortedProducts;
}

module.exports = sortProducts;
