using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SPOTSAdminModule.ViewModels
{
    public class LoginModel
    {
        [Required(ErrorMessage = "The username field is required")]
        //(?i) - ignore case
        //^ - begin of string
        //[a-z] - any latin letter
        //$ end ? before
        //[RegularExpression(@"(?i)^[a-z]{6,10}$?", ErrorMessage = "Username must contain only  6 - 10 alphabetic characters")]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "The password field is required")]
        //[RegularExpression(@"{6, 10}$?", ErrorMessage ="Password must be between 6 - 10 characters")]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }        
        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }     
    }
}