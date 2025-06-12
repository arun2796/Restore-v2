using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("This ia not a good request ");
    }
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }
    [HttpGet("validation-error")]
    public IActionResult Getvalidation()
    {
        ModelState.AddModelError("problem1", "This is first error");
        ModelState.AddModelError("problem2", "this is secondary error");
        return ValidationProblem();
    }
    [HttpGet("server-error")]

    public IActionResult GetServerError()
    {
        throw new Exception("This is internal  server error");
    }
}
