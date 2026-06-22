/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/22/2026
Create and run the product database for the e-commerce site 
*/
// import namespaces
using Microsoft.EntityFrameworkCore;

// build the webapp for the database
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
var app = builder.Build();

// handle a Get request by asynchronously returning a list of the Products in the database
app.MapGet("/products", async (ProductDb db) => {
        db.Products.Add(new Product("Apple", "A red fruit", 2.99));
        db.Products.Add(new Product("Banana", "A yellow fruit", 1.99));
        await db.Products.ToListAsync();
    });

// run the database
app.Run();
