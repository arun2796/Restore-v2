using API.Data;
using API.DTO;
using API.Extension;
using API.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController(AppDbContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetriveBasket();
            if (basket == null) return NoContent();
            return basket.ToDto();
        }
        [HttpPost]

        public async Task<ActionResult<BasketDto>> AddItemBasket(int productId, int quantity)
        {
            var basket = await RetriveBasket();

            basket ??= CreateBasket();

            var product = await context.Products.FindAsync(productId);

            if (product == null) return BadRequest("problem in adding item in basket");

            basket.AddItem(product, quantity);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction(nameof(GetBasket), basket.ToDto());

            return BadRequest("problem updating in basket");
        }
        [HttpDelete]

        public async Task<ActionResult<BasketDto>> RemoveItemBasket(int productId, int quantity)
        {
            var basket = await RetriveBasket();
            if (basket == null) return BadRequest("unabe to retrive the basket");

            basket.RemoveItem(productId, quantity);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest("problem in updating the basket");
        }

        private async Task<Basket?> RetriveBasket()
        {
            return await context.Baskets.Include(x => x.Items)
            .ThenInclude(x => x.Products)
            .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
        }
        private Basket CreateBasket()
        {
            var basketId = Guid.NewGuid().ToString();

            var cookieOption = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.UtcNow.AddDays(7)

            };
            Response.Cookies.Append("basketId", basketId, cookieOption);
            var basket = new Basket { BasketId = basketId, Items = [] };
            context.Baskets.Add(basket);
            return basket;
        }

    }
}
