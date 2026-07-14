/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 7/14/2026
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

    // database initialization methods
    public async void Initialize() {
        // ensure the database is empty
        if (this.Products.Count() == 0 && this.Accounts.Count() == 0) {
            // add an account to the database
            this.Accounts.Add(new Account { Email = "basicuser@email.com", Password = "supersecretpassword" });

            // add products to the database
            this.Products.Add(new Product { Name = "Apple", Price = 2.99, InventoryCount = 500, Rating = 4, AccountId = 1 });
            this.Products.Add(new Product { Name = "Banana", Price = 1.99, InventoryCount = 364, Rating = 5, AccountId = 1 });

            // save the changes to the database
            await this.SaveChangesAsync();
        }
    }

    // get methods
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
        // iterate through each account and return the one that matches the id
        foreach (Product product in this.Products) {
            if (id == product.Id) {
                return product;
            }
        }
        // if no account matched the id return an empty account
        return new Product();
    }

    /*Define a method to get products by their AccountId*/
    public List<Product> GetProductsByAccountId(int accountId) {
        // create a list to hold products with matching ids
        List<Product> productList = new List<Product>();

        // iterate through each account and add ones with matching AccountIds to the list
        foreach (Product product in this.Products) {
            if (accountId == product.AccountId) {
                productList.Add(product);
            }
        }
        
        // return the productList
        return productList;
    }

    /*Define a method to get a list of orders by their AccountId*/
    public List<Order> GetOrdersByAccountId(int accountId) {
        // iterate through each order and return the one that matches the accountId
        List<Order> orders = new List<Order>();
        foreach (Order order in this.Orders.ToList()) {
            if (accountId == order.AccountId) {
                orders.Add(order);
            }
        }

        // return the list of orders
        return orders;
    }

    /*Define a method to get a list of orders based on the AccountId of their product*/
    public List<Order> GetOrdersByProductAccountId(int accountId) {
        // iterate through each order and return the one that matches the accountId
        List<Order> orders = new List<Order>();
        foreach (Order order in this.Orders.ToList()) {
            // get the product associated with the order
            Product product = this.GetProductById(order.ProductId);

            // add the order to the list if the product's AccountId matches the given accountId
            if (accountId == product.AccountId) {
                orders.Add(order);
            }
        }

        // return the list of orders
        return orders;
    }

    // deletion methods
    /*Define a method to safely delete a product and its associated data by the product id*/
    public async void DeleteProductById(int productId) {
        // delete orders associated with the product
        this.DeleteOrdersByProductId(productId);

        // delete the product
        Product product = this.GetProductById(productId);
        this.Products.Remove(product);
        await this.SaveChangesAsync();
    }

    /*Define a method to delete orders a specific ProductId*/
    public async void DeleteOrdersByProductId(int productId) {
        // iterate through each order and add ones with a matching productId to the deletion list
        List<Order> ordersToDelete = new List<Order>();
        foreach (Order order in this.Orders) {
            if (productId == order.ProductId) {
                ordersToDelete.Add(order);
            }
        }

        // delete every order in the deletion list
        foreach (Order order in ordersToDelete) {
            this.Orders.Remove(order);
        }
        await this.SaveChangesAsync();
    }

    // validation methods
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