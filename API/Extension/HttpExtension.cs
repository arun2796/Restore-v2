using System;
using System.Text.Json;
using API.RequestHelper;
using Microsoft.Net.Http.Headers;

namespace API.Extension;

public static class HttpExtension
{


    public static void AddPaginationheader(this HttpResponse response, PaginationMetaData metaData)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        response.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
    }
}
