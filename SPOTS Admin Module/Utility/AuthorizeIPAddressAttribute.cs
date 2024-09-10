﻿using System;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AddressAccessFiltering
{
    public class AuthorizeIPAddressAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string ipAddress = HttpContext.Current.Request.UserHostAddress;
            if (!IsIpAddressAllowed(ipAddress.Trim()))
            {

                
                context.Result = new HttpStatusCodeResult(403, ipAddress);
            }
            base.OnActionExecuting(context);
        }
        private bool IsIpAddressAllowed(string IpAddress)
        {
            if (!string.IsNullOrWhiteSpace(IpAddress))
            {
                string[] addresses = Convert.ToString(ConfigurationManager.AppSettings["AllowedIPAddresses"]).Split(',');
                return addresses.Where(a => a.Trim().Equals(IpAddress, StringComparison.InvariantCultureIgnoreCase)).Any();
            }
            return false;
        }
    }
}