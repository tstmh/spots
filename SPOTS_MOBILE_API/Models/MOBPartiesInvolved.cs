namespace SPOTSMobileApi.Models
{
    public class MOBPartiesInvolved
    {
        public string ID { get; set; }
        public string INCIDENT_NO { get; set; }
	    public string DEVICE_ID { get; set; }
        public int OFFICER_ID { get; set; }
        public int PERSON_TYPE_ID { get; set; }
        public int INVOLVEMENT_ID { get; set; }
        public string REGISTRATION_NO { get; set; }
        public string TYPE_CODE { get; set; }
        public bool? LOCAL_PLATE { get; set; }
        public bool? SPECIAL_PLATE { get; set; }
        public string MAKE_CODE { get; set; }
        public string MODEL { get; set; }
        public string COLOR { get; set; }
        public string COLOR_CODE { get; set; }
        public bool? IN_FLAME { get; set; }
        public int ALCOHOL_BREATH { get; set; }
        public string BREATHALYZER_NO { get; set; }
        public int BREATHALYZER_RESULT { get; set; }
        public string NAME { get; set; }
        public int ID_TYPE { get; set; }
        public string IDENTIFICATION_NO { get; set; }
        public string DATE_OF_BIRTH { get; set; }
        public int SEX_CODE { get; set; }
        public int LICENSE_TYPE_CODE { get; set; }
        public string LICENSE_EXPIRY_DATE { get; set; }
        public string LICENSE_CLASS_CODE { get; set; }
        public string BIRTH_COUNTRY { get; set; }
        public string NATIONALITY { get; set; }
        public string CONTACT_1 { get; set; }
        public string CONTACT_2 { get; set; }
        public string REMARKS_DEGREE_INJURY { get; set; }
        public string REMARKS_IDENTIFICATION { get; set; }
        public int ADDRESS_TYPE { get; set; }
        public bool SAME_AS_REGISTERED { get; set; }
        public string BLOCK { get; set; }
        public string STREET { get; set; }
        public string FLOOR { get; set; }
        public string UNIT_NO { get; set; }
        public string BUILDING_NAME { get; set; }
        public string POSTAL_CODE { get; set; }
        public string REMARKS_ADDRESS { get; set; }
        public string AMBULANCE_NO { get; set; }
        public string AMBULANCE_AO_ID { get; set; }
        public string AMBULANCE_ARRIVAL { get; set; }
        public string AMBULANCE_DEPARTURE { get; set; }
        public int HOSPITAL_ID { get; set; }
        public string HOSPITAL_OTHER { get; set; }
        public string REMARKS_VEHICLE { get; set; }
        public string VEHICLE_SEQUENCE { get; set; }
        public string OTHER_LICENCE { get; set; }
        public string CATEGORY_CODE { get; set; }
        
    }
}