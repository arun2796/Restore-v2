using System;
using API.DTO;
using API.Model;

namespace API.Extension;

public static class BasketExtensionDto
{
    public static BasketDto ToDto(this Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,

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
}
