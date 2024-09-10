using SPOTS_Repository;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SPOTSapi.Models
{

    class CustomDateTimeConverter : IsoDateTimeConverter
    {
        public CustomDateTimeConverter()
        {
            base.DateTimeFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
        }
    }

    class CustomDateConverter : IsoDateTimeConverter
    {
        public CustomDateConverter()
        {
            base.DateTimeFormat = "yyyy-MM-dd";
        }
    }

    public class NP149Response
    {
        public char statusCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string errorCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string errorMessage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IncidentReport incident { get; set; }
    }

    public class IncidentReport
    {
        public string incidentNumber { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> incidentReportedDateTime { get; set; }
        public string poName { get; set; }
        public string poNric { get; set; }
        public string poDivision { get; set; }
        public string poRank { get; set; }
        public string ioName { get; set; }
        public string ioNric { get; set; }
        public string ioExtension { get; set; }

        public FirstPOForm firstPOForm { get; set; }
        public IncidentReport(spApiGetNP149_Result incident)
        {
            this.incidentNumber = incident.incidentNumber;
            this.incidentReportedDateTime = incident.incidentReportedDateTime;
            this.poName = incident.poName;
            this.poNric = incident.poNric;
            this.poDivision = incident.poDivision;
            this.poRank = incident.poRank;
            this.ioName = incident.ioName;
            this.ioNric = incident.ioNric;
            this.ioExtension = incident.ioExtension;
        }
    }

    public class FirstPOForm
    {

        public Location incidentLocation { get; set; }
        public List<VehicleInvolved> vehicleInvolved { get; set; }
        public List<PedestrianOrWitness> pedestrianInvolved { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string structureDamage { get; set; }
        public List<PedestrianOrWitness> witness { get; set; }
        public OfficerDeclaration officerDeclaration { get; set; }

    }

    public class OfficerDeclaration
    {
        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> arrivalTime { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> resumeDutyTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> weather { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> roadSurface { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> trafficVolume { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> preserveDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string officerRank { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string officerName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string officerTeam { get; set; }

        public OfficerDeclaration(spApiGetNP149Declaration_Result _declare)
        {
            this.arrivalTime = _declare.arrivalTime;
            this.resumeDutyTime = _declare.resumeDutyTime;
            this.weather = _declare.weather;
            this.roadSurface = _declare.roadSurface;
            this.trafficVolume = _declare.trafficVolume;
            this.preserveDateTime = _declare.preserveDateTime;
            this.officerRank = _declare.officerRank;
            this.officerName = _declare.officerName;
            this.officerTeam = _declare.officerTeam;
        }

    }

    public class Location 
    {
        public Nullable<short> specialZoneCode { get; set; }
        public string location1 { get; set; }

        public string location2Type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string location2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string locationRemarks { get; set; }

        public Location(spApiGetNP149Location_Result _location)
        {
            this.specialZoneCode = _location.specialZoneCode;
            this.location1 = _location.location1;
            this.location2Type = _location.location2Type;
            this.location2 = _location.location2;
            this.locationRemarks = _location.locationRemarks;
        }
    }

    public class VehicleInvolved 
    {
        public string registrationNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string localVehicle { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string specialForeignPartialPlateIndicator { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string make { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string model { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string colour { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string colourCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string fireIndicator { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string vehicleRemarks { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Driver driver { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<Passenger> passenger { get; set; }
        public VehicleInvolved(spApiGetNP149Vehicle_Result _vehicle)
        {
            this.registrationNumber = _vehicle.registrationNumber;
            this.localVehicle = _vehicle.localVehicle;
            this.specialForeignPartialPlateIndicator = _vehicle.specialForeignPartialPlateIndicator;
            this.type = _vehicle.type;
            this.make = _vehicle.make;
            this.model = _vehicle.model;
            this.colour = _vehicle.colour;
            this.colourCode = _vehicle.colourCode;
            this.fireIndicator = _vehicle.fireIndicator;
            this.vehicleRemarks = _vehicle.vehicleRemarks;
        }

    }

    public class Driver
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> drivingLicenceType { get; set; }

        [JsonConverter(typeof(CustomDateConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> licenceExpiryDate { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string licenceClass { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string otherLicence { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string driverRiderDegreeOfInjury { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> alcoholicBreath { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string breathalyzerNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> breathalyzerResult { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DriverIdentification identification { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DriverAddress address { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DriverInjuryTreatment treatment { get; set; }
        public Driver(spApiGetNP149VehicleDriver_Result _driver)
        {
            this.drivingLicenceType = _driver.drivingLicenceType;
            this.licenceExpiryDate = _driver.licenceExpiryDate;
            this.licenceClass = _driver.licenceClass;
            this.otherLicence = _driver.otherLicence;
            this.driverRiderDegreeOfInjury = _driver.driverRiderDegreeOfInjury;
            this.alcoholicBreath = _driver.alcoholicBreath;
            this.breathalyzerNumber = _driver.breathalyzerNumber;
            this.breathalyzerResult = _driver.breathalyzerResult;
        }
    }

    public class Passenger
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public short passengerInvolved { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public PassengerIdentification identification { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public PassengerAddress address { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public PassengerInjuryTreatment treatment { get; set; }

        public Passenger(spApiGetNP149VehiclePassenger_Result _passenger)
        {
            this.passengerInvolved = _passenger.passengerInvolved;
        }
    }

    public class PedestrianOrWitness
    {
        public PedestrianOrWitnessIdentification identification { get; set; }
        public PedestrianOrWitnessAddress address { get; set; }
        //public InjuryTreatment treatment { get; set; }
    }

    public class DriverAddress
    {
        public short addressType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string blockHouseNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string street { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string floor { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string unitNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string buildingName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string postalCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string addressRemarks { get; set; }
        public DriverAddress(spApiGetNP149VehicleDriverAddress_Result _address)
        {
            this.addressType = _address.addressType;
            this.blockHouseNumber = _address.blockHouseNumber;
            this.street = _address.street;
            this.floor = _address.floor;
            this.unitNumber = _address.unitNumber;
            this.buildingName = _address.buildingName;
            this.postalCode = _address.postalCode;
            this.addressRemarks = _address.addressRemarks;
        }
    }

    public class PassengerAddress 
    {
        public short addressType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string blockHouseNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string street { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string floor { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string unitNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string buildingName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string postalCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string addressRemarks { get; set; }
        public PassengerAddress(spApiGetNP149VehiclePassengerAddress_Result _address)
        {
            this.addressType = _address.addressType;
            this.blockHouseNumber = _address.blockHouseNumber;
            this.street = _address.street;
            this.floor = _address.floor;
            this.unitNumber = _address.unitNumber;
            this.buildingName = _address.buildingName;
            this.postalCode = _address.postalCode;
            this.addressRemarks = _address.addressRemarks;
        }
    }

    public class PedestrianOrWitnessAddress
    {
        public Nullable<short> addressType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string blockHouseNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string street { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string floor { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string unitNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string buildingName { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string postalCode { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string addressRemarks { get; set; }
        public PedestrianOrWitnessAddress(spApiGetNP149PedestrianOrWitnessAddress_Result _address)
        {
            this.addressType = _address.addressType;
            this.blockHouseNumber = _address.blockHouseNumber;
            this.street = _address.street;
            this.floor = _address.floor;
            this.unitNumber = _address.unitNumber;
            this.buildingName = _address.buildingName;
            this.postalCode = _address.postalCode;
            this.addressRemarks = _address.addressRemarks;
        }
    }

    public class DriverInjuryTreatment
    {
        public string ambulanceNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aoIdentity { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> arrivalDateTime { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> departureDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string hospital { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string otherHospital { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string injuryCondition { get; set; }
        public DriverInjuryTreatment(spApiGetNP149VehicleDriverTreatment_Result _treatment)
        {
            this.ambulanceNumber = _treatment.ambulanceNumber;
            this.aoIdentity = _treatment.aoIdentity;
            this.arrivalDateTime = _treatment.arrivalDateTime;
            this.departureDateTime = _treatment.departureDateTime;
            this.hospital = _treatment.hospital;
            this.otherHospital = _treatment.otherHospital;
            this.injuryCondition = _treatment.injuryCondition;
        }

    }

    public class PassengerInjuryTreatment
    {
        public string ambulanceNumber { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string aoIdentity { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> arrivalDateTime { get; set; }
        
        [JsonConverter(typeof(CustomDateTimeConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> departureDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string hospital { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string otherHospital { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string injuryCondition { get; set; }
        public PassengerInjuryTreatment(spApiGetNP149VehiclePassengerTreatment_Result _treatment)
        {
            this.ambulanceNumber = _treatment.ambulanceNumber;
            this.aoIdentity = _treatment.aoIdentity;
            this.arrivalDateTime = _treatment.arrivalDateTime;
            this.departureDateTime = _treatment.departureDateTime;
            this.hospital = _treatment.hospital;
            this.otherHospital = _treatment.otherHospital;
            this.injuryCondition = _treatment.injuryCondition;
        }

    }

    public class DriverIdentification 
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> idType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string idNumber { get; set; }

        [JsonConverter(typeof(CustomDateConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> dateOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> gender { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string countryOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string nationality { get; set; }
        public DriverIdentification(spApiGetNP149VehicleDriverIdentity_Result _id)
        {
            this.name = _id.name;
            this.idType = _id.idType;
            this.idNumber = _id.idNumber;
            this.dateOfBirth = _id.dateOfBirth;
            this.gender = _id.gender;
            this.contactNumber1 = _id.contactNumber1;
            this.contactNumber2 = _id.contactNumber2;
            this.countryOfBirth = _id.countryOfBirth;
            this.nationality = _id.nationality;
        }
    }

    public class PassengerIdentification
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> idType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string idNumber { get; set; }

        [JsonConverter(typeof(CustomDateConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> dateOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> gender { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string countryOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string nationality { get; set; }
        public PassengerIdentification(spApiGetNP149VehiclePassengerIdentity_Result _id)
        {
            this.name = _id.name;
            this.idType = _id.idType;
            this.idNumber = _id.idNumber;
            this.dateOfBirth = _id.dateOfBirth;
            this.gender = _id.gender;
            this.contactNumber1 = _id.contactNumber1;
            this.contactNumber2 = _id.contactNumber2;
            this.countryOfBirth = _id.countryOfBirth;
            this.nationality = _id.nationality;
        }
    }

    public class PedestrianOrWitnessIdentification
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> idType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string idNumber { get; set; }

        [JsonConverter(typeof(CustomDateConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<System.DateTime> dateOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Nullable<short> gender { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string contactNumber2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string countryOfBirth { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string nationality { get; set; }

        public PedestrianOrWitnessIdentification(spApiGetNP149PedestrianOrWitnessIdentity_Result _id)
        {
            this.name = _id.name;
            this.idType = _id.idType;
            this.idNumber = _id.idNumber;
            this.dateOfBirth = _id.dateOfBirth;
            this.gender = _id.gender;
            this.contactNumber1 = _id.contactNumber1;
            this.contactNumber2 = _id.contactNumber2;
            this.countryOfBirth = _id.countryOfBirth;
            this.nationality = _id.nationality;
        }
    }



}