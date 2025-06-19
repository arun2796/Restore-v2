using System;

namespace API.RequestHelper;

public class PaginationMetaData
{
    public int TotalPages { get; set; }

    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }

}
