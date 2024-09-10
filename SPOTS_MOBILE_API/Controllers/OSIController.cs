
using SPOTS_Repository;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.Linq;
using SPOTSMobileApi.Models;
using SPOTSMobileApi.Utility;
using System;
using System.Data.Entity.Migrations;
using System.Threading.Tasks;
using System.Globalization;
using WebGrease;
using log4net;
using System.Collections.Generic;
using Swashbuckle.Swagger;
using System.Diagnostics;
using System.Runtime.ConstrainedExecution;
using System.Runtime.InteropServices;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Web.UI.WebControls;
using System.IO;
using System.Configuration;

namespace SPOTSMobileApi.Controllers
{
    public class OSIController : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities();

        private const string SourceAudit = "OSIController";
        private static readonly ILog AuditLogger = log4net.LogManager.GetLogger("AuditLogger");


        [HttpPost]
        [Route("api/osi/submitAccidentReport")]
        public HttpResponseMessage SubmitAccidentReport(MOBAccidentReport accidentReport)
        {
            AuditLogger.Info($"[{SourceAudit}] [SubmitAccidentReport] Start processing accident report submission. Received report: {accidentReport?.ToString()}");

            try
            {
                accident_report report = ModelConverter.ToAccidentReport(accidentReport);
                AuditLogger.Debug($"[{SourceAudit}] [SubmitAccidentReport] Converted MOBAccidentReport to accident_report. Incident Number: {report.incident_number}");

                accident_report existingReport = db.accident_report.FirstOrDefault(r => r.incident_number == report.incident_number);

                if (existingReport == null)
                {
                    // Report doesn't exist, use sequence to get new ID
                    int maxId = db.accident_report.Max(a => (int?)a.accident_report_id) ?? 0; // Get the maximum accident_report_id from the accident_report table
                    int nextId = maxId + 1; // Increment the max accident_report_id by 1
                    report.accident_report_id = nextId;

                    AuditLogger.Info($"[{SourceAudit}] [SubmitAccidentReport] New accident report created with ID: {nextId} for Incident Number: {report.incident_number}");
                }
                else
                {
                    // Report exists, update its properties
                    report.accident_report_id = existingReport.accident_report_id;
                    AuditLogger.Info($"[{SourceAudit}] [SubmitAccidentReport] Existing accident report updated with ID: {existingReport.accident_report_id} for Incident Number: {report.incident_number}");
                }

                AuditLogger.Debug($"[{SourceAudit}] [SubmitAccidentReport] Adding or updating accident report in the database. Report ID: {report.accident_report_id}");

                db.accident_report.AddOrUpdate(report);
                db.SaveChanges();

                AuditLogger.Info($"[{SourceAudit}] [SubmitAccidentReport] Accident report saved successfully with ID: {report.accident_report_id}");

                return Request.CreateResponse(HttpStatusCode.OK, report.accident_report_id);
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                AuditLogger.Error($"[{SourceAudit}] [SubmitAccidentReport] Validation error occurred while saving accident report.", ex);
                foreach (var validationErrors in ex.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        AuditLogger.Error($"[{SourceAudit}] [SubmitAccidentReport] Property: {validationError.PropertyName}, Error: {validationError.ErrorMessage}");
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, validationError);
                    }
                }
            }
            catch (Exception ex)
            {
                AuditLogger.Error($"[{SourceAudit}] [SubmitAccidentReport] An unexpected error occurred: {ex.Message}", ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while processing the request.");
            }

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }

        [HttpPost]
        [Route("api/osi/submitImages")]
        public HttpResponseMessage SubmitImages(MOBImages images)
        {
            AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Start processing image submission for Incident Number: {images.INCIDENT_NO}, Officer ID: {images.OFFICER_ID}, Image Type: {images.IMAGE_TYPE}");

            try
            {
                int reportId = db.accident_report
                    .Where(r => r.incident_number == images.INCIDENT_NO && r.created_by == images.OFFICER_ID)
                    .Select(r => r.accident_report_id)
                    .FirstOrDefault();

                images.ACCIDENT_REPORT_ID = reportId;

                AuditLogger.Debug($"[{SourceAudit}] [SubmitImages] Retrieved accident report ID: {reportId} for Incident Number: {images.INCIDENT_NO}");

                // Get the base folder path from configuration
                string baseFolderPath = ConfigurationManager.AppSettings["AdminModulePath"];

                DateTime currentDate = DateTime.Now;
                string year = currentDate.ToString("yyyy");
                string month = currentDate.ToString("MM");
                string day = currentDate.ToString("dd");
                string formattedDate = currentDate.ToString("yyyyMMdd");

                // Insert PHOTO
                if (images.IMAGE_TYPE == "photo")
                {
                    int maxId = db.photo.Max(a => (int?)a.photo_id) ?? 0; // Get the maximum photo_id from the photo table
                    int nextId = maxId + 1; // Increment the max photo_id by 1

                    int seqNo = GetNextSequenceNumberPhoto(reportId);

                    //Decode string and save as file 
                    string fileName = $"{formattedDate}_photo_{nextId}.jpg";
                    string filePath = Path.Combine("FolderLink", year, month, day, "photo", fileName);
                    string fullFilePath = Path.Combine(baseFolderPath, filePath);

                    if (!TryDecodeAndSaveFile(images.IMAGE64, fullFilePath, $"[{SourceAudit}] [SubmitImages] Photo ID: {nextId}", out string errorMessage))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, errorMessage);
                    }

                    //convert to photo
                    photo newPhoto = ModelConverter.ToPhoto(images, nextId, seqNo, filePath);
                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Inserting new photo with ID: {nextId} for Accident Report ID: {reportId}");

                    //save to database
                    db.photo.Add(newPhoto);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Photo inserted successfully with ID: {nextId}");

                }

                // Insert SKETCH_PLAN
                if (images.IMAGE_TYPE == "sketchPlan")
                {
                    int maxId = db.sketch_plan.Max(a => (int?)a.sketch_id) ?? 0; // Get the maximum sketch_id from the sketch_plan table
                    int nextId = maxId + 1; // Increment the max sketch_id by 1

                    //Decode string and save as file 
                    string fileName = $"{formattedDate}_sketchplan_{nextId}.jpg";
                    string filePath = Path.Combine("FolderLink", year, month, day, "sketchplan", fileName);
                    string fullFilePath = Path.Combine(baseFolderPath, filePath);

                    if (!TryDecodeAndSaveFile(images.IMAGE64, fullFilePath, $"[{SourceAudit}] [SubmitImages] Sketch Plan ID: {nextId}", out string errorMessage))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, errorMessage);
                    }

                    //convert to sketch_plan
                    sketch_plan newSketchPlan = ModelConverter.ToSketchPlan(images, nextId, GetNextSequenceNumberSketchPlan(images.INCIDENT_NO), filePath);
                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Inserting new sketch plan with ID: {nextId} for Incident Number: {images.INCIDENT_NO}");

                    //save to database
                    db.sketch_plan.Add(newSketchPlan);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Sketch plan inserted successfully with ID: {nextId}");
                }

                // Insert VEHICLE_DAMAGE_REPORT
                if (images.IMAGE_TYPE == "vehReport")
                {
                    int maxId = db.vehicle_damage_report.Max(a => (int?)a.vdr_id) ?? 0; // Get the maximum vdr_id from the vehicle_damage_report table
                    int nextId = maxId + 1; // Increment the max vdr_id by 1

                    //Decode string and save as file 
                    string fileName = $"{formattedDate}_vdr_{nextId}.jpg";
                    string filePath = Path.Combine("FolderLink", year, month, day, "vdr", fileName);
                    string fullFilePath = Path.Combine(baseFolderPath, filePath);

                    if (!TryDecodeAndSaveFile(images.IMAGE64, fullFilePath, $"[{SourceAudit}] [SubmitImages] VDR ID: {nextId}", out string errorMessage))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, errorMessage);
                    }

                    //convert to vehicle_damage_report
                    vehicle_damage_report newVdr = ModelConverter.ToVehicleDamageReport(images, nextId, GetNextSequenceNumberVdr(images.INCIDENT_NO), filePath);
                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Inserting new vehicle damage report with ID: {nextId} for Incident Number: {images.INCIDENT_NO}");

                    //save to database
                    db.vehicle_damage_report.Add(newVdr);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitImages] Vehicle damage report inserted successfully with ID: {nextId}");

                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                AuditLogger.Error($"[{SourceAudit}] [SubmitImages] An error occurred while processing image submission: {ex.Message}", ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while processing the request.");
            }
        }

        private bool TryDecodeAndSaveFile(string base64String, string filePath, string logMessagePrefix, out string errorMessage)
        {
            errorMessage = string.Empty;

            try
            {
                // Convert the Base64 string to binary data
                byte[] imageBytes = Convert.FromBase64String(base64String);

                AuditLogger.Info($"{logMessagePrefix} Saving file to '{filePath}'.");

                // Ensure the directory exists
                string directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                    AuditLogger.Info($"{logMessagePrefix} Directory didn't exist, created '{directoryPath}'.");
                }

                // Save the binary data as a file
                File.WriteAllBytes(filePath, imageBytes);
                AuditLogger.Info($"{logMessagePrefix} Successfully saved file in '{filePath}'.");

                return true;
            }
            catch (FormatException ex)
            {
                // Handle the case where the Base64 string is not valid
                AuditLogger.Error($"{logMessagePrefix} Invalid Base64 string format: {ex.Message}");
                errorMessage = "Invalid image data.";
                return false;
            }
            catch (UnauthorizedAccessException ex)
            {
                // Handle lack of permission to write the file
                AuditLogger.Error($"{logMessagePrefix} Access denied when writing file: {ex.Message}");
                errorMessage = "Access denied.";
                return false;
            }
            catch (DirectoryNotFoundException ex)
            {
                // Handle invalid directory path
                AuditLogger.Error($"{logMessagePrefix} Directory not found: {ex.Message}");
                errorMessage = "Invalid directory path.";
                return false;
            }
            catch (IOException ex)
            {
                // Handle general I/O errors
                AuditLogger.Error($"{logMessagePrefix} I/O error when writing file: {ex.Message}");
                errorMessage = "Error saving the image.";
                return false;
            }
            catch (Exception ex)
            {
                // Handle any other unexpected exceptions
                AuditLogger.Error($"{logMessagePrefix} An unexpected error occurred: {ex.Message}");
                errorMessage = "An error occurred while processing your request.";
                return false;
            }
        }

        public int GetNextSequenceNumberPhoto(int accidentReportId)
        {
            // Get the max sequence number for the given accident report ID
            var maxSequenceNumber = db.photo
                .Where(p => p.accident_report_id == accidentReportId)
                .Max(p => (int?)p.sequence_number) ?? 0; // If no photos exist, default to 0

            // Increment the max sequence number by 1
            return maxSequenceNumber + 1;
        }

        public int GetNextSequenceNumberSketchPlan(string incidentNo)
        {
            // Get the max sequence number for the given incident number
            var maxSequenceNumber = db.sketch_plan
                .Where(p => p.incident_number == incidentNo)
                .Max(p => (int?)p.sequence_number) ?? 0; // If no sketch plan exist, default to 0

            // Increment the max sequence number by 1
            return maxSequenceNumber + 1;
        }
        public int GetNextSequenceNumberVdr(string incidentNo)
        {
            // Get the max sequence number for the given incident number
            var maxSequenceNumber = db.vehicle_damage_report
                .Where(p => p.incident_number == incidentNo)
                .Max(p => (int?)p.sequence_number) ?? 0; // If no vdr exist, default to 0

            // Increment the max sequence number by 1
            return maxSequenceNumber + 1;
        }

        [HttpPost]
        [Route("api/osi/submitPartiesInvolved")]
        public Task<HttpResponseMessage> SubmitPartiesInvolved(MOBPartiesInvolved partiesInvolved)
        {
            AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Start processing parties involved submission. Received parties involved: {partiesInvolved?.ToString()}");

            //personTypeID (1-Pedestrian,2- Driver,3- Passenger,4-Witness)
            try
            {
                // Retrieve created time from accident report
                DateTime createdTime = db.accident_report
                    .Where(r => r.incident_number == partiesInvolved.INCIDENT_NO && r.created_by == partiesInvolved.OFFICER_ID)
                    .Select(r => r.created_time)
                    .FirstOrDefault();

                AuditLogger.Debug($"[{SourceAudit}] [SubmitPartiesInvolved] Retrieved created time: {createdTime} for Incident Number: {partiesInvolved.INCIDENT_NO}");

                int? addressId = null;
                int? personId = null;
                int? treatmentId = null;
                int? driverId = null;
                int? vehicleId = null;

                // Insert ADDRESS
                if (partiesInvolved.ADDRESS_TYPE > 0)
                {
                    AuditLogger.Debug($"[{SourceAudit}] [SubmitPartiesInvolved] Checking if address exists for ADDRESS_TYPE: {partiesInvolved.ADDRESS_TYPE}");

                    // Check if address exists
                    int resultCount = db.address
                        .Count(p => p.address_type == partiesInvolved.ADDRESS_TYPE &&
                                    p.block == partiesInvolved.BLOCK &&
                                    p.street == partiesInvolved.STREET &&
                                    p.floor == partiesInvolved.FLOOR &&
                                    p.unit_number == partiesInvolved.UNIT_NO &&
                                    p.building_name == partiesInvolved.BUILDING_NAME &&
                                    p.postal_code == partiesInvolved.POSTAL_CODE &&
                                    p.address_remarks == partiesInvolved.REMARKS_ADDRESS &&
                                    p.created_by == partiesInvolved.OFFICER_ID);

                    AuditLogger.Debug($"[{SourceAudit}] [SubmitPartiesInvolved] address exists? {resultCount}");

                    if (resultCount == 0)
                    {
                        int maxAddressId = db.address.Max(a => (int?)a.address_id) ?? 0;
                        int nextAddressId = maxAddressId + 1;
                        address newAddress = ModelConverter.ToAddress(partiesInvolved, nextAddressId, createdTime);
                        addressId = nextAddressId;

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new address with ID: {addressId}");

                        db.address.Add(newAddress);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Address inserted successfully with ID: {addressId}");
                    }
                }

                // Insert PERSON
                if (partiesInvolved.ID_TYPE > 0 || !string.IsNullOrEmpty(partiesInvolved.NAME) || !string.IsNullOrEmpty(partiesInvolved.IDENTIFICATION_NO) ||
                    !string.IsNullOrEmpty(partiesInvolved.BIRTH_COUNTRY) || !string.IsNullOrEmpty(partiesInvolved.NATIONALITY) || !string.IsNullOrEmpty(partiesInvolved.CONTACT_1) ||
                    !string.IsNullOrEmpty(partiesInvolved.CONTACT_2) || !string.IsNullOrEmpty(partiesInvolved.REMARKS_IDENTIFICATION))
                {
                    AuditLogger.Debug($"[{SourceAudit}] [SubmitPartiesInvolved] Checking if person exists for NAME: {partiesInvolved.NAME}");

                    int resultCount = 0;
                    //try
                    //{
                        //DateTime dateOfBirth = DateTime.ParseExact(partiesInvolved.DATE_OF_BIRTH, ModelConverter.formatMOBDateString, CultureInfo.InvariantCulture);
                        resultCount = db.person
                            .Count(p => p.name == partiesInvolved.NAME &&
                                        p.id_type == partiesInvolved.ID_TYPE &&
                                        p.id_number == partiesInvolved.IDENTIFICATION_NO &&
                                        //p.date_of_birth == dateOfBirth &&
                                        p.sex_code == partiesInvolved.SEX_CODE &&
                                        p.birth_country == partiesInvolved.BIRTH_COUNTRY &&
                                        p.nationality == partiesInvolved.NATIONALITY &&
                                        p.contact_number_1 == partiesInvolved.CONTACT_1 &&
                                        p.contact_number_2 == partiesInvolved.CONTACT_2 &&
                                        p.remarks == partiesInvolved.REMARKS_IDENTIFICATION &&
                                        p.created_by == partiesInvolved.OFFICER_ID &&
                                        p.address_same_as_registered == partiesInvolved.SAME_AS_REGISTERED);

                        AuditLogger.Debug($"[{SourceAudit}] [SubmitPartiesInvolved] person exists for NAME: {partiesInvolved.NAME}? {resultCount}");
                    //}
                    //catch (FormatException ex)
                    //{
                        //AuditLogger.Warn($"[{SourceAudit}] [SubmitPartiesInvolved] Error: Invalid date format for '{partiesInvolved.DATE_OF_BIRTH}'. Exception: {ex.Message}");
                    //}

                    if (resultCount == 0)
                    {
                        int maxPersonId = db.person.Max(a => (int?)a.person_id) ?? 0;
                        int nextPersonId = maxPersonId + 1;
                        person newPerson = ModelConverter.ToPerson(partiesInvolved, nextPersonId, addressId, createdTime);
                        personId = nextPersonId;

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new person with ID: {personId}");

                        db.person.Add(newPerson);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Person inserted successfully with ID: {personId}");
                    }
                }

                // Insert INJURY_TREATMENT
                if (!string.IsNullOrEmpty(partiesInvolved.AMBULANCE_NO))
                {
                    string hospitalName = db.system_code
                        .Where(r => r.code == 6 && r.key == partiesInvolved.HOSPITAL_ID)
                        .Select(r => r.description)
                        .FirstOrDefault();

                    int maxId = db.injury_treatment.Max(a => (int?)a.treatment_id) ?? 0;
                    int nextId = maxId + 1;
                    injury_treatment newInjuryTreatment = ModelConverter.ToInjuryTreatment(partiesInvolved, nextId, createdTime, hospitalName);
                    treatmentId = nextId;

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new injury treatment with ID: {treatmentId}");

                    db.injury_treatment.Add(newInjuryTreatment);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Injury treatment inserted successfully with ID: {treatmentId}");
                }

                // Insert DRIVER
                if (partiesInvolved.PERSON_TYPE_ID == 2 && personId != null)
                {
                    int maxId = db.driver.Max(a => (int?)a.driver_id) ?? 0;
                    int nextId = maxId + 1;
                    driver newDriver = ModelConverter.ToDriver(partiesInvolved, nextId, (int)personId, treatmentId, createdTime);
                    driverId = nextId;

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new driver with ID: {driverId}");

                    db.driver.Add(newDriver);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Driver inserted successfully with ID: {driverId}");
                }

                // Insert VEHICLE / VEHICLE_INVOLVED
                if (partiesInvolved.PERSON_TYPE_ID == 2 || partiesInvolved.PERSON_TYPE_ID == 3)
                {
                    var vehicleID = (from vi in db.vehicle_involved
                                     join v in db.vehicle on vi.vehicle_id equals v.vehicle_id
                                     where vi.incident_number == partiesInvolved.INCIDENT_NO && v.registration_number == partiesInvolved.REGISTRATION_NO
                                     select vi.vehicle_id).FirstOrDefault();

                    if (vehicleID == 0)
                    {
                        int maxVehicleId = db.vehicle.Max(a => (int?)a.vehicle_id) ?? 0;
                        int nextVehicleId = maxVehicleId + 1;
                        vehicle newVehicle = ModelConverter.ToVehicle(partiesInvolved, nextVehicleId, createdTime);

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new vehicle with ID: {nextVehicleId}");

                        db.vehicle.Add(newVehicle);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Vehicle inserted successfully with ID: {nextVehicleId}");

                        int maxVehicleInvolvedId = db.vehicle_involved.Max(a => (int?)a.vehicle_involved_id) ?? 0;
                        int nextVehicleInvolvedId = maxVehicleInvolvedId + 1;
                        vehicle_involved newVehicleInvolved = ModelConverter.ToVehicleInvolved(partiesInvolved, nextVehicleInvolvedId, nextVehicleId, driverId);

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new vehicle involved with ID: {nextVehicleInvolvedId}");

                        db.vehicle_involved.Add(newVehicleInvolved);
                        db.SaveChanges();

                        AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Vehicle involved inserted successfully with ID: {nextVehicleInvolvedId}");
                    }
                }

                // Insert PASSENGER
                if (partiesInvolved.PERSON_TYPE_ID == 3 && personId != null && vehicleId != null)
                {
                    int maxId = db.passenger.Max(a => (int?)a.passenger_id) ?? 0;
                    int nextId = maxId + 1;
                    passenger newPassenger = ModelConverter.ToPassenger(partiesInvolved, nextId, (int)personId, (int)vehicleId, treatmentId, createdTime);

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new passenger with ID: {nextId}");

                    db.passenger.Add(newPassenger);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Passenger inserted successfully with ID: {nextId}");
                }

                // Insert PERSON_INVOLVED (Pedestrian and Witness)
                if ((partiesInvolved.PERSON_TYPE_ID == 1 || partiesInvolved.PERSON_TYPE_ID == 4) && personId != null)
                {
                    int maxId = db.person_involved.Max(a => (int?)a.person_involved_id) ?? 0;
                    int nextId = maxId + 1;

                    int personInvolvedType = partiesInvolved.PERSON_TYPE_ID == 1 ? 1 : 2;

                    person_involved newPersonInvolved = ModelConverter.ToPersonInvolved(partiesInvolved, nextId, (int)personId, personInvolvedType, treatmentId);

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Inserting new person involved with ID: {nextId}");

                    db.person_involved.Add(newPersonInvolved);
                    db.SaveChanges();

                    AuditLogger.Info($"[{SourceAudit}] [SubmitPartiesInvolved] Person involved inserted successfully with ID: {nextId}");
                }

                return Task.FromResult(Request.CreateResponse(HttpStatusCode.OK));
            }
            catch (Exception ex)
            {
                // Log any general exceptions
                AuditLogger.Error($"[{SourceAudit}] [SubmitPartiesInvolved] An error occurred while processing parties involved submission: {ex.Message}", ex);
                return Task.FromResult(Request.CreateResponse(HttpStatusCode.InternalServerError, "An error occurred while processing the request."));
            }
        }

    }
}