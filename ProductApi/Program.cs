/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/23/2026
Create and run the product database for the e-commerce site 
*/
// import namespaces
using Microsoft.EntityFrameworkCore;

// begin building the webapp for the database
var builder = WebApplication.CreateBuilder(args);

// allow the frontend to access the database
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  => {
                          policy.WithOrigins("http://localhost:5173");
                      });
});

// add database context
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// finish building the database webapp
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

// handle a Get request by asynchronously returning a list of the Products in the database
app.MapGet("/products", async (ProductDb db) => {
    // seed the database if it is empty
    if (db.Products.Count() == 0) {
        db.Products.Add(new Product { Name = "Apple", Description = "a red fruit", Price = 2.99 });
        db.Products.Add(new Product { Name = "Banana", Description = "a yellow fruit", Price = 1.99 });
        await db.SaveChangesAsync();
    }
    return await db.Products.ToListAsync();
});

// run the database
app.Run();
