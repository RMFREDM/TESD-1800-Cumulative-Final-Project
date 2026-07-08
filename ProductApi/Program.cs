/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 7/08/2026
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
    if (db.Products.Count() == 0) {
        db.Products.Add(new Product { Name = "Apple", Price = 2.99, InventoryCount = 500, Rating = 4 });
        db.Products.Add(new Product { Name = "Banana", Price = 1.99, InventoryCount = 364, Rating = 5 });
        await db.SaveChangesAsync();
    }
    return await db.Products.ToListAsync();
});

// handle a Post request to the products by asynchronously adding the new product to the database
app.MapPost("/products", async (Product newProduct, ProductDb db) => {
   // add new products the the database
    db.Products.Add(newProduct);
    await db.SaveChangesAsync();

    return Results.Created($"/products/{newProduct.Id}", newProduct);
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
    Account account = db.getAccountByEmail(accountCredentials.Email);

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
    if (IsValidAccount(db, context)) {
        // return a success message if the values are valid
        return new {Message = "account is valid"};
    }

    // if the values are invalid, unset them
    context.Session.Remove("accountId");
    context.Response.Cookies.Delete("account");
    return new {Message = "account is invalid"};
});

// run the database
app.Run();

// define a function to validate accounts
bool IsValidAccount(ProductDb db, HttpContext context) {
    // get the values of the accountId session and the account cookie
    var accountId = context.Session.GetInt32("accountId");
    var accountName = context.Request.Cookies["account"];

    // check that the values point to the same account and are valid
    if (accountId != null && accountName != null) {
        if (accountId == db.getAccountByEmail(accountName).Id) {
            // return true if the values are valid
            return true;
        }
    }
    // if the values are invalid, return false
    return false;
}
