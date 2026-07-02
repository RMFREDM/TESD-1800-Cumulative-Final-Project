/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/22/2026
Create a class for the product database (ProductDb) that holds a set of Products
*/
// import namespaces
using Microsoft.EntityFrameworkCore;

class ProductDb : DbContext
{
    // initialize the tables
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Account> Accounts => Set<Account>();

    /*Use a constructor to create the database object*/
    public ProductDb(DbContextOptions<ProductDb> options): base(options) {
        
    }
}