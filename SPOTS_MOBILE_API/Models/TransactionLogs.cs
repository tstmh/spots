namespace SPOTSMobileApi.Models
{
    public class TransactionLogs
    {
        public int ID { get; set; }
        public string LOG_DATE { get; set; }
        public int OFFICER_ID { get; set; }
        public string DEVICE_ID { get; set; }
        public string TYPE { get; set; }
        public string DESCRIPTION { get; set; }
    }
}