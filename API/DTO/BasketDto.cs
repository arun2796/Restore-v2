using System;

namespace API.DTO;

public class BasketDto
{

    public required string BasketId { get; set; }

    public required List<BasketItemDto> Items { get; set; } = [];


    public string? ClientSecret { get; set; }

    public string? PaymentIntentId { get; set; }

}

