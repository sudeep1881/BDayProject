using System.Security.Claims;
using BDProject.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BDProject.Controllers;

public class AccountController : Controller
{
    private const string BirthdayEmail = "geethanaik411@gmail.com";
    private const string BirthdayPassword = "Geetha@24446666688888888";

    [AllowAnonymous]
    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
            return LocalRedirect(returnUrl ?? Url.Action("Index", "BD")!);

        ViewData["ReturnUrl"] = returnUrl;
        return View(new LoginViewModel());
    }

    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;

        if (!model.RememberMe)
        {
            ModelState.AddModelError(nameof(model.RememberMe), "Please check the box before opening your surprise.");
        }

        if (!ModelState.IsValid) return View(model);

        if (!string.Equals(model.Email.Trim(), BirthdayEmail, StringComparison.OrdinalIgnoreCase) || model.Password != BirthdayPassword)
        {
            ModelState.AddModelError(string.Empty, "That email or password is not correct. Please try again.");
            return View(model);
        }

        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "Birthday Guest") }, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties { IsPersistent = false });
        return LocalRedirect(returnUrl ?? Url.Action("Index", "BD")!);
    }

    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }
}
