using System;
using API.Data;
using API.DTO;
using API.Extension;
using API.Model.OrderAggregate;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentController(PaymentServices payment, AppDbContext dbContext,
 IConfiguration config, ILogger<PaymentController> logger) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatepaymentIntent()
    {
        var basket = await dbContext.Baskets.GetBasketWithItem(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("problem with the basket");

        var intent = await payment.CreateOrUpdate(basket);

        if (intent == null) return BadRequest("problem creating payment intent");

        basket.PaymentIntentId = intent.Id;
        basket.ClientSecret = intent.ClientSecret;
        // Console.WriteLine("Intent ID: " + intent.Id);
        // Console.WriteLine("Client Secret: " + intent.ClientSecret);


        if (dbContext.ChangeTracker.HasChanges())
        {
            var result = await dbContext.SaveChangesAsync() > 0;

            if (!result)
                return BadRequest("problem updating basket with intent");
        }
        return basket.ToDto();
    }
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWenHook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = ConstructureStripeEvent(json);
            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid event data");
            }
            if (intent.Status == "succeeded") await HandlePaymentintentSucceeded(intent);

            else await HandlePaymentintentFailed(intent);
            ;
            return Ok();
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "stripe webhook error");
            return StatusCode(StatusCodes.Status500InternalServerError, "webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error has occured");
            return StatusCode(StatusCodes.Status500InternalServerError, " unexpected error");
        }
    }

    private async Task HandlePaymentintentFailed(PaymentIntent intent)
    {
        var order = await dbContext.Orders
        .Include(x => x.OrderItems)
        .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
        ?? throw new Exception("order not found");

        foreach (var item in order.OrderItems)
        {
            var productItem = await dbContext.Products
            .FindAsync(item.ItemOrder.ProductId)
            ?? throw new Exception("problem updating order stock");

            productItem.QuantityInStock += item.Quantity;
        }
        order.Status = OrderStatus.paymentFailed;
        await dbContext.SaveChangesAsync();
    }

    private async Task HandlePaymentintentSucceeded(PaymentIntent intent)
    {
        var order = await dbContext.Orders
        .Include(x => x.OrderItems)
        .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
        ?? throw new Exception("order not found");

        if (order.GetTotal() != intent.Amount)
        {
            order.Status = OrderStatus.paymentMismatch;
        }
        else
        {
            order.Status = OrderStatus.paymentReceived;
        }
        var basket = await dbContext.Baskets
        .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);
        if (basket != null) dbContext.Baskets.Remove(basket);
        await dbContext.SaveChangesAsync();

    }

    private Event ConstructureStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"]
            , config["StripeSettings:WhSecret"]);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Faild to construct stripe event");
            logger.LogInformation("Raw JSON from Stripe: {Json}", json);
            logger.LogInformation("Stripe Signature: {Sig}", Request.Headers["Stripe-Signature"].ToString());
            logger.LogInformation("Using Webhook Secret: {Secret}", config["StripeSettings:WhSecret"]);
            throw new StripeException("Invalid exception");
        }
    }
}
