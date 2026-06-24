/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 6/22/2026
Create a class for the product database (ProductDb) that holds a set of Products
*/
// import namespaces
using Microsoft.EntityFrameworkCore;

namespace ProductApi {
    public class ProductDb : DbContext {
        // initialize the Products list
        public DbSet<Product> Products => Set<Product>();

        /*Use a constructor to create the database object*/
        public ProductDb(DbContextOptions<ProductDb> options): base(options) {
        
        }
    }
}