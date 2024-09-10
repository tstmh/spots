namespace SPOTSMobileApi.Models
{
    public class MOBAccidentReport
    {
        public string ID { get; set; }
        public string INCIDENT_NO { get; set; }
        public string DEVICE_ID { get; set; }
        public int OFFICER_ID { get; set; }
        public int IO_NAME { get; set; }
        public string IO_EXTENSION_NO { get; set; }
        public int INCIDENT_OCCURED { get; set; }
        public string LOCATION_CODE { get; set; }
        public string LOCATION_CODE_2 { get; set; }
        public int? SPECIAL_ZONE { get; set; }
        public string REMARKS_LOCATION { get; set; }
        public string CREATED_AT { get; set; }
        public int? STATUS_ID { get; set; }
        public string STRUCTURE_DAMAGES { get; set; }
        public int? WEATHER_CODE { get; set; }
        public string WEATHER_OTHER_CODE { get; set; }
        public int? ROAD_SURFACE_CODE { get; set; }
        public string ROAD_SURFACE_OTHER { get; set; }
        public int? TRAFFIC_VOLUME_CODE { get; set; }
        public string DECLARATION_INDICATOR { get; set; }
        public string OFFICER_RANK { get; set; }
        public string DIVISION { get; set; }
        public string DECLARATION_DATE { get; set; }
        public string PRESERVE_DATE { get; set; }
        public string SCHOOL_NAME { get; set; }
        public string ACCIDENT_TIME { get; set; }
        public string PO_ARRIVAL_TIME { get; set; }
        public string PO_RESUME_DUTY_TIME { get; set; }
    }
}