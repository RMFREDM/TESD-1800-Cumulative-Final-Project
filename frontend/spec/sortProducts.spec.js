const sortProducts = require("../util/sortProducts");

// test the sortProducts function
describe("Sorts Products", () => {
	// define some test data
	const testData = [
		{ name: "Shovel", price: 10, inventory: 20, rating: 5 },
		{ name: "Gloves", price: 6, inventory: 40, rating: 3 },
		{ name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
	];

	// test each method of sorting data
	it("sorts by name ascending (alphabetically)", () => {
		// define the expected output
		const expectedOutput = [
			{ name: "Gloves", price: 6, inventory: 40, rating: 3 },
			{ name: "Shovel", price: 10, inventory: 20, rating: 5 },
			{ name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
		];
		// determine the actual output
		const actualOutput = sortProducts(testData, "nameAscending");
		// test to ensure both outputs are the same
		expect(actualOutput).toEqual(expectedOutput);
	});
	it("sorts by price ascending", () => {
		// define the expected output
		const expectedOutput = [
			{ name: "Gloves", price: 6, inventory: 40, rating: 3 },
			{ name: "Shovel", price: 10, inventory: 20, rating: 5 },
			{ name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
		];
		// determine the actual output
		const actualOutput = sortProducts(testData, "priceAscending");
		// test to ensure both outputs are the same
		expect(actualOutput).toEqual(expectedOutput);
	});
	it("sorts by price descending", () => {
		// define the expected output
		const expectedOutput = [
			{ name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
			{ name: "Shovel", price: 10, inventory: 20, rating: 5 },
			{ name: "Gloves", price: 6, inventory: 40, rating: 3 },
		];
		// determine the actual output
		const actualOutput = sortProducts(testData, "priceDescending");
		// test to ensure both outputs are the same
		expect(actualOutput).toEqual(expectedOutput);
	});
	it("sorts by rating descending", () => {
		// define the expected output
		const expectedOutput = [
			{ name: "Shovel", price: 10, inventory: 20, rating: 5 },
			{ name: "Ski Mask", price: 12, inventory: 30, rating: 4 },
			{ name: "Gloves", price: 6, inventory: 40, rating: 3 },
		];
		// determine the actual output
		const actualOutput = sortProducts(testData, "ratingDescending");
		// test to ensure both outputs are the same
		expect(actualOutput).toEqual(expectedOutput);
	});
});
