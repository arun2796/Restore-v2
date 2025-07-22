
using System.Reflection.Metadata.Ecma335;
using API.DTO;
using API.Model;
using Microsoft.EntityFrameworkCore;

namespace API.Extension;

public static class BasketExtensionDto
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Products.Name,
                Price = x.Products.Price,
                Brand = x.Products.Brand,
                Type = x.Products.Type,
                PictureUrl = x.Products.PictureUrl,
                Quantity = x.Quantity,
            }).ToList(),
        };

    }

    public static async Task<Basket> GetBasketWithItem(this IQueryable<Basket> query, string? basketId)
    {
        return await query
        .Include(x => x.Items)
        .ThenInclude(x => x.Products)
        .FirstOrDefaultAsync(x => x.BasketId == basketId) ?? throw new Exception("cannot get basket");
    }
}
