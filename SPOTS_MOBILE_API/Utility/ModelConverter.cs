using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Xml.Linq;
using log4net;
using Microsoft.Ajax.Utilities;
using Microsoft.SqlServer.Server;
using SPOTS_Repository;
using SPOTSMobileApi.Models;

namespace SPOTSMobileApi.Utility
{
    public static class ModelConverter
    {

        public const string formatMOBDateTimeString = "yyyyMMddHHmmss";
        public const string formatMOBDateString = "yyyyMMdd";
        public const string formatMOBTimeString = "HH:mm";
        public const string formatMOBOffenceDateTimeString = "dd/MM/yyyy HH:mm";

        private static readonly ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static MOBAccidentReport ToMOBAccidentReport(accident_report report)
        {

            MOBAccidentReport accidentReport = new MOBAccidentReport();

            accidentReport.INCIDENT_NO = report.incident_number;
            if (int.TryParse(report.io_name, out int ioName))
            {
                accidentReport.IO_NAME = ioName;
            }
            else
            {
                accidentReport.IO_NAME = 0;
                log.Debug($"Invalid integer value: {report.io_name}");
            }
            accidentReport.IO_EXTENSION_NO = report.io_extension_number;

            accidentReport.OFFICER_ID = report.officer_id;

            accidentReport.LOCATION_CODE = report.tims_location_code_1;
            accidentReport.LOCATION_CODE_2 = report.tims_location_code_2;
            accidentReport.STRUCTURE_DAMAGES = report.structure_damage;
            accidentReport.DEVICE_ID = report.device_id;

            accidentReport.STATUS_ID = ConvertShortToInt(report.status_code);
            accidentReport.WEATHER_CODE = ConvertShortToInt(report.weather_code);
            accidentReport.WEATHER_OTHER_CODE = report.other_weather;
            accidentReport.TRAFFIC_VOLUME_CODE = ConvertShortToInt(report.traffic_volume_code);
            accidentReport.DECLARATION_INDICATOR = report.declaration_indicator.ToString();
            accidentReport.OFFICER_RANK = report.officer_name;
            accidentReport.DECLARATION_DATE = FormatNullableDateTime(report.officer_declaration_time, formatMOBDateTimeString);
            accidentReport.CREATED_AT = FormatNullableDateTime(report.created_time, formatMOBDateTimeString);

            if (int.TryParse(report.incident_occured, out int incidentOccured))
            {
                accidentReport.INCIDENT_OCCURED = incidentOccured;
            }
            else
            {
                accidentReport.INCIDENT_OCCURED = 0;
                log.Debug($"Invalid integer value: {report.incident_occured}");
            }
            accidentReport.ROAD_SURFACE_CODE = (int)report.road_surface;
            accidentReport.ROAD_SURFACE_OTHER = report.other_road_surface;
            accidentReport.REMARKS_LOCATION = report.location_remarks;
            accidentReport.PRESERVE_DATE = FormatNullableDateTime(report.preserve_date, formatMOBTimeString);
            accidentReport.ACCIDENT_TIME = FormatNullableDateTime(report.accident_time, formatMOBDateTimeString);

            accidentReport.PO_ARRIVAL_TIME = FormatNullableDateTime(report.po_arrival_time, formatMOBTimeString);
            accidentReport.PO_RESUME_DUTY_TIME = FormatNullableDateTime(report.po_resume_duty_time, formatMOBTimeString);

            accidentReport.DIVISION = report.officer_team;
            accidentReport.SPECIAL_ZONE = ConvertShortToInt(report.special_zone_code);
            accidentReport.SCHOOL_NAME = report.school_name;

            return accidentReport;
        }

