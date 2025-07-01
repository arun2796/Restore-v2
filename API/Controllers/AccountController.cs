using System;
using API.DTO;
using API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<User> signInManager, UserManager<User> userManager) : BaseApiController
{
    [HttpPost("register")]

    public async Task<ActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.Email,
            Email = registerDto.Email
        };
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }
        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        return Ok(new { Message = "User registered successfully" });
    }
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> LoginUser([FromBody] LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return Unauthorized(new { Message = "Invalid email" });
        }

        var result = await signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, false, false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { Message = "Invalid  password" });
        }
        return Ok(new { Message = "User logged in successfully" });
    }
    [HttpGet("user-info")]

    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Unauthorized(new { Message = "User is not authenticated" });
        }

        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null)

            return Unauthorized();
        var roles = await signInManager.UserManager.GetRolesAsync(user);
        return Ok(new
        {
            user.Email,
            user.UserName,
            Roles = roles
        });
    }
    [HttpPost("logout")]
    public async Task<ActionResult> LogoutUser()
    {
        await signInManager.SignOutAsync();
        return Ok(new { Message = "User logged out successfully" });
    }

    [HttpPost("address")]
    public async Task<ActionResult<Address>> AddAddress([FromBody] Address address)
    {
        var user = await signInManager.UserManager.Users
        .Include(u => u.Address)
        .FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);
        if (user == null)
            return Unauthorized(new { Message = "User not found" });
        user.Address = address;
        var result = await signInManager.UserManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Failed to update address" });

        }
        return Ok(new { Message = "Address updated successfully", user.Address });
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetAddress()
    {
        var user = await signInManager.UserManager.Users
            .Where(u => u.UserName == User.Identity!.Name)
            .Select(u => u.Address)
            .FirstOrDefaultAsync();
        if (user == null)
            return Unauthorized(new { Message = "User not found" });
        return Ok(user);
    }
}
