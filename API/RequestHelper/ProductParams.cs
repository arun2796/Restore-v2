using System;

namespace API.RequestHelper;

public class ProductParams : PaginationParams
{
    public string? OrderBy { get; set; }
    public string? SearchName { get; set; }
    public string? Brands { get; set; }
    public string? Types { get; set; }
}
