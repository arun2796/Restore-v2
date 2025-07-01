using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTO;

public class RegisterDto
{
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; } = string.Empty;

    public required string Password { get; set; }

}
