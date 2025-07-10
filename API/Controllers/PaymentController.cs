using System;
using API.Data;
using API.DTO;
using API.Extension;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PaymentController(PaymentServices payment, AppDbContext dbContext) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatepaymentIntent()
    {
        var basket = await dbContext.Baskets.GetBasketWithItem(Request.Cookies["basketId"]);

        if (basket == null) return BadRequest("problem with the basket");

        var intent = await payment.CreateOrUpdate(basket);

        if (intent == null) return BadRequest("problem creating payment intent");

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        if (dbContext.ChangeTracker.HasChanges())
        {
            var result = await dbContext.SaveChangesAsync() > 0;

            if (!result)
                return BadRequest("problem updating basket with intent");
        }
        return basket.ToDto();
    }
}
