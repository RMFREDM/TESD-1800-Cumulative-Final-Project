/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 7/14/2026
Create and run the product database for the e-commerce site 
*/
// import namespaces
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Session;

// begin building the webapp for the database
var builder = WebApplication.CreateBuilder(args);

// allow the frontend to access the database
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options => {
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  => {
                          policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});

// Enable cookies and sessions
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromSeconds(3600);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// add database context
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// finish building the database webapp
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);
app.UseSession();

// handle a Get request to the products by asynchronously returning a list of the Products in the database
app.MapGet("/products", async (ProductDb db) => {
    // seed the database if it is empty
    db.Initialize();

    // return a list of all products
    return await db.Products.ToListAsync();
});

// handle a Post request to the products by asynchronously adding the new product to the database
app.MapPost("/products", async (Product newProduct, ProductDb db, HttpContext context) => {
    // ensure the account is valid
    if (!db.IsValidAccount(context)) {
        return new {Message = "Error: account is invalid"};
    }

   // add new products the the database if the product is valid
   if (newProduct.Name != null && newProduct.Price != null && newProduct.InventoryCount != null && newProduct.Rating <= 5) {
        newProduct.AccountId = (int)context.Session.GetInt32("accountId");
        db.Products.Add(newProduct);
        await db.SaveChangesAsync();

        return new {Message = "Created new product!"};
    } else {
        return new {Message = "error: Product has invalid data"};
    }
});

// handle a Deletion request for a product
app.MapDelete("/products/{productId}", async (int productId, ProductDb db, HttpContext context) => {
    // ensure the account is valid
    if (!db.IsValidAccount(context)) {
        return new {Message = "Error: account is invalid"};
    }

    // get the product, then delete it safely
    Product product = db.GetProductById(productId);
    db.DeleteProductById(productId);

    // return a success message
    return new {Message = "Deleted Product: " + product.Name.ToString()};
});

// handle a Post request to the accounts by asynchronously adding the new account to the database
app.MapPost("/accounts", async (Account newAccount, ProductDb db) => {
    // prevent duplicate email accounts
    foreach (Account account in db.Accounts) {
        if (newAccount.Email == account.Email) {
            return new {MessageType = "error", Message = "An account with that email address already exists"};
        }
    }

    // add the new account to the database
    db.Accounts.Add(newAccount);
    await db.SaveChangesAsync();
    
    
    return new {MessageType = "success", Message = $"Account Created! ID: {newAccount.Id}, Email: {newAccount.Email}"};
});

// handle a login request by verifying data and creating a session for the login
app.MapPost("/login", async (Account accountCredentials, ProductDb db, HttpContext context) => {
    // get the account associated with that email address, if no account is associated, an empty account is received
    Account account = db.GetAccountByEmail(accountCredentials.Email);

    // verify that the passwords match
    if (accountCredentials.Password != null && accountCredentials.Password == account.Password) {
        // set the session and return a success message
        context.Session.SetInt32("accountId", account.Id);
        context.Response.Cookies.Append("account", account.Email, new CookieOptions {
            Expires = DateTimeOffset.UtcNow.AddMinutes(30),
            HttpOnly = false,
            IsEssential = true
        });
        return new {MessageType = "success", Message = $"Logged into account: {account.Email}"};
    } else {
        return new {MessageType = "error", Message = $"The username or password is incorrect."};
    }
});

// handle a logout request by logging out of the current account
app.MapPost("/logout", (HttpContext context) => {
    // unset the sessions/cookies holding account information
    context.Session.Remove("accountId");
    context.Response.Cookies.Delete("account");

    // return a success message
    return new {Message = "Logged out!"};
});

// validate the account information
app.MapPut("/account/validate", (ProductDb db, HttpContext context) => {
    if (db.IsValidAccount(context)) {
        // return a success message if the values are valid
        return new {Message = "account is valid"};
    }

    // if the values are invalid, unset them
    context.Session.Remove("accountId");
    context.Response.Cookies.Delete("account");
    return new {Message = "account is invalid"};
});

// handle order creation
app.MapPost("/order", async (Order newOrder, ProductDb db, HttpContext context) => {
    // ensure the account is valid
    if (!db.IsValidAccount(context)) {
        return new {Message = "Error: account is invalid"};
    }

    // validate the order
    string errorString = "Error: ";
    if (db.GetProductById(newOrder.ProductId).Id != newOrder.ProductId) {
        errorString += "ProductId is out of range, ";
    }
    if (newOrder.Quantity <= 0) {
        errorString += "Quantity is less than or equal to zero, ";
    }
    if (newOrder.Quantity !> db.GetProductById(newOrder.ProductId).InventoryCount) {
        errorString += "Quantity is greater than the inventory, ";
    }
    if (errorString != "Error: ") {
        return new {Message = errorString};
    }
    
    // add the new order to the orders table and decrement the inventory count of the ordered item by the quantity
    newOrder.AccountId = (int)context.Session.GetInt32("accountId");
    db.Orders.Add(newOrder);
    db.GetProductById(newOrder.ProductId).InventoryCount -= newOrder.Quantity;
    await db.SaveChangesAsync();

    return new {Message = $"Order made by {db.GetAccountById(newOrder.AccountId).Email}! OrderID: {newOrder.Id}, Product: {db.GetProductById(newOrder.ProductId).Name}, Total Price: ${newOrder.GetTotalPrice(db)}"};
});

// handle a request for orders from a specific account
app.MapGet("/my_orders", async (ProductDb db, HttpContext context) => {
    // ensure the account is valid
    if (!db.IsValidAccount(context)) {
        return new {Message = "Error: account is invalid", Orders = new List<Order>()};
    }

    // get a list of orders with that account id and return it
    List<Order> orders = new List<Order>();
    orders.AddRange(db.GetOrdersByAccountId((int)context.Session.GetInt32("accountId")));
    return new { Message = "", Orders = orders};
});

// handle a request for orders that are for products from a specific account
app.MapGet("/product_orders", async (ProductDb db, HttpContext context) => {
    // ensure the account is valid
    if (!db.IsValidAccount(context)) {
        return new {Message = "Error: account is invalid", Orders = new List<Order>()};
    }

    // get a list of orders with that account id and return it
    List<Order> orders = new List<Order>();
    orders.AddRange(db.GetOrdersByProductAccountId((int)context.Session.GetInt32("accountId")));
    return new { Message = "", Orders = orders};
});

// run the database
app.Run();
