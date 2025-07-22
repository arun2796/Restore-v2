using System;
using API.Data;
using API.DTO;
using API.Extension;
using API.Model;
using API.Model.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrderController(AppDbContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUsername())
            .ToListAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
    {
        var order = await context.Orders
        .ProjectToDto()
        .Where(x => x.BuyerEmail == User.GetUsername() && x.Id == id)
            .FirstOrDefaultAsync();
        if (order == null) return NotFound("Order not found");
        return Ok(order);
    }
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        var basket = await context.Baskets.GetBasketWithItem(Request.Cookies["basketId"]);
        if (basket == null || basket.Items.Count == 0) return BadRequest("Basket not found or empty");

        var items = CreateOrderItems(basket.Items);
        if (items == null || items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId)) return BadRequest("No items to order or out of stock");

        var SubTotal = items.Sum(x => x.Price * x.Quantity);
        var DeliveryFee = CalculateDeliveryFee(SubTotal);

        var order = await context.Orders
        .Include(x => x.OrderItems)
        .FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);

        if (order == null)
        {
            order = new Order
            {
                BuyerEmail = User.GetUsername(),
                ShippingAddress = createOrderDto.ShippingAddress,
                OrderItems = items,
                SubTotal = SubTotal,
                DeliveryFee = DeliveryFee,
                PaymentIntentId = basket.PaymentIntentId,
                PaymentSummary = createOrderDto.PaymentSummary,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.pending,
            };
            context.Orders.Add(order);
        }
        else
        {
            order.OrderItems = items;
        }
        
        // context.Baskets.Remove(basket!);
        // Response.Cookies.Delete("basketId");

        var result = await context.SaveChangesAsync() > 0;
        if (!result) return BadRequest("problem creating order");

        return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id }, order.OrderToDo());

    }

    private static long CalculateDeliveryFee(long subTotal)
    {
        return subTotal > 1000 ? 0 : 500;
    }

    private static List<OrderItems>? CreateOrderItems(List<BasketItem> items)
    {
        var orderItems = new List<OrderItems>();
        foreach (var item in items)
        {
            if (item.Products.QuantityInStock < item.Quantity)
            {
                //throw new Exception($"Product {item.Products.Name} is out of stock");
                return null;
            }
            var OrderItem = new OrderItems
            {
                ItemOrder = new ProductItemOrder
                {
                    ProductId = item.Products.Id,
                    PictureUrl = item.Products.PictureUrl,
                    Name = item.Products.Name,
                },
                Price = item.Products.Price,
                Quantity = item.Quantity

            };
            orderItems.Add(OrderItem);
            item.Products.QuantityInStock -= item.Quantity;
            // context.BasketItems.Remove(item);
        }

        return orderItems;
    }
}