        public static MOBSummons ToMOBSummon(summons report)
        {

            MOBSummons summon = new MOBSummons();

            summon.ID = report.summons_id;
            summon.DEVICE_ID = report.device_id;
            summon.OFFICER_ID = report.created_by;
            summon.STATUS_ID = ConvertShortToInt(report.status_code);
            
            if (report.summons_type == 1)
            {
                summon.TYPE = "M401";
            }
            else if (report.summons_type == 2)
            {
                summon.TYPE = "M401E";
            }

            summon.CREATED_AT = FormatNullableDateTime(report.created_time, formatMOBDateTimeString);
            if (int.TryParse(report.incident_occured, out int incidentOccured))
            {
                summon.INCIDENT_OCCURED = incidentOccured;
            }
            else
            {
                summon.INCIDENT_OCCURED = 0;
                log.Debug($"Invalid integer value: {report.incident_occured}");
            }
            summon.LOCATION_CODE = report.tims_location_code_1;
            summon.LOCATION_CODE_2 = report.tims_location_code_2;
            summon.SPECIAL_ZONE = report.special_zone_code;
            summon.REMARKS_LOCATION = report.location_remarks;
            summon.SCHOOL_NAME = report.school_name;

            return summon;
        }

        public static string FormatNullableDateTime(DateTime? dateTime, string format)
        {
            if (dateTime.HasValue)
            {
                return dateTime.Value.ToString(format, CultureInfo.InvariantCulture);
            }
            else
            {
                return string.Empty;
            }
        }
        public static int? ConvertShortToInt(short? nullableShort)
        {
            if (nullableShort.HasValue)
            {
                return (int?)nullableShort.Value;
            }
            else
            {
                return null;
            }
        }

