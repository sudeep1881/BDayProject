using System.ComponentModel.DataAnnotations;

namespace BDProject.Models;

public class LoginViewModel
{
    [Required(ErrorMessage = "Please enter the email address.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [Display(Name = "Email ID")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter the password.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Check box")]
    public bool RememberMe { get; set; }
}
