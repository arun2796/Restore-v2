using System;

namespace API.Model;

public class BasketItem
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    //navigation property

    public int ProductId { get; set; }

    public required Product Products { get; set; }

    public int BasketId { get; set; }

    public Basket Baskets { get; set; } = null!;

}
