using System;
using Microsoft.AspNetCore.Identity;

namespace API.Model;

public class User:IdentityUser 
{
public int? AddressId { get; set; }
public Address? Address { get; set; }
}
