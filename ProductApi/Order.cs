/*
Author: Joshua Willis
Created: 7/08/2026
Updated: 7/09/2026
Create an Order class that contains properties for the product ordered, the quantity ordered, and the user that made the order
*/

public class Order {
    // create the necessary fields for the order
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public int AccountId { get; set; }

    /*Define a method to get the total price of an order*/
    public double GetTotalPrice(ProductDb db) {
        Product product = db.GetProductById(this.ProductId);
        return Math.Round(product.Price * (double)this.Quantity, 2);
    }
}