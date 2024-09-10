using System.Web.Mvc;
using SPOTSAdminModule.ViewModels;

namespace SPOTSAdminModule.Controllers
{
    public class ErrorController : Controller
    {

        public ActionResult AccessDenied()
        {            
            return View();
        }

    }
}