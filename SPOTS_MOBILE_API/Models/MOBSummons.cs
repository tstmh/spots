namespace SPOTSMobileApi.Models
{
    public class MOBSummons
    {
        public int ID { get; set; }
        public string SPOTS_ID { get; set; }
        public string DEVICE_ID { get; set; }
        public int OFFICER_ID { get; set; }
        public int? STATUS_ID { get; set; }
        public string TYPE { get; set; }
        public string CREATED_AT { get; set; }
        public int INCIDENT_OCCURED { get; set; }
        public string LOCATION_CODE { get; set; }
        public string LOCATION_CODE_2 { get; set; }
        public int? SPECIAL_ZONE { get; set; }
        public string REMARKS_LOCATION { get; set; }
        public string SCHOOL_NAME { get; set; }

    }
}