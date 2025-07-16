using System;

namespace API.Model.OrderAggregate;

public class OrderItems
{
    public int Id { get; set; }
    public required ProductItemOrder ItemOrder { get; set; }

    public long Price { get; set; }
    public int Quantity { get; set; }
}
