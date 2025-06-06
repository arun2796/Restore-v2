

namespace API.Model;

public class Product
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Descirption { get; set; }

    public long Price { get; set; }

    public required string PictureUrl { get; set; }

    public required string Type { get; set; }

    public required string Brand { get; set; }

    public int QuantityInStock { get; set; }



}
