using System.Web.Mvc;
using System.Web;
using System.Web.Routing;
using System;
using SPOTS_Repository;
public class CustomAuthorize : AuthorizeAttribute
{
    // Custom property
    public string AllowAccess { get; set; }

    protected override bool AuthorizeCore(HttpContextBase httpContext)
    {
        var _user = httpContext.User.Identity.Name;
        UnitOfWork _unitOfWork = new UnitOfWork(new SPOTS_OAEntities());

        var userAccess = _unitOfWork.UserRepository.GetUserAccessRights(_user).Split(',');
        
        if (AllowAccess == null || AllowAccess.Equals(String.Empty)) return true;

        var _listAllowAccess = AllowAccess.Split(',');

        foreach (var _access in _listAllowAccess)
        {
            if (Array.IndexOf(userAccess, _access)>=0)
            {
                return true;
            }
        }

        return false;
    }

    protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
    {
        filterContext.Controller.ViewData["AuthorizationError"] = "You don't have rights to take actions";
        if(filterContext.HttpContext.Request.IsAuthenticated){
            filterContext.Result = new RedirectToRouteResult(new
                RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
        }else
        {
            var redirectURL = filterContext.HttpContext.Request.Url.PathAndQuery;
            filterContext.Result = new RedirectToRouteResult(
                new RouteValueDictionary {                    
                    { "Controller", "Account" },
                    { "Action", "Login" },
                    { "returnUrl", redirectURL }
                }
            );
        }
    }

    public override void OnAuthorization(AuthorizationContext filterContext)
    {
        if (this.AuthorizeCore(filterContext.HttpContext))
        {
            base.OnAuthorization(filterContext);
        }
        else
        {
            this.HandleUnauthorizedRequest(filterContext);
        }
    }
}