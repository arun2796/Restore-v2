using System;

namespace API.Model.OrderAggregate;

public class Order
{
    public int Id { get; set; }

    public required string BuyerEmail { get; set; }

    public required ShippingAddress ShippingAddress { get; set; }
    public required DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public required List<OrderItems> OrderItems { get; set; } = [];
    public long SubTotal { get; set; }
    public long Discount { get; set; }
    public long DeliveryFee { get; set; } = 0;
    public required PaymentSummary PaymentSummary { get; set; }
    public required OrderStatus Status { get; set; } = OrderStatus.pending;
    public required string PaymentIntentId { get; set; }


    public long GetTotal()
    {
        return SubTotal + DeliveryFee - Discount;
    }

}