        public static summons ToSummons(MOBSummons report)
        {
            summons summon = new summons();

            summon.summons_id = report.ID;
            summon.spots_id = report.SPOTS_ID;
            summon.status_code = (short) report.STATUS_ID;
            summon.device_id = report.DEVICE_ID;
            summon.created_by = report.OFFICER_ID;

            if (report.TYPE.Equals("M401"))
            {
                summon.summons_type = 1;
            }
            else
            {
                summon.summons_type = 2;
            };

            if (!string.IsNullOrEmpty(report.CREATED_AT))
            {
                try
                {
                    summon.created_time = DateTime.ParseExact(report.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToSummons Error: Invalid date format for '{report.CREATED_AT}'.");
                };
            }

            summon.incident_occured = Convert.ToString(report.INCIDENT_OCCURED);
            summon.tims_location_code_1 = report.LOCATION_CODE;
            summon.tims_location_code_2 = report.LOCATION_CODE_2;
            summon.special_zone_code = (short?)report.SPECIAL_ZONE;
            summon.location_remarks = report.REMARKS_LOCATION;
            summon.school_name = report.SCHOOL_NAME;
            return summon;
        }

        public static accident_report ToAccidentReport(MOBAccidentReport report)
        {

            accident_report accidentReport = new accident_report();

            accidentReport.incident_number = report.INCIDENT_NO;
            accidentReport.io_name = Convert.ToString(report.IO_NAME);

            accidentReport.io_extension_number = report.IO_EXTENSION_NO;

            accidentReport.officer_id = report.OFFICER_ID;
            accidentReport.created_by = report.OFFICER_ID;

            accidentReport.tims_location_code_1 = report.LOCATION_CODE;
            accidentReport.tims_location_code_2 = report.LOCATION_CODE_2;
            accidentReport.structure_damage = report.STRUCTURE_DAMAGES;
            accidentReport.device_id = report.DEVICE_ID;

            accidentReport.status_code = (short?)report.STATUS_ID;
            accidentReport.weather_code = (short?)report.WEATHER_CODE;
            accidentReport.other_weather = report.WEATHER_OTHER_CODE;
            accidentReport.traffic_volume_code = (short?)report.TRAFFIC_VOLUME_CODE;

            if (bool.TryParse(report.DECLARATION_INDICATOR, out bool declarationIndicator))
            {
                accidentReport.declaration_indicator = declarationIndicator;
            }

            accidentReport.officer_name = report.OFFICER_RANK;

            if (!string.IsNullOrEmpty(report.DECLARATION_DATE))
            {
                try
                {
                    accidentReport.officer_declaration_time = DateTime.ParseExact(report.DECLARATION_DATE, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.DECLARATION_DATE}'.");
                };
            }

            if (!string.IsNullOrEmpty(report.CREATED_AT))
            {
                try
                {
                    accidentReport.created_time = DateTime.ParseExact(report.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.CREATED_AT}'.");
                };
            }
                

            accidentReport.incident_occured = Convert.ToString(report.INCIDENT_OCCURED);
            accidentReport.road_surface = (short?)report.ROAD_SURFACE_CODE;
            accidentReport.other_road_surface = report.ROAD_SURFACE_OTHER;
            accidentReport.location_remarks = report.REMARKS_LOCATION;

            if (!string.IsNullOrEmpty(report.PRESERVE_DATE))
            {
                try
                {
                    accidentReport.preserve_date = DateTime.ParseExact(report.PRESERVE_DATE, formatMOBTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.PRESERVE_DATE}'.");
                };
            }

            if (!string.IsNullOrEmpty(report.ACCIDENT_TIME))
            {
                try
                {
                    accidentReport.accident_time = DateTime.ParseExact(report.ACCIDENT_TIME, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.ACCIDENT_TIME}'.");
                };
            }

            if (!string.IsNullOrEmpty(report.PO_ARRIVAL_TIME))
            {
                try
                {
                    accidentReport.po_arrival_time = DateTime.ParseExact(report.PO_ARRIVAL_TIME, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.PO_ARRIVAL_TIME}'.");
                };
            }

            if (!string.IsNullOrEmpty(report.PO_RESUME_DUTY_TIME))
            {
                try
                {
                    accidentReport.po_resume_duty_time = DateTime.ParseExact(report.PO_RESUME_DUTY_TIME, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{report.PO_RESUME_DUTY_TIME}'.");
                };
            }

            accidentReport.officer_team = report.DIVISION;
            accidentReport.special_zone_code = (short?)report.SPECIAL_ZONE;
            accidentReport.school_name = report.SCHOOL_NAME;

            return accidentReport;
        }

        public static photo ToPhoto(MOBImages images, int photoId, int sequenceNo, string filePath)
        {

            photo photo = new photo();

            photo.photo_id = photoId;
            photo.accident_report_id = images.ACCIDENT_REPORT_ID;
            photo.photo_caption = images.CAPTION;
            photo.sequence_number = (short?)sequenceNo;
            photo.created_by = images.OFFICER_ID;
            photo.photo_base64 = images.IMAGE64;
            photo.photo_file_path = filePath;
            
            if (!string.IsNullOrEmpty(images.CREATED_AT))
            {
                try
                {
                    photo.created_time = DateTime.ParseExact(images.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{images.CREATED_AT}'.");
                };
            }

            return photo;
        }
        public static sketch_plan ToSketchPlan(MOBImages images, int sketchId, int sequenceNo, string filePath)
        {
            sketch_plan sketchPlan = new sketch_plan();

            sketchPlan.sketch_id = sketchId;
            sketchPlan.incident_number = images.INCIDENT_NO;
            sketchPlan.sketch_caption = images.CAPTION;
            sketchPlan.sequence_number = (short)sequenceNo;
            sketchPlan.created_by = images.OFFICER_ID;
            sketchPlan.sketch_image_base64 = images.IMAGE64;
            sketchPlan.sketch_image_file_path = filePath;

            if (!string.IsNullOrEmpty(images.CREATED_AT))
            {
                try
                {
                    sketchPlan.created_time = DateTime.ParseExact(images.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{images.CREATED_AT}'.");
                };
            }

            return sketchPlan;
        }
        public static vehicle_damage_report ToVehicleDamageReport(MOBImages images, int vdrId, int sequenceNo, string filePath)
        {

            vehicle_damage_report vdr = new vehicle_damage_report();

            vdr.vdr_id = vdrId;
            vdr.incident_number = images.INCIDENT_NO;
            vdr.vehicle_type = images.TYPE_CODE;
            vdr.vehicle_make = images.MAKE_CODE;
            vdr.caption = images.CAPTION;
            vdr.sequence_number = (short)sequenceNo;
            vdr.created_by = images.OFFICER_ID;
            vdr.vdr_image_file_path = filePath;

            if (!string.IsNullOrEmpty(images.CREATED_AT)) {
                try
                {
                    vdr.created_time = DateTime.ParseExact(images.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{images.CREATED_AT}'.");
                };
            }

            vdr.vehicle_number = images.REGISTRATION_NO;
            vdr.vehicle_colour = images.COLOR;
            vdr.vehicle_colour_code = images.COLOR_CODE;
            vdr.p_plate_displayed = (short?)images.PLATE_DISPLAYED;

            if (!string.IsNullOrEmpty(images.ACCIDENT_DATE))
            {
                try
                {
                    vdr.accident_date = DateTime.ParseExact(images.ACCIDENT_DATE, formatMOBDateString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{images.CREATED_AT}'.");
                };
            }

            if (!string.IsNullOrEmpty(images.EXAMINATION_DATE))
            {
                try
                {
                    vdr.examination_date = DateTime.ParseExact(images.EXAMINATION_DATE, formatMOBDateString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    log.Debug($"ToAccidentReport Error: Invalid date format for '{images.CREATED_AT}'.");
                };
            }

            vdr.incident_occured = Convert.ToString(images.INCIDENT_OCCURED);
            vdr.location_code_1 = images.LOCATION_CODE;
            vdr.location_code_2 = images.LOCATION_CODE_2;
            vdr.vdr_image_base64 = images.IMAGE64;

            return vdr;
        }
        public static address ToAddress(MOBPartiesInvolved partiesInvolved, int addressId, DateTime createdTime)
        {
            address address = new address();

            address.address_id = addressId;
            address.address_type = (short)partiesInvolved.ADDRESS_TYPE;
            address.block = partiesInvolved.BLOCK;
            address.street = partiesInvolved.STREET;
            address.floor = partiesInvolved.FLOOR;
            address.unit_number = partiesInvolved.UNIT_NO;
            address.building_name = partiesInvolved.BUILDING_NAME;
            address.postal_code = partiesInvolved.POSTAL_CODE;
            address.address_remarks = partiesInvolved.REMARKS_ADDRESS;
            address.created_by = partiesInvolved.OFFICER_ID;
            address.created_time = createdTime;

            return address;
        }
        public static address ToAddressSummons(MOBOffender offenders, int addressId, int createdBy, DateTime createdTime)
        {
            address address = new address();

            address.address_id = addressId;
            address.address_type = (short)offenders.ADDRESS_TYPE;
            address.block = offenders.BLOCK;
            address.street = offenders.STREET;
            address.floor = offenders.FLOOR;
            address.unit_number = offenders.UNIT_NO;
            address.building_name = offenders.BUILDING_NAME;
            address.postal_code = offenders.POSTAL_CODE;
            address.address_remarks = offenders.REMARKS_ADDRESS;
            address.created_by = createdBy;
            address.created_time = createdTime;

            return address;
        }
        public static person ToPerson(MOBPartiesInvolved partiesInvolved, int personId, int? addressId, DateTime createdTime)
        {

            person person = new person();

            person.person_id = personId;
            person.name = partiesInvolved.NAME;
            person.id_type = (short?)partiesInvolved.ID_TYPE;
            person.id_number = partiesInvolved.IDENTIFICATION_NO;

            if (!string.IsNullOrEmpty(partiesInvolved.DATE_OF_BIRTH))
            {
                try
                {
                    person.date_of_birth = DateTime.ParseExact(partiesInvolved.DATE_OF_BIRTH, formatMOBDateString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{partiesInvolved.DATE_OF_BIRTH}'.");
                };
            }

            person.sex_code = (short?)partiesInvolved.SEX_CODE;
            person.birth_country = partiesInvolved.BIRTH_COUNTRY;
            person.nationality = partiesInvolved.NATIONALITY;
            person.contact_number_1 = partiesInvolved.CONTACT_1;
            person.contact_number_2 = partiesInvolved.CONTACT_2;
            person.address_id = addressId;
            person.remarks = partiesInvolved.REMARKS_IDENTIFICATION;
            person.created_by = partiesInvolved.OFFICER_ID;
            person.created_time = createdTime;
            person.address_same_as_registered = partiesInvolved.SAME_AS_REGISTERED;

            return person;
        }

        public static speeding_offence ToSpeedingOffence(MOBOffences offences, int speedingOffenceId, int? offenderVehicleId, int createdBy)
        {

            speeding_offence so = new speeding_offence();

            so.speeding_offence_id = speedingOffenceId;
            so.offender_vehicle_id = (int) offenderVehicleId;
            so.speed_clocked = short.Parse(offences.SPEED_CLOCKED);
            so.speed_limit = short.Parse(offences.SPEED_LIMIT);
            so.road_limit = short.Parse(offences.ROAD_LIMIT);
            so.speed_limiter_required_code = (short?)offences.SPEED_LIMITER_REQUIRED;
            so.speed_device_id = (short?)offences.SPEED_DEVICE_ID;
            so.speed_limiter_installed_code = (short?)offences.SPEED_LIMITER_INSTALLED;
            so.sent_to_inspection = offences.SENT_INSPECTION != 0;
            so.created_by = createdBy;
            
            if (!string.IsNullOrEmpty(offences.CREATED_AT)) {
                try
                {
                    so.created_time = DateTime.ParseExact(offences.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{offences.CREATED_AT}'.");
                };
            }
                
            return so;
        }
        public static offence ToOffence(MOBOffences offences, int offenceId, string offenceCode, string description, decimal? fineAmount, decimal? demeritPoint, int officerId, int? offenderID, int? offenderVehicleId, DateTime offenceDateTime)
        {
            offence offence = new offence();

            offence.offence_id = offenceId;
            offence.offender_id = offenderID;
            offence.offence_code = offenceCode;
            offence.description = description;
            offence.fine_amount = (double)fineAmount;
            offence.demerit_point = (short)demeritPoint;
            offence.remarks = offences.REMARKS;
            offence.created_by = officerId;

            if (!string.IsNullOrEmpty(offences.CREATED_AT))
            {
                try
                {
                    offence.created_time = DateTime.ParseExact(offences.CREATED_AT, formatMOBDateTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{offences.CREATED_AT}'.");
                };
            }
                
            offence.offender_vehicle_id = offenderVehicleId;
            offence.operation_type = Convert.ToString(offences.OPERATION_TYPE);
            offence.offence_time = offenceDateTime;
            return offence;
        }

        public static person ToPersonSummons(MOBOffender offenders, int personId, int? addressId, int createdBy, DateTime createdTime)
        {

            person person = new person();

            person.person_id = personId;
            person.name = offenders.NAME;
            person.id_type = (short?)offenders.ID_TYPE;
            person.id_number = offenders.IDENTIFICATION_NO;

            if (!string.IsNullOrEmpty(offenders.DATE_OF_BIRTH)) {
                try
                {
                    person.date_of_birth = DateTime.ParseExact(offenders.DATE_OF_BIRTH, formatMOBDateString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{offenders.DATE_OF_BIRTH}'.");
                };
            }
            
            person.sex_code = (short?)offenders.GENDER_CODE;
            person.birth_country = offenders.BIRTH_COUNTRY;
            person.nationality = offenders.NATIONALITY;
            person.contact_number_1 = offenders.CONTACT_1;
            person.contact_number_2 = offenders.CONTACT_2;
            person.address_id = addressId;
            person.remarks = offenders.REMARKS_IDENTIFICATION;
            person.created_by = createdBy;
            person.created_time = createdTime;
            person.address_same_as_registered = offenders.SAME_AS_REGISTERED;

            return person;
        }

        public static injury_treatment ToInjuryTreatment(MOBPartiesInvolved partiesInvolved, int treatmentID, DateTime createdTime, string hospitalName)
        {
            injury_treatment injuryTreatment = new injury_treatment();

            injuryTreatment.treatment_id = treatmentID;
            injuryTreatment.ambulance_number = partiesInvolved.AMBULANCE_NO;
            injuryTreatment.ao_id = partiesInvolved.AMBULANCE_AO_ID;

            if (!string.IsNullOrEmpty(partiesInvolved.AMBULANCE_ARRIVAL))
            {
                try
                {
                    injuryTreatment.ambulance_arrival = DateTime.ParseExact(partiesInvolved.AMBULANCE_ARRIVAL, formatMOBTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{partiesInvolved.AMBULANCE_ARRIVAL}'.");
                };
            }

            if (!string.IsNullOrEmpty(partiesInvolved.AMBULANCE_DEPARTURE))
            {
                try
                {
                    injuryTreatment.ambulance_departure = DateTime.ParseExact(partiesInvolved.AMBULANCE_DEPARTURE, formatMOBTimeString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{partiesInvolved.AMBULANCE_DEPARTURE}'.");
                };
            }

            injuryTreatment.hospital = hospitalName;
            injuryTreatment.other_hospital = partiesInvolved.HOSPITAL_OTHER;
            injuryTreatment.created_by = partiesInvolved.OFFICER_ID;
            injuryTreatment.created_time = createdTime;
            injuryTreatment.injury_condition = partiesInvolved.REMARKS_DEGREE_INJURY;

            return injuryTreatment;
        }
        public static driver ToDriver(MOBPartiesInvolved partiesInvolved, int driverId, int personId, int? treatmentId, DateTime createdTime)
        {

            driver driver = new driver();

            driver.driver_id = driverId;
            driver.person_id = personId;
            driver.licence_type = (short?)partiesInvolved.LICENSE_TYPE_CODE;

            if (!string.IsNullOrEmpty(partiesInvolved.LICENSE_EXPIRY_DATE))
            {
                try
                {
                    driver.licence_expiry_date = DateTime.ParseExact(partiesInvolved.LICENSE_EXPIRY_DATE, formatMOBDateString, CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    Console.WriteLine($"Error: Invalid date format for '{partiesInvolved.LICENSE_EXPIRY_DATE}'.");
                };
            }

            driver.licence_class = partiesInvolved.LICENSE_CLASS_CODE;
            driver.degree_of_injury = partiesInvolved.REMARKS_DEGREE_INJURY;
            driver.alcoholic_breath = (short?)partiesInvolved.ALCOHOL_BREATH;
            driver.breathalyzer_number = partiesInvolved.BREATHALYZER_NO;
            driver.breathalyzer_result = (short?)partiesInvolved.BREATHALYZER_RESULT;
            driver.treatment_id = treatmentId;
            driver.created_by = partiesInvolved.OFFICER_ID;
            driver.created_time = createdTime;
            driver.other_licence = partiesInvolved.OTHER_LICENCE;

            return driver;
        }
        public static vehicle ToVehicle(MOBPartiesInvolved partiesInvolved, int vehicleId, DateTime createdTime)
        {
            vehicle vehicle = new vehicle();

            vehicle.vehicle_id = vehicleId;
            vehicle.registration_number = partiesInvolved.REGISTRATION_NO;
            vehicle.vehicle_type = partiesInvolved.TYPE_CODE;
            vehicle.vehicle_make = partiesInvolved.MAKE_CODE;
            vehicle.vehicle_model = partiesInvolved.MODEL;
            vehicle.vehicle_colour = partiesInvolved.COLOR;
            vehicle.vehicle_colour_code = partiesInvolved.COLOR_CODE;
            vehicle.vehicle_in_flame = partiesInvolved.IN_FLAME;
            vehicle.vehicle_remarks = partiesInvolved.REMARKS_VEHICLE;
            vehicle.created_by = partiesInvolved.OFFICER_ID;
            vehicle.created_time = createdTime;
            vehicle.local_vehicle = partiesInvolved.LOCAL_PLATE;
            vehicle.special_plate = partiesInvolved.SPECIAL_PLATE;

            return vehicle;
        }
        public static vehicle ToVehicleSummons(MOBOffender offenders, int vehicleId, int createdBy, DateTime createdTime)
        {
            vehicle vehicle = new vehicle();

            vehicle.vehicle_id = vehicleId;
            vehicle.registration_number = offenders.REGISTRATION_NO;
            vehicle.vehicle_type = offenders.TYPE_CODE;
            vehicle.vehicle_make = offenders.MAKE_CODE;
            vehicle.vehicle_colour = offenders.COLOR;
            vehicle.vehicle_colour_code = offenders.COLOR_CODE;
            vehicle.created_time = createdTime;
            vehicle.created_by = createdBy;
            vehicle.local_vehicle = offenders.LOCAL_PLATE;
            vehicle.vehicle_transmission_type = (short?)offenders.TRANSMISSION_TYPE;
            vehicle.vehicle_class_3c_eligibility = (short?)offenders.ELIGIBLE_CLASS_3C;
            vehicle.vehicle_category = (short?)offenders.CATEGORY_CODE;
            vehicle.vehicle_weight = offenders.WEIGHT;
            vehicle.special_plate = offenders.SPECIAL_PLATE;
            return vehicle;
        }

        public static vehicle_involved ToVehicleInvolved(MOBPartiesInvolved partiesInvolved, int vehicleInvolvedId, int vehicleId, int? driverId)
        {
            vehicle_involved vehicle = new vehicle_involved();

            vehicle.vehicle_involved_id = vehicleInvolvedId;
            vehicle.incident_number = partiesInvolved.INCIDENT_NO;
            vehicle.vehicle_id = vehicleId;
            vehicle.driver_id = driverId;

            return vehicle;
        }

        public static offender_vehicle ToOffenderVehicle(MOBOffender offenders, int offenderVehicleId, int vehicleId, int? offenderId, int createdBy, DateTime createdTime)
        {
            offender_vehicle vehicle = new offender_vehicle();

            vehicle.offender_vehicle_id = offenderVehicleId;
            vehicle.offender_id = offenderId;
            vehicle.summons_id = offenders.SUMMONS_ID;
            vehicle.created_by = createdBy;
            vehicle.created_time = createdTime;
            vehicle.vehicle_id = vehicleId;

            return vehicle;
        }

        public static offender ToOffender(MOBOffender offenders, int? offenderId, int? personId, int createdBy, DateTime createdTime, DateTime offenceDateTime)
        {
            offender offender = new offender();

            offender.offender_id = (int)offenderId;
            offender.summons_id = offenders.SUMMONS_ID;
            offender.person_id = (int)personId;
            offender.offender_type = (short)offenders.OFFENDER_TYPE_ID;
            offender.offender_involvement_code = (short)offenders.INVOLVEMENT_ID;
            offender.offence_time = offenceDateTime;
            offender.offender_remarks = offenders.REMARKS_IDENTIFICATION;
            offender.created_by = createdBy;
            offender.created_time = createdTime;
            offender.licence_type = (short?)offenders.LICENSE_TYPE_CODE;
            offender.licence_class = offenders.LICENSE_CLASS_CODE;
            offender.other_licence = offenders.OTHER_LICENSE;
            offender.under_arrest = GetYesNoUnknownValue(offenders.UNDER_ARREST);
            offender.bail_granted = GetYesNoUnknownValue(offenders.BAIL_GRANTED);
            offender.breath_analyser = GetYesNoUnknownValue(offenders.BREATH_ANALYZER);
            offender.furnish_insurance = GetYesNoUnknownValue(offenders.FURNISH_INSURANCE);

            return offender;
        }
        public static string GetYesNoUnknownValue(int mobValue)
        {
            switch (mobValue)
            {
                case 1:
                    return "Y";
                case 2:
                    return "N";
                case 3:
                    return "U";
                default:
                    return null; 
            }
        }
        public static string GetYesNoUnknownValue(string input)
        {
            switch (input)
            {
                case "1":
                    return "Y";
                case "2":
                    return "N";
                case "3":
                    return "U";
                default:
                    return null;
            }
        }
        public static passenger ToPassenger(MOBPartiesInvolved partiesInvolved, int passengerId, int personId, int vehicleId, int? treatmentId, DateTime createdTime)
        {
            passenger passenger = new passenger();

            passenger.passenger_id = passengerId;
            passenger.person_id = personId;
            passenger.created_by = partiesInvolved.OFFICER_ID;
            passenger.created_time = createdTime;
            passenger.vehicle_id = vehicleId;
            passenger.treatment_id = treatmentId;
            passenger.passenger_involved = (short)partiesInvolved.INVOLVEMENT_ID;

            return passenger;
        }

        public static passenger ToPassengerSummons(MOBOffender offenders, int passengerId, int personId, int vehicleId, int createdBy, DateTime createdTime)
        {
            passenger passenger = new passenger();

            passenger.passenger_id = passengerId;
            passenger.person_id = personId;
            passenger.created_by = createdBy;
            passenger.created_time = createdTime;
            passenger.vehicle_id = vehicleId;
            passenger.passenger_involved = (short)offenders.INVOLVEMENT_ID;

            return passenger;
        }

        public static person_involved ToPersonInvolved(MOBPartiesInvolved partiesInvolved, int personInvolvedId, int personId, int personInvolvedType, int? treatmentId)
        {
            person_involved personInvolved = new person_involved();

            personInvolved.person_involved_id = personInvolvedId;
            personInvolved.incident_number = partiesInvolved.INCIDENT_NO;
            personInvolved.pedestrian_or_witness = (short)personInvolvedType;
            personInvolved.person_id = personId;
            personInvolved.treatment_id = treatmentId;

            return personInvolved;
        }

    }
}