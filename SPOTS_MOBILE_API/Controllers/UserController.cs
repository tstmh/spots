  
using SPOTS_Repository;
using System.Linq;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.Collections.Generic;
using System;
using System.Reflection;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Unity.Policy;
using log4net;

namespace SPOTSMobileApi.Controllers
{
    public class UserController : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities();

        private const string SourceAudit = "UserController";
        private static readonly ILog AuditLogger = log4net.LogManager.GetLogger("AuditLogger");

        [HttpPost]
        [Route("api/user/getIOListSP")]
        public HttpResponseMessage GetIOListSP()
        {
            try
            {
                var ioList = db.spApiGetIOList().ToList<spApiGetIOList_Result>();

                if (ioList.Count == 0)
                {
                    AuditLogger.Debug("GetIOListSP - No content found.");
                    return Request.CreateResponse(HttpStatusCode.NoContent);
                }
                else
                {
                    AuditLogger.Debug($"GetIOListSP - Returning {ioList.Count} items.");
                    return Request.CreateResponse(HttpStatusCode.OK, ioList);
                }
            }
            catch (Exception ex)
            {
                AuditLogger.Error("Error in GetIOListSP method.", ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("api/user/getIOList")]
        public HttpResponseMessage GetIOList()
        {
            try
            {
                var result = (
                    from u in db.user
                    join ug in db.user_group on u.user_id equals ug.user_id
                    where (ug.group_id == 3 || ug.group_id == 4)
                        && (u.delete_flag == false || !u.delete_flag.HasValue)
                    group new { u, ug } by new { u.user_id, u.display_name, u.email } into grouped
                    select new
                    {
                        io_id = grouped.Key.user_id,
                        io_name = grouped.Key.display_name,
                        io_name_email = grouped.Key.display_name + " (" + grouped.Key.email + ")",
                        modified = grouped.Max(g => g.ug.modified_time)
                    }
                ).Distinct().ToList();

                AuditLogger.Debug($"GetIOList - Returning {result.Count} items.");
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                AuditLogger.Error("Error in GetIOList method.", ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("api/user/getPOList")]
        public HttpResponseMessage GetPOList()
        {
            var poList = db.spApiGetPOList().ToList<spApiGetPOList_Result>();

            if (poList.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, poList);
            }
        }

        [HttpPost]
        [Route("api/user/getOfficerDetails")]
        public HttpResponseMessage GetOfficerDetails(string officerNric)
        {       

            // Retrieve the first officer matching the given NRIC
            var officer = db.user.FirstOrDefault(user => user.ad_account == officerNric);

            // Check if officer is found
            if (officer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Officer not found.");
            }

            return Request.CreateResponse(HttpStatusCode.OK, officer);
        }

    }
}