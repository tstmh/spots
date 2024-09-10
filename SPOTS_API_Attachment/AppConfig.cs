using System.Configuration;

namespace SPOTS_API_Attachment
{
    class AppConfig
    {
        public string ftpHost { get; set; }
        public string ftpUserName { get; set; }
        public string ftpPort { get; set; }
        public string keyPath { get; set; }
        public string putRemoteFolder { get; set; }
        public string osiPdfUrl { get; set; }

        public AppConfig()
        {

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.FTP_HOSTNAME]))
            {
                ftpHost = ConfigurationManager.AppSettings[Constants.FTP_HOSTNAME];
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.FTP_USERNAME]))
            {
                ftpUserName = ConfigurationManager.AppSettings[Constants.FTP_USERNAME];
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.FTP_PORT]))
            {
                ftpPort = ConfigurationManager.AppSettings[Constants.FTP_PORT];
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.FTP_KEYPATH]))
            {
                keyPath = ConfigurationManager.AppSettings[Constants.FTP_KEYPATH];
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.FTP_PUTREMOTEFOLDER]))
            {
                putRemoteFolder = ConfigurationManager.AppSettings[Constants.FTP_PUTREMOTEFOLDER];
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings[Constants.OSI_PDF_URL]))
            {
                osiPdfUrl = ConfigurationManager.AppSettings[Constants.OSI_PDF_URL];
            }
        }
    }
}
