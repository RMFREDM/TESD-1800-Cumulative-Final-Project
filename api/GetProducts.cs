
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

namespace ProductApi {
    public class GetProducts {
        public static ProductDb db;

        public GetProducts(ProductDb context) {
            GetProducts.db = context;
        }
            
        [FunctionName("GetProducts")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "products")] HttpRequest req, ILogger log) {

            // handle a Get request by asynchronously returning a list of the Products in the database
            // app.MapGet("api", async (ProductDb db) => {
                
            // });

            // var db = app.Options;

            // seed the database if it is empty
            if (db.Products.Count() == 0) {
                db.Products.Add(new Product { Name = "Apple", Price = 2.99, InventoryCount = 500 });
                db.Products.Add(new Product { Name = "Banana", Price = 1.99, InventoryCount = 364 });
                await db.SaveChangesAsync();
            }
            var products = await db.Products.ToListAsync();
            return new OkObjectResult(products);
        }
    }
}
