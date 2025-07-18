using System;
using API.Model;
using Stripe;

namespace API.Services;

public class PaymentServices(IConfiguration configuration)
{

    public async Task<PaymentIntent> CreateOrUpdate(Basket basket)
    {
        StripeConfiguration.ApiKey = configuration["StripeSetting:Secretkey"];

        var Services = new PaymentIntentService();
        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(x => x.Quantity * x.Products.Price);
        var deliveryfee = subtotal > 10000 ? 0 : 5000;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var option = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryfee,
                Currency = "usd",
                PaymentMethodTypes = ["card"],

            };
            intent = await Services.CreateAsync(option);
        }
        else
        {
            var option = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryfee
            };
            await Services.UpdateAsync(basket.PaymentIntentId, option);
        }
        return intent;
    }
}




//"DefaultConnection": "Server=ARUNKUMAR\\SQLEXPRESS;Database=NewRestore;Trusted_Connection=True;TrustServerCertificate=True"

// "StripeSetting":{
//   "PublishableKey":"pk_test_51RgfWiPIHDheeCVrqUNW7sDIRJI1gGTkamArnIZgLnkRR2ab2mCokyhzewqACZdpgT6AObLig34u2lfvsZuUFpCk00gsrsk7wz",
//   "Secretkey":"sk_test_51RgfWiPIHDheeCVrIbSBggQo6m5SEOHtHrzXiEzqcqhRZHb7zpILoEIX2JoopYGpZELmIDhZiqVa7S4orbZoWffU00zJxZHHMU",
//   "WhSecret":"whsec_60b1332ffb1b7f525bc6b059183c668a1ed8ceed08ab49d2194063e2b9bbdc42"
// }