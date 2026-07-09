/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 7/09/2026
Create a class for the product database (ProductDb) that holds a set of Products
*/
// import namespaces
using Microsoft.EntityFrameworkCore;

public class ProductDb : DbContext {
    // initialize the tables
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Order> Orders => Set<Order>();

    /*Use a constructor to create the database object*/
    public ProductDb(DbContextOptions<ProductDb> options): base(options) {
        
    }

    /*Define a method to get accounts by their email*/
    public Account GetAccountByEmail(string email) {
        // iterate through each account and return the one that matches the email
        foreach (Account account in this.Accounts) {
            if (email == account.Email) {
                return account;
            }
        }
        // if no account matched the email return an empty account
        return new Account();
    }

    /*Define a method to get accounts by their id*/
    public Account GetAccountById(int id) {
        // iterate through each account and return the one that matches the id
        foreach (Account account in this.Accounts) {
            if (id == account.Id) {
                return account;
            }
        }
        // if no account matched the email return an empty account
        return new Account();
    }

    /*Define a method to get products by their id*/
    public Product GetProductById(int id) {
        // iterate through each account and return the one that matches the email
        foreach (Product product in this.Products) {
            if (id == product.Id) {
                return product;
            }
        }
        // if no account matched the email return an empty account
        return new Product();
    }

    /*Define a function to validate accounts*/
    public bool IsValidAccount(HttpContext context) {
        // get the values of the accountId session and the account cookie
        var accountId = context.Session.GetInt32("accountId");
        var accountEmail = context.Request.Cookies["account"];

        // check that the values point to the same account and are valid
        if (accountId != null && accountEmail != null) {
            if (accountId == this.GetAccountByEmail(accountEmail).Id) {
                // return true if the values are valid
                return true;
            }
        }
        // if the values are invalid, return false
        return false;
    }
}