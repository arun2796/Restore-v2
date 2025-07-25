using System;
using API.Model.OrderAggregate;

namespace API.DTO;

public class OrderDto
{

    public int Id { get; set; }

    public required string BuyerEmail { get; set; }

    public required ShippingAddress ShippingAddress { get; set; }
    public required DateTime OrderDate { get; set; }

    public required List<OrderItemDto> OrderItems { get; set; } = [];
    public long SubTotal { get; set; }
    public long Discount { get; set; }
    public long DeliveryFee { get; set; }
    public long Total { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
    public required string Status { get; set; }

}
