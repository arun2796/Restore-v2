using System;
using API.Model.OrderAggregate;

namespace API.DTO;

public class CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }

}
