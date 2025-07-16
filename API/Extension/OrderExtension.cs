using System;
using API.DTO;
using API.Model.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extension;

public static class OrderExtension
{
    public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> order)
    {
        return order.Select(order => new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            ShippingAddress = order.ShippingAddress,
            OrderDate = order.OrderDate,
            PaymentSummary = order.PaymentSummary,
            SubTotal = order.SubTotal,
            DeliveryFee = order.DeliveryFee,
            Status = order.Status.ToString(),
            Total = order.GetTotal(),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrder.ProductId,
                PictureUrl = item.ItemOrder.PictureUrl,
                Name = item.ItemOrder.Name,
                Price = item.Price,
                Quantity = item.Quantity,
            }).ToList()

        }).AsNoTracking();
    }
    public static OrderDto OrderToDo(this Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            ShippingAddress = order.ShippingAddress,
            OrderDate = order.OrderDate,
            PaymentSummary = order.PaymentSummary,
            SubTotal = order.SubTotal,
            DeliveryFee = order.DeliveryFee,
            Status = order.Status.ToString(),
            Total = order.GetTotal(),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrder.ProductId,
                PictureUrl = item.ItemOrder.PictureUrl,
                Name = item.ItemOrder.Name,
                Price = item.Price,
                Quantity = item.Quantity,
            }).ToList()

        };
    }
}
