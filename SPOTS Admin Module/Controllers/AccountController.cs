using SPOTS_AuditLogging;
using SPOTS_Repository;
using SPOTS_Repository.Services;
using SPOTSAdminModule.Utility;
using SPOTSAdminModule.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SPOTSAdminModule.Controllers
{
    [CustomAuthorize]
    public class AccountController : Controller
    {
        private bool _expiring;
        private string _expiringString;

        private readonly string adEnvironment;
        private readonly string adServer;
        private readonly string adDomainConnection;
        private readonly string adDomain;
        private readonly IUnitOfWork _unitofWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "AccountController";


        //when user first sign in, account controller will attempt to authenticate user via AD,
        //then check whether user exist in the database
        //  if user in database , authorise user to use the app
        //  if user is not in database, do not authorize user to use the app






        public AccountController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitofWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;

            adEnvironment = ConfigurationManager.AppSettings[SpotsConstant.ADEnvironment];
            adServer = ConfigurationManager.ConnectionStrings[SpotsConstant.ADServer].ConnectionString;
            adDomainConnection = ConfigurationManager.ConnectionStrings[SpotsConstant.ADDomain].ConnectionString;
            adDomain = ConfigurationManager.ConnectionStrings[SpotsConstant.ADDomain].ConnectionString;
        }

        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginModel model, string returnUrl)
        {
            /*
			Things to follow up on when deploying in the Production Environment
			check with Network/ System Administrator
			what is the LDAP connection string? does it exist in remote domain or server? what port to use?
			are we using LDAP SSL (port 636) or standard SSL ? *389
			*/

            AuthenticablePrincipal user = null;
            var message = string.Empty;
            PrincipalContext principalContext = null;
            bool isUserExistInDB = false;

            try
            {
                if (!ModelState.IsValid)
                {
                    return this.View();
                }

                //check if the username exists in the user table before allowed to authenticate
                isUserExistInDB = _unitofWork.UserRepository.doesSPOTSUserExist(model.UserName);

                if (isUserExistInDB == false)
                {
                    message = "The user does not exist in SPOTS Admin Module.";
                    ModelState.AddModelError("userDoesNotExist", message);
                    _auditService.LogAudit(SourceAudit, model?.UserName + ":" + message);
                }
                else
                {
                    string adUserDomain = ConfigurationManager.AppSettings[SpotsConstant.ADUserDomain];
                    var userName = adUserDomain + model.UserName;

                    if (adEnvironment==SpotsConstant.LOCAL)
                    {                       
                        principalContext = new PrincipalContext(ContextType.ApplicationDirectory, adServer, adDomainConnection);

                        if (model != null && principalContext != null && principalContext.ValidateCredentials("CN=" + model.UserName + "," + adDomain, 
                            model.Password, ContextOptions.SimpleBind))


                        {
                            user = UserPrincipal.FindByIdentity(principalContext, model.UserName);
                        }
                        

                    } else
                    {
                        principalContext = new PrincipalContext(ContextType.Domain, adServer, adDomainConnection, userName, model.Password);

                        if (model != null && principalContext != null && principalContext.ValidateCredentials(model.UserName, model.Password))
                        {
                            user = UserPrincipal.FindByIdentity(principalContext, model.UserName);
                        }
                    }
                    //Bypass AD
                    user = UserPrincipal.FindByIdentity(principalContext, model.UserName);



                    //hax
                    user = UserPrincipal.FindByIdentity(principalContext, model.UserName);
                    //hax

                    _auditService.LogAudit(SourceAudit, model?.UserName + ": Authenticating AD Server [" + adServer + "] AD Domain Connection [" + adDomainConnection + "] " + userName);




                    //Inexistent Username
                    if (user == null)
                    {
                        message = "The user name or password provided is incorrect.";
                        ModelState.AddModelError("loginFailed", message);
                        _auditService.LogAudit(SourceAudit, model?.UserName + ": Null user object. Unable to FindByIdentity.");
                    }

                    //Account Locked
                    else if (adEnvironment != SpotsConstant.LOCAL && user.IsAccountLockedOut())
                    {
                        message = "User Account is locked";
                        ModelState.AddModelError("locked", message);
                        _auditService.LogAudit(SourceAudit, model?.UserName + ":" + message);
                    }
                    else
                    {
                        // Check authorized user password expiry
                        if (adEnvironment != SpotsConstant.LOCAL && IsExpired(user, model))
                        {
                            message = "Password has expired";
                            ModelState.AddModelError("expired", message);
                            _auditService.LogAudit(SourceAudit, model?.UserName + ":" + message);
                        }
                        else
                        {
                            StampDB(model.UserName).Wait();
                            // Authenticate user and grant cookies or token according to his user group.

                            FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
                            // Stamp user logon date time


                            // getUserRoles based on username or ad_account
                            var _userRoles = _unitofWork.UserRepository.GetUserAccessRights(model.UserName);
                            Session["UserRoles"] = _userRoles;

                            var authTicket = new FormsAuthenticationTicket(1, model.UserName, DateTime.Now, DateTime.Now.AddMinutes(20), false, _userRoles);
                            string encryptedTicket = FormsAuthentication.Encrypt(authTicket);
                            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                            HttpContext.Response.Cookies.Add(authCookie);

                            _auditService.LogUserActionToDB(model?.UserName, SpotsConstant.AdminPortalType, SpotsConstant.AdminPortalLoginDesc, string.Empty, string.Empty);

                            // Redirect to the user's url after authentication
                            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                            {
                                _auditService.LogAudit(SourceAudit, model?.UserName + ":" + "Redirecting to " + returnUrl);
                                return Redirect(returnUrl);
                            }

                            return RedirectToAction("Index", "Home");
                        }

                    }
                }

                return this.View();
            }
            catch (Exception e)
            {
                message = "The user name or password provided is incorrect. Exception =";
                ModelState.AddModelError("loginFailed", message + e.Message);
                _auditService.LogAudit(SourceAudit, model?.UserName + ":" + message + e.Message);
                return this.View();
            }
        }

        public ActionResult GoToHome(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                return Redirect(returnUrl);

            return RedirectToAction("Index", "Home");
        }

        public ActionResult LogOff()
        {
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, SpotsConstant.AdminPortalLogoutDesc, string.Empty, string.Empty);
            Session.Abandon();
            if (HttpContext.Request.Cookies["ASP.NET_SessionId"] != null)
            {

                HttpContext.Response.Cookies["ASP.NET_SessionId"].Value = string.Empty;
                HttpContext.Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddMonths(-20);
            }
            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Account");
        }

        public async Task StampDB(string username)
        {
            var userDetails = _unitofWork.UserRepository.SingleOrDefault(u => u.ad_account ==username);

            if (userDetails != null)
            {
                userDetails.last_logon_time = DateTime.Now;
                userDetails.sessionid = HttpContext.Session.SessionID;
                _unitofWork.Complete();
            }

        }

        //Check if AD password is expiring 
        public bool IsExpired(AuthenticablePrincipal user, LoginModel model)
        {

            bool result = false;

            if (user.PasswordNeverExpires)
            {
                _auditService.LogAudit(SourceAudit, "Password expiry check skipped as user Account Password never expires");
                return result;
            }

            //_auditService.LogAudit(SourceAudit, "Ad Environment : " + adEnvironment.ToString());

            /*
			// For Fixed UAT AD User or SIT the expiry check can be skipped
			if (adEnvironment == SpotsConstant.UATFixedADUser || adEnvironment == SpotsConstant.SIT)
			{
				_auditService.LogAudit(SourceAudit, "Password expiry check skipped");
				return result;
			}
            */

            string ldap = ConfigurationManager.ConnectionStrings["ADConnectionString"].ConnectionString;

            DirectoryEntry rootEntry = new DirectoryEntry(ldap, model.UserName, model.Password, AuthenticationTypes.Secure);

            DirectorySearcher mySearcher = new DirectorySearcher(rootEntry);

            SearchResultCollection results;
            string filter = "maxPwdAge=*";
            mySearcher.Filter = filter;

            results = mySearcher.FindAll();
            long maxDays = 0;

            if (results.Count >= 1)
            {
                Int64 maxPwdAge = (Int64)results[0].Properties["maxPwdAge"][0];
                maxDays = maxPwdAge / -864000000000;
            }

            long daysLeft = 0;


            daysLeft = maxDays - DateTime.Today.Subtract(user.LastPasswordSet.Value).Days;

            _auditService.LogAudit(SourceAudit, "User Last Password Set Date : " + user.LastPasswordSet.Value.ToString() + " In Days : " + DateTime.Today.Subtract(user.LastPasswordSet.Value).Days.ToString());
            _auditService.LogAudit(SourceAudit, "Max Password Age in Days : " + maxDays.ToString() + " Days Left : " + daysLeft.ToString());

            if (daysLeft < 0)
            {
                _auditService.LogAudit(SourceAudit, "Days Left < 0 , Password has expired");

                result = true;
            }
            else
            {
                if (daysLeft <= 14)
                {
                    this._expiring = true;
                    this._expiringString = String.Format("You must change your password within" + " {0} days", daysLeft);

                    _auditService.LogAudit(SourceAudit, _expiringString);
                }
                else
                {
                    // This could be used in the future if application is required to prompt users
                    this._expiring = false;
                }
            }

            return result;

        }
    }
}