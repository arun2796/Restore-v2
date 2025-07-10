using System;
using Microsoft.AspNetCore.Http.Features;

namespace API.Model;

public class Basket
{
    public int Id { get; set; }

    public required string BasketId { get; set; }

    public required List<BasketItem> Items { get; set; } = [];

    public string? ClientSecret { get; set; }

    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0) throw new ArgumentException("Quantity shoud be greater than zero", nameof(quantity));

        var existingItem = FindItem(product.Id);

        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Products = product,
                Quantity = quantity
            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }
    public void RemoveItem(int productid, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity shoud be greater than zero", nameof(quantity));
        }
        var item = FindItem(productid);
        if (item == null) return;
        item.Quantity -= quantity;

        if (item.Quantity <= 0) Items.Remove(item);

    }

    private BasketItem? FindItem(int productid)
    {
        return Items.FirstOrDefault(x => x.ProductId == productid);
    }
}
