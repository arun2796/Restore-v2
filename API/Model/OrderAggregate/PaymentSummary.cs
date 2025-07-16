using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Model.OrderAggregate;

[Owned]
public class PaymentSummary
{
    [JsonPropertyName("last4")]
    public int Last4Digits { get; set; }

    public required string Brand { get; set; }

    [JsonPropertyName("exp_month")]
    public int ExpiryMonth { get; set; }
    [JsonPropertyName("exp_year")]
    public int ExpiryYear { get; set; }
}
