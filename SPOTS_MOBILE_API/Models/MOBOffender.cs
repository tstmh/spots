namespace SPOTSMobileApi.Models
{
    public class MOBOffender
    {

        public int ID { get; set; }
        public int SUMMONS_ID { get; set; }
        public string SPOTS_ID { get; set; }
        public int OFFENDER_TYPE_ID { get; set; }
        public string REGISTRATION_NO { get; set; }
        public bool? LOCAL_PLATE { get; set; }
        public bool? SPECIAL_PLATE { get; set; }
        public int UNDER_ARREST { get; set; }
        public int BAIL_GRANTED { get; set; }
        public int BREATH_ANALYZER { get; set; }
        public string FURNISH_INSURANCE { get; set; }
        public string NAME { get; set; }
        public int INVOLVEMENT_ID { get; set; }
        public int ID_TYPE { get; set; }
        public string IDENTIFICATION_NO { get; set; }
        public string DATE_OF_BIRTH { get; set; }
        public int GENDER_CODE { get; set; }
        public int LICENSE_TYPE_CODE { get; set; }
        public string LICENSE_EXPIRY_DATE { get; set; }
        public string LICENSE_CLASS_CODE { get; set; }
        public string BIRTH_COUNTRY { get; set; }
        public string NATIONALITY { get; set; }
        public string CONTACT_1 { get; set; }
        public string CONTACT_2 { get; set; }
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
        public string TYPE_CODE { get; set; }
        public int CATEGORY_CODE { get; set; }
        public int TRANSMISSION_TYPE { get; set; }
        public int ELIGIBLE_CLASS_3C { get; set; }
        public string MAKE_CODE { get; set; }
        public string COLOR { get; set; }
        public string WEIGHT { get; set; }
        public int OPERATION_TYPE { get; set; }
        public string OTHER_LICENSE { get; set; }
        public int NOT_OFFENDER { get; set; }
        public string COLOR_CODE { get; set; }
        public string OFFENCE_DATE { get; set; }
        public string OFFENCE_TIME { get; set; }

    }
}