using SPOTS_Repository;
using System;
using System.Globalization;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace SPOTSAdminModule
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            System.Web.Optimization.BundleTable.EnableOptimizations = false;
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            // Log4Net Configuration
            log4net.Config.XmlConfigurator.Configure();
        }

        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            CultureInfo newCulture = (CultureInfo)System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            newCulture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
            newCulture.DateTimeFormat.DateSeparator = "/";
            Thread.CurrentThread.CurrentCulture = newCulture;
        }

        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            var authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                if (authTicket != null && !authTicket.Expired)
                {
                    UnitOfWork _unitOfWork = new UnitOfWork(new SPOTS_OAEntities());
                    var usersess = _unitOfWork.UserRepository.SingleOrDefault(u => u.ad_account == HttpContext.Current.User.Identity.Name);
                    if (usersess != null && HttpContext.Current.Request.Cookies["ASP.NET_SessionId"] != null)
                    {
                        if (usersess.sessionid != HttpContext.Current.Request.Cookies["ASP.NET_SessionId"].Value)
                        {

                            HttpContext.Current.Response.Cookies["ASP.NET_SessionId"].Value = string.Empty;
                            HttpContext.Current.Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddMonths(-20);

                            FormsAuthentication.SignOut();
                            HttpContext.Current.Response.Redirect("/");

                            return;
                        }
                    }
                    var roles = authTicket.UserData.Split(',');
                    HttpContext.Current.User = new System.Security.Principal.GenericPrincipal(new FormsIdentity(authTicket), roles);
                }
            }
        }
    }
}
