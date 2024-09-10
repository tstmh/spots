namespace SPOTSMobileApi.Models
{
    public class MOBOffences
    {
        public int ID { get; set; }
        public int OFFENDER_ID { get; set; }
        public int SUMMONS_ID { get; set; }
        public string SPOTS_ID { get; set; }
        public string OFFENCE_TYPE_ID { get; set; }
        public string OFFENCE_DATE { get; set; }
        public string OFFENCE_TIME { get; set; }
        public string REMARKS { get; set; }
        public string SPEED_CLOCKED { get; set; }
        public string SPEED_LIMIT { get; set; }
        public string ROAD_LIMIT { get; set; }
        public int SPEED_LIMITER_REQUIRED { get; set; }
        public int SPEED_DEVICE_ID { get; set; }
        public int SPEED_LIMITER_INSTALLED { get; set; }
        public int SENT_INSPECTION { get; set; }
        public string CREATED_AT { get; set; }
        public int OPERATION_TYPE { get; set; }
        public int PARENT_ID { get; set; }
    }
}