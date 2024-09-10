namespace SPOTSMobileApi.Models
{
    public class MOBImages
    {
		public string ID { get; set; }
        public int ACCIDENT_REPORT_ID { get; set; }
        public string INCIDENT_NO { get; set; }
        public string DEVICE_ID { get; set; }
        public int OFFICER_ID { get; set; } 
        public string IMAGE_TYPE { get; set; }
        public string CAPTION { get; set; }
	    public string IMAGE64 { get; set; }
	    public string CREATED_AT { get; set; } 
        public string TYPE_CODE { get; set; } 
	    public string REGISTRATION_NO { get; set; } 
	    public string MAKE_CODE { get; set; }
	    public string COLOR { get; set; }
        public string COLOR_CODE { get; set; }
        public int PLATE_DISPLAYED { get; set; } 
	    public string ACCIDENT_DATE { get; set; } 
	    public string EXAMINATION_DATE { get; set; }
	    public int INCIDENT_OCCURED { get; set; }
	    public string LOCATION_CODE { get; set; }
	    public string LOCATION_CODE_2 { get; set; } 
    }
}