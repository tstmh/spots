using Renci.SshNet;
using System.IO;
using System;
using log4net;

namespace SPOTS_API_Attachment
{
    class SFTPUtility
    {
        private static readonly log4net.ILog log =
            LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static SftpClient CreateFTPConnection(string keyPath, string host, string userName)
        {
            try
            {

                // Create FTP connection
                PrivateKeyFile ObjPrivateKey = null;
                PrivateKeyAuthenticationMethod ObjPrivateKeyAuthentication = null;

                using (Stream stream = File.OpenRead(keyPath))
                {
                    ObjPrivateKey = new PrivateKeyFile(stream);
                    ObjPrivateKeyAuthentication = new PrivateKeyAuthenticationMethod(userName, ObjPrivateKey);

                    ConnectionInfo objConnectionInfo = new ConnectionInfo(host, userName, ObjPrivateKeyAuthentication);
                    SftpClient client = new SftpClient(objConnectionInfo);

                    client.Connect();

                    return client;
                }

            }
            catch (Exception ex)
            {
                log.Debug("CreateFTPConnection " + ex.ToString());
                return null;
            }
        }
    }
}
