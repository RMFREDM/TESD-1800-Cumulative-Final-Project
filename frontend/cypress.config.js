const { defineConfig } = require("cypress");

module.exports = defineConfig({
	allowCypressEnv: false,

	e2e: {
		// set the base url for cypress test suites
		baseUrl: "http://localhost:5173",
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
