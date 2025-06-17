using System;

namespace API.DTO;

public class BasketDto
{

    public required string BasketId { get; set; }

    public required List<BasketItemDto> Items { get; set; } = [];

}

