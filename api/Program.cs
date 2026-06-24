/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/24/2026
Create and run the product database for the e-commerce site 
*/
// import namespaces
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using ProductApi;

// begin building the webapp for the database
var builder = WebApplication.CreateBuilder([]);

// allow the frontend to access the database
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
    policy  => {
        policy.WithOrigins("http://localhost:5173");
        policy.WithOrigins("http://localhost:4280");
    });
});

// add database context
builder.Services.AddDbContext<ProductDb>(opt => opt.UseInMemoryDatabase("ProductList"));
// builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// finish building the database webapp
var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

// run the database
app.Run();

