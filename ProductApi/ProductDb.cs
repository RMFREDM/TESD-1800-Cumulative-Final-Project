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

    /*Define a method to get accounts by their email*/
    public Account getAccountByEmail(string email) {
        // iterate through each account and return the one that matches the email
        foreach (Account account in this.Accounts) {
            if (email == account.Email) {
                return account;
            }
        }
        // if no account matched the email return an empty account
        return new Account();
    }
}