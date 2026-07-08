/*
Author: Joshua Willis
Created: 7/08/2026
Updated: 7/08/2026
Create an Order class that contains properties for the product ordered, the quantity ordered, and the user that made the order
*/

public class Order {
    // create the necessary fields for the order
    public int Id { get; set; }
    public int ProductId { get; set; }
    public double Quantity { get; set; }
    public int AccountId { get; set; }
}