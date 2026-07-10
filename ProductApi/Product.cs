/*
Author: Joshua Willis
Created: 6/22/2026
Updated: 7/09/2026
Create a Product class that contains public properties for Id, Name, Description, and Price
*/

public class Product
{
    // create the Id, Name, Description, and Price properties
    public int Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public int InventoryCount { get; set; }
    public double Rating { get; set; }

    /*Use a constructor to set base values for an empty product*/
    public Product() {
        
    }
}