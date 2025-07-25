using System;

namespace API.RequestHelper;

public class CloudinarySettings
{
    public required string CloudName { get; set; }

    public required string ApiKey { get; set; }

    public required string ApiSecret { get; set; }
}
