
using System;
using System.Web;
using SPOTS_Repository;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using SPOTSMobileApi.Models;
using System.Configuration;
using SPOTSMobileApi.Utility;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using log4net;
using log4net.Config;
using Newtonsoft.Json;

namespace SPOTSMobileApi.Controllers
{   
    public class AuthenticationController : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities(); 
        private const string SourceAudit = "AuthenticationController";
        private static readonly ILog AuditLogger = LogManager.GetLogger("AuditLogger");

        private const string STATUS_SUCCESS = "S";
        private const string STATUS_FAIL = "F";

        [HttpPost]
        [Route("api/authenticate")]
        public HttpResponseMessage AuthenticateUser(Authenticate user)
        {
            string sUserId = user.UserId;
            string sPassword = user.Password;

            /*
			Things to follow up on when deploying in the Production Environment
			check with Network/ System Administrator
			what is the LDAP connection string? does it exist in remote domain or server? what port to use?
			are we using LDAP SSL (port 636) or standard SSL ? *389
			*/
            string adEnvironment = ConfigurationManager.AppSettings[SpotsConstant.ADEnvironment];
            ConnectionStringSettingsCollection test = ConfigurationManager.ConnectionStrings;
            string adServer = ConfigurationManager.ConnectionStrings[SpotsConstant.ADServer].ConnectionString;
            string adDomainConnection = ConfigurationManager.ConnectionStrings[SpotsConstant.ADDomain].ConnectionString;
            string adDomain = ConfigurationManager.ConnectionStrings[SpotsConstant.ADDomain].ConnectionString;

            var message = string.Empty;

            // Check if the username exists in the user table before allowing authentication
            user dbUser = db.user.SingleOrDefault(s => s.ad_account == sUserId);

            if (dbUser == null)
            {
                message = "The user does not exist in SPOTS Admin Module.";

                AuditLogger.Info($"[{SourceAudit}][{message}]");
                return Request.CreateResponse(HttpStatusCode.NotFound, "Officer not found.");
            }

            //authenticate via ldap
            string adUserDomain = ConfigurationManager.AppSettings[SpotsConstant.ADUserDomain];
            var userName = adUserDomain + sUserId;

            PrincipalContext principalContext = null;
            AuthenticablePrincipal apUser = null;

            if (adEnvironment == SpotsConstant.LOCAL)
            {
                principalContext = new PrincipalContext(ContextType.ApplicationDirectory, adServer, adDomainConnection);
                if (principalContext != null)
                {
                    principalContext.ValidateCredentials("CN=" + sUserId + "," + adDomain, sPassword, ContextOptions.SimpleBind);

                    apUser = UserPrincipal.FindByIdentity(principalContext, sUserId);
                }
            }
            else
            {
                principalContext = new PrincipalContext(ContextType.Domain, adServer, adDomainConnection, userName, sPassword);
                if (principalContext != null)
                {
                    principalContext.ValidateCredentials(sUserId, sPassword);

                    apUser = UserPrincipal.FindByIdentity(principalContext, sUserId);
                }

            }

            message = sUserId + ": Authenticating AD Server [" + adServer + "] AD Domain Connection [" + adDomainConnection + "] " + userName;
            AuditLogger.Info($"[{SourceAudit}][{message}]");
            //Inexistent Username
            if (apUser == null)
            {
                message = sUserId + ": Null user object. Unable to FindByIdentity.";
                AuditLogger.Info($"[{SourceAudit}][{message}]");
                return Request.CreateResponse(HttpStatusCode.NotFound, "The user name or password provided is incorrect.");
            }
            //Account Locked
            else if (adEnvironment != SpotsConstant.LOCAL && apUser.IsAccountLockedOut())
            {
                message = "User Account is locked.";
                AuditLogger.Info($"[{SourceAudit}][{sUserId + ":" + message}]");
                return Request.CreateResponse(HttpStatusCode.NotFound, "User Account is locked");
            }
            else
            {
                //TODO? Check authorized user password expiry

                message = "Login success.";
                AuditLogger.Info($"[{SourceAudit}][{sUserId + ":" + message}]");
                return Request.CreateResponse(HttpStatusCode.OK, dbUser);
            }
        }

    }
}