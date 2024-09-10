
using SPOTS_Repository;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System;
using SPOTSMobileApi.Models;
using System.Data.Entity.Migrations;
using log4net;

namespace SPOTSMobileApi.Controllers
{
    public class SyncController : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities();

        private const string SourceAudit = "SyncController";
        private static readonly ILog AuditLogger = LogManager.GetLogger("AuditLogger");

        [HttpGet]
        [Route("api/sync/checkConnection")]
        public HttpResponseMessage CheckConnection()
        {
            return Request.CreateResponse(HttpStatusCode.OK);  
        }

        [HttpGet]
        [Route("api/sync/getSystemCode")]
        public HttpResponseMessage GetSystemCode(DateTime? inputDate = null)
        {
            IQueryable<system_code> query = db.system_code;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified_time >= inputDate.Value);
            }

            List<system_code> systemCode = query.ToList();

            if (systemCode.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, systemCode);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSCountryCode")]
        public HttpResponseMessage GetTIMSCountryCode(DateTime? inputDate = null)
        {
            IQueryable<tims_country_code> query = db.tims_country_code;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_country_code> timsCountryCode = query.ToList();

            if (timsCountryCode.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsCountryCode);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSLocationCode")]
        public HttpResponseMessage GetTIMSLocationCode(DateTime? inputDate = null)
        {
            IQueryable<tims_location_code> query = db.tims_location_code;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_location_code> timsLocationCode = query.ToList();

            if (timsLocationCode.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsLocationCode);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSNationalityCode")]
        public HttpResponseMessage GetTIMSNationalityCode(DateTime? inputDate = null)
        {
            IQueryable<tims_nationality_code> query = db.tims_nationality_code;
            
            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_nationality_code> timsNationalityCode = query.ToList();

            if (timsNationalityCode.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsNationalityCode);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSOffenceCode")]
        public HttpResponseMessage GetTIMSOffenceCode(DateTime? inputDate = null)
        {
            IQueryable<tims_offence_code> query = db.tims_offence_code;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_offence_code> timsOffenceCode = query.ToList();

            if (timsOffenceCode.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsOffenceCode);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSVehicleColor")]
        public HttpResponseMessage GetTIMSVehicleColor(DateTime? inputDate = null)
        {
            IQueryable<tims_vehicle_color> query = db.tims_vehicle_color;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_vehicle_color> timsVehicleColor = query.ToList();

            if (timsVehicleColor.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsVehicleColor);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSVehicleMake")]
        public HttpResponseMessage GetTIMSVehicleMake(DateTime? inputDate = null)
        {
            IQueryable<tims_vehicle_make> query = db.tims_vehicle_make;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_vehicle_make> timsVehicleMake = query.ToList();

            if (timsVehicleMake.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsVehicleMake);
            }
        }

        [HttpGet]
        [Route("api/sync/getTIMSVehicleType")]
        public HttpResponseMessage GetTIMSVehicleType(DateTime? inputDate = null)
        {
            IQueryable<tims_vehicle_type> query = db.tims_vehicle_type;

            if (inputDate.HasValue)
            {
                query = query.Where(code => code.modified >= inputDate.Value);
            }

            List<tims_vehicle_type> timsVehicleType = query.ToList();

            if (timsVehicleType.Count == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, timsVehicleType);
            }
        }

        [HttpPost]
        [Route("api/sync/sendTransactionLogs")]
        public HttpResponseMessage SendTransactionLogs(List<TransactionLogs> transactionLogs)
        {
            if (transactionLogs == null || transactionLogs.Count == 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.OK, "No transaction logs provided.");
            }

            foreach (var logEntry in transactionLogs)
            {
                transaction_log logs = new transaction_log();

                // Get the max ID from the existing transaction logs
                int maxId = db.transaction_log.Max(a => (int?)a.id) ?? 0;

                logs.id = maxId + 1;
                logs.log_date = logEntry.LOG_DATE;
                logs.officer_id = logEntry.OFFICER_ID;
                logs.device_id = logEntry.DEVICE_ID;
                logs.type = logEntry.TYPE;
                logs.description = logEntry.DESCRIPTION;

                db.transaction_log.AddOrUpdate(logs);
                db.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}