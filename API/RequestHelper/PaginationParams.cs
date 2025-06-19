using System;

namespace API.RequestHelper;

public class PaginationParams
{
    private const int MaxPageSize = 50;

    public int PageNumber { get; set; } = 1;

    private int _PageSize = 6;
    public int PageSize
    {
        get => _PageSize;
        set => _PageSize = value > MaxPageSize ? MaxPageSize : value;
    }

}
