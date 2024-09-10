
using SPOTS_Repository;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.Linq;
using SPOTSMobileApi.Models;
using SPOTSMobileApi.Utility;
using System.Threading.Tasks;
using System;
using System.Data.Entity.Migrations;
using log4net;
using System.Globalization;

namespace SPOTSMobileApi.Controllers
{
    public class SummonController : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities();

        private const string SourceAudit = "SummonController";
        private static readonly ILog AuditLogger = LogManager.GetLogger("AuditLogger");

        [HttpPost]
        [Route("api/summons/submitSummon")]
        public Task<HttpResponseMessage> SubmitSummon(MOBSummons summon)
        {
            AuditLogger.Info($"[{SourceAudit}] [SubmitSummon] Start processing summon submission. Received summon: {summon?.ToString()}");

            summons newSummon = ModelConverter.ToSummons(summon);
            AuditLogger.Debug($"[{SourceAudit}] [SubmitSummon] Converted MOBSummons to summons. spots_id: {newSummon.spots_id}");

            summons existingSummon = db.summons.FirstOrDefault(s => s.spots_id == newSummon.spots_id);

            if (existingSummon == null)
            {
                int maxId = db.summons.Max(a => (int?)a.summons_id) ?? 0; //Get the maximum summons_id
                int nextId = maxId + 1; //Increment the max summons_id by 1

                newSummon.summons_id = nextId;
                AuditLogger.Info($"[{SourceAudit}] [SubmitSummon] New summon created with summons_id: {nextId}");
            }
            else
            {
                //Summons exist, update
                newSummon.summons_id = existingSummon.summons_id;
                AuditLogger.Info($"[{SourceAudit}] [SubmitSummon] Existing summon updated with summons_id: {existingSummon.summons_id}");
            }

            AuditLogger.Debug($"[{SourceAudit}] [SubmitSummon] Adding or updating summon in database with summons_id: {newSummon.summons_id}");

            db.summons.AddOrUpdate(newSummon);
            db.SaveChanges();

            AuditLogger.Info($"[{SourceAudit}] [SubmitSummon] Summon saved successfully with summons_id: {newSummon.summons_id}");
            return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK, newSummon.summons_id));
        }

        [HttpPost]
        [Route("api/summons/submitOffender")]
        public Task<HttpResponseMessage> SubmitOffender(MOBOffender offenders)
        {
            AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Start processing offender submission. Received offender: {offenders?.ToString()}");

            try
            {
                int? addressId = null;
                int? personId = null;
                int? vehicleId = null;

                AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Summons ID: {offenders.SUMMONS_ID}, Spots ID: {offenders.SPOTS_ID}");

                int createdBy = db.summons
                        .Where(s => s.summons_id == offenders.SUMMONS_ID && s.spots_id == offenders.SPOTS_ID)
                        .Select(s => s.created_by)
                        .FirstOrDefault();

                DateTime createdTime = db.summons
                        .Where(s => s.summons_id == offenders.SUMMONS_ID && s.spots_id == offenders.SPOTS_ID)
                        .Select(s => s.created_time)
                        .FirstOrDefault();

                // Insert address
                if (offenders.ADDRESS_TYPE > 0)
                {
                    AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Checking if address exists for ADDRESS_TYPE: {offenders.ADDRESS_TYPE}");

                    //check if address exists
                    int resultCount = db.address
                            .Count(p => p.address_type == offenders.ADDRESS_TYPE &&
                                        p.block == offenders.BLOCK &&
                                        p.street == offenders.STREET &&
                                        p.floor == offenders.FLOOR &&
                                        p.unit_number == offenders.UNIT_NO &&
                                        p.building_name == offenders.BUILDING_NAME &&
                                        p.postal_code == offenders.POSTAL_CODE &&
                                        p.address_remarks == offenders.REMARKS_ADDRESS &&
                                        p.created_by == createdBy);

                    if (resultCount == 0)
                    {
                        int maxAddressId = db.address.Max(a => (int?)a.address_id) ?? 0; // Get the maximum address_id from the address table
                        int nextAddressId = maxAddressId + 1; // Increment the max address_id by 1

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Inserting new address with ID: {nextAddressId}");

                        address newAddress = ModelConverter.ToAddressSummons(offenders, nextAddressId, createdBy, createdTime);
                        addressId = nextAddressId;

                        db.address.Add(newAddress);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Address inserted successfully with ID: {nextAddressId}");
                    }
                    else
                    {
                        AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Address already exists. Skipping insertion.");
                    }
                }

                // Insert person
                if (offenders.SPOTS_ID.Length >= 5 && offenders.SPOTS_ID.Substring(0, 5) != "M401E")
                {
                    AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Checking if person exists for NAME: {offenders.NAME}");

                    personId = db.person
                     .Where(p => p.name == offenders.NAME &&
                                        p.id_type == offenders.ID_TYPE &&
                                        p.id_number == offenders.IDENTIFICATION_NO &&
                                        p.sex_code == offenders.GENDER_CODE &&
                                        p.birth_country == offenders.BIRTH_COUNTRY &&
                                        p.nationality == offenders.NATIONALITY &&
                                        p.contact_number_1 == offenders.CONTACT_1 &&
                                        p.contact_number_2 == offenders.CONTACT_2 &&
                                        p.remarks == offenders.REMARKS_IDENTIFICATION &&
                                        p.created_by == createdBy &&
                                        p.address_same_as_registered == offenders.SAME_AS_REGISTERED)
                     .Select(p => p.person_id)
                     .FirstOrDefault();

                    if (personId == 0 && !string.IsNullOrEmpty(offenders.IDENTIFICATION_NO))
                    {
                        int maxPersonId = db.person.Max(a => (int?)a.person_id) ?? 0; // Get the maximum person_id from the person table
                        int nextPersonId = maxPersonId + 1; // Increment the max person_id by 1

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Inserting new person with ID: {nextPersonId}");

                        person newPerson = ModelConverter.ToPersonSummons(offenders, nextPersonId, addressId, createdBy, createdTime);

                        personId = nextPersonId;

                        db.person.Add(newPerson);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Person inserted successfully with ID: {nextPersonId}");
                    }
                    else
                    {
                        AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Person already exists. Skipping insertion.");
                    }
                }

                //Insert Vehicle
                if ((offenders.OFFENDER_TYPE_ID == 2) || (offenders.OFFENDER_TYPE_ID == 3))
                {
                    AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Inserting new vehicle for offender type ID: {offenders.OFFENDER_TYPE_ID}");

                    //insert vehicle
                    int maxVehicleId = db.vehicle.Max(a => (int?)a.vehicle_id) ?? 0; // Get the maximum vehicle_id from the vehicle table
                    int nextVehicleId = maxVehicleId + 1; // Increment the max vehicle_id by 1
                    vehicleId = nextVehicleId;

                    vehicle newVehicle = ModelConverter.ToVehicleSummons(offenders, nextVehicleId, createdBy, createdTime);

                    db.vehicle.Add(newVehicle);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Vehicle inserted successfully with ID: {nextVehicleId}");

                    //insert offender_vehicle
                    int maxOffenderVehicleId = db.offender_vehicle.Max(a => (int?)a.offender_vehicle_id) ?? 0; // Get the maximum vehicle_involved_id from the vehicle table
                    int nextOffenderVehicleId = maxOffenderVehicleId + 1; // Increment the max vehicle_id by 1

                    int offenderId = offenders.ID;

                    string mobOffenderPkValue = ""; //TODO?

                    offender_vehicle newOffenderVehicle = ModelConverter.ToOffenderVehicle(offenders, nextOffenderVehicleId, nextVehicleId, offenderId, createdBy, createdTime);

                    db.offender_vehicle.Add(newOffenderVehicle);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Offender vehicle inserted successfully with ID: {nextOffenderVehicleId}");

                    if (offenders.SPOTS_ID.Length >= 5 && offenders.SPOTS_ID.Substring(0, 5) != "M401E")
                    {
                        //insert passenger
                        int maxId = db.passenger.Max(a => (int?)a.passenger_id) ?? 0;
                        int nextId = maxId + 1; //

                        AuditLogger.Debug($"[{SourceAudit}] [SubmitOffender] Inserting passenger with ID: {nextId}");

                        passenger newPassenger = ModelConverter.ToPassengerSummons(offenders, nextId, (int)personId, nextVehicleId, createdBy, createdTime);

                        db.passenger.Add(newPassenger);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Passenger inserted successfully with ID: {nextId}");
                    }
                }

                //Insert offender
                if (offenders.SPOTS_ID.Length >= 5 && offenders.SPOTS_ID.Substring(0, 5) != "M401E")
                {
                    // get offence datetime
                    if (offenders.OFFENCE_DATE != null && offenders.OFFENCE_TIME != null)
                    {
                        string combinedDateTimeString = $"{offenders.OFFENCE_DATE} {offenders.OFFENCE_TIME}";
                        DateTime combinedDateTime = DateTime.ParseExact(combinedDateTimeString, ModelConverter.formatMOBOffenceDateTimeString, CultureInfo.InvariantCulture);

                        //set the pk relation
                        string mobOffenderPkValue = "";

                        int maxOffenderId = db.offender.Max(a => (int?)a.offender_id) ?? 0;
                        int nextOffenderId = maxOffenderId + 1;

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Inserting new offender with ID: {nextOffenderId}");

                        offender newOffender = ModelConverter.ToOffender(offenders, nextOffenderId, personId, createdBy, createdTime, combinedDateTime);

                        db.offender.Add(newOffender);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Offender inserted successfully with ID: {nextOffenderId}");
                    }
                }
                AuditLogger.Info($"[{SourceAudit}] [SubmitOffender] Offender submission processed successfully.");
            }
            catch (Exception ex)
            {
                AuditLogger.Error($"[{SourceAudit}] [SubmitOffender] Error occurred while processing offender submission: {ex.Message}", ex);
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.InternalServerError, ex));
            }
            return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK));
        }

        [HttpPost]
        [Route("api/summons/submitOffence")]
        public Task<HttpResponseMessage> SubmitOffence(MOBOffences offences)
        {
            try
            {
                AuditLogger.Info($"[{SourceAudit}] [SubmitOffence] Start processing offence submission. Received offence details for Summons ID: {offences.SUMMONS_ID}, Spots ID: {offences.SPOTS_ID}");

                int officerId = db.summons
                    .Where(s => s.summons_id == offences.SUMMONS_ID)
                    .Select(s => s.created_by)
                    .FirstOrDefault();

                string deviceId = db.summons
                    .Where(s => s.summons_id == offences.SUMMONS_ID)
                    .Select(s => s.device_id)
                    .FirstOrDefault();

                AuditLogger.Debug($"[{SourceAudit}] [SubmitOffence] Retrieved officer ID: {officerId} and device ID: {deviceId} for Summons ID: {offences.SUMMONS_ID}");

                if (string.IsNullOrEmpty(offences.OFFENCE_DATE) || string.IsNullOrEmpty(offences.OFFENCE_TIME))
                {
                    AuditLogger.Warn($"[{SourceAudit}] [SubmitOffence] Offence date or time is missing for Summons ID: {offences.SUMMONS_ID}. Offence submission aborted.");
                    return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK));
                }

                string combinedDateTimeString = $"{offences.OFFENCE_DATE} {offences.OFFENCE_TIME}";
                DateTime combinedDateTime = DateTime.ParseExact(combinedDateTimeString, ModelConverter.formatMOBOffenceDateTimeString, CultureInfo.InvariantCulture);

                // Check if offence exists offence 
                int resultCount = (from s in db.summons
                                   join o1 in db.offender on s.summons_id equals o1.summons_id
                                   join o2 in db.offence on o1.offender_id equals o2.offender_id
                                   where s.spots_id == offences.SPOTS_ID
                                   && s.device_id == deviceId
                                   && s.created_by == officerId
                                   && o2.offence_code == offences.OFFENCE_TYPE_ID
                                   select o2.offence_id).Count();

                AuditLogger.Debug($"[{SourceAudit}] [SubmitOffence] Checked for existing offence. Result count: {resultCount} for Spots ID: {offences.SPOTS_ID}");

                if (resultCount > 0)
                {
                    //return Request.CreateResponse(HttpStatusCode.BadRequest, "Offence already exists.");
                    //TODO update offence? now only add
                    AuditLogger.Info($"[{SourceAudit}] [SubmitOffence] Offence already exists for Spots ID: {offences.SPOTS_ID}. Skipping submission.");
                    return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK, "Offence submitted successfully."));
                }

                // Find offender id for M401
                int? offenderId = null;
                if (offences.SPOTS_ID.Length >= 5 && offences.SPOTS_ID.Substring(0, 5) == "M401/")
                {
                    offenderId = db.offender
                        .Where(o => o.summons_id == offences.SUMMONS_ID)
                        .Select(o => o.offender_id)
                        .FirstOrDefault();

                    AuditLogger.Debug($"[{SourceAudit}] [SubmitOffence] Retrieved offender ID: {offenderId} for M401 Spots ID: {offences.SPOTS_ID}");
                }

                // Find summonsId
                int adminSummonsID = db.summons
                    .Where(s => s.spots_id == offences.SPOTS_ID && s.created_by == officerId)
                    .Select(s => s.summons_id)
                    .FirstOrDefault();

                // Find offenderVehicleId
                int? offenderVehicleId = db.offender_vehicle
                    .Where(ov => ov.summons_id == offences.SUMMONS_ID)
                    .Select(ov => (int?) ov.offender_vehicle_id)
                    .FirstOrDefault();

                AuditLogger.Debug($"[{SourceAudit}] [SubmitOffence] Retrieved adminSummonsID: {adminSummonsID}, offenderVehicleId: {offenderVehicleId} for Spots ID: {offences.SPOTS_ID}");

                if (offenderId != null && offences.SPOTS_ID.StartsWith("M401/") || (offenderVehicleId > 0 && offences.SPOTS_ID.StartsWith("M401E")))
                {
                    var timsOffenceDetails = db.tims_offence_code
                        .Where(oc => oc.code == offences.OFFENCE_TYPE_ID)
                        .Select(oc => new
                        {
                            offenceCode = oc.code,
                            description = oc.caption,
                            fineAmount = oc.fine_amount,
                            demeritPoint = oc.demerit_point,
                            speedingOffenceIndicator = oc.speeding_offence_indicator
                        }).FirstOrDefault();

                    if (timsOffenceDetails != null)
                    {
                        AuditLogger.Debug($"[{SourceAudit}] [SubmitOffence] Retrieved TIMS offence details for Offence Type ID: {offences.OFFENCE_TYPE_ID}");

                        string offenceCode = timsOffenceDetails.offenceCode;
                        string description = timsOffenceDetails.description;
                        decimal? fineAmount = timsOffenceDetails.fineAmount;
                        decimal? demeritPoint = timsOffenceDetails.demeritPoint;
                        string speedingOffenceIndicator = timsOffenceDetails.speedingOffenceIndicator;

                        // Insert offence
                        int maxOffenceId = db.offence.Max(a => (int?)a.offence_id) ?? 0;
                        int nextOffenceId = maxOffenceId + 1;
                        offence newOffence = ModelConverter.ToOffence(offences, nextOffenceId, offenceCode, description, fineAmount, demeritPoint, officerId, offenderId, offenderVehicleId, combinedDateTime);
                        db.offence.Add(newOffence);
                        try
                        {
                            db.SaveChanges();
                            AuditLogger.Info($"[{SourceAudit}] [SubmitOffence] Offence inserted successfully with ID: {nextOffenceId}");
                        }
                        catch (System.Data.Entity.Validation.DbEntityValidationException ex)
                        {
                            AuditLogger.Error($"[{SourceAudit}] [SubmitOffence] Validation error occurred while saving offence: {ex.Message}", ex);
                            foreach (var validationErrors in ex.EntityValidationErrors)
                            {
                                foreach (var validationError in validationErrors.ValidationErrors)
                                {
                                    AuditLogger.Error($"[{SourceAudit}] [SubmitOffence] Property: {validationError.PropertyName}, Error: {validationError.ErrorMessage}");

                                    Console.WriteLine($"Property: {validationError.PropertyName}, Error: {validationError.ErrorMessage}");
                                    return Task.FromResult(Request.CreateResponse(HttpStatusCode.InternalServerError, validationError));
                                }
                            }
                        }

                        if (speedingOffenceIndicator == "Y" && !string.IsNullOrEmpty(offences.SPEED_CLOCKED))
                        {
                            // Insert speeding offence
                            int maxSpeedingOffenceId = db.speeding_offence.Max(a => (int?)a.speeding_offence_id) ?? 0;
                            int nextSpeedingOffenceId = maxSpeedingOffenceId + 1;
                            if (offenderVehicleId != null) {
                                speeding_offence newSpeedingOffence = ModelConverter.ToSpeedingOffence(offences, nextSpeedingOffenceId, offenderVehicleId, officerId);
                                
                                db.speeding_offence.Add(newSpeedingOffence);
                                db.SaveChanges();

                                AuditLogger.Info($"[{SourceAudit}] [SubmitOffence] Speeding offence inserted successfully with ID: {nextSpeedingOffenceId}");
                            }
                        }

                        return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK, "Offence submitted successfully."));
                    }
                    else
                    {
                        //log.Info("unable to insert offence for " + offences.SPOTS_ID + ". offenderId: " + offenderId + ", offenderVehicleId: " + offenderVehicleId);
                        AuditLogger.Warn($"[{SourceAudit}] [SubmitOffence] Unable to find TIMS offence details for Offence Type ID: {offences.OFFENCE_TYPE_ID}");
                    }
                }
                else
                {
                    AuditLogger.Warn($"[{SourceAudit}] [SubmitOffence] Unable to find offender or vehicle ID for Spots ID: {offences.SPOTS_ID}");
                    //log.Info("Unable to find timsOffenceDetails from offence type id " + offences.OFFENCE_TYPE_ID);
                }
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK, "Offence submitted successfully."));
            }
            catch (Exception ex)
            {
                //log.Error("An error occurred while submitting offence", ex);
                //return Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while processing the request.");
                AuditLogger.Error($"[{SourceAudit}] [SubmitOffence] An error occurred while processing offence submission: {ex.Message}", ex);
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.InternalServerError, ex));
            }
        }

    }
}