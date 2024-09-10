using log4net;
using SPOTS_Repository;
using System;
using System.Configuration;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.IO.Compression;
using System.Xml;
using System.Text;
using Renci.SshNet;

namespace SPOTS_API_Attachment
{

    class SPOTS_API_Attachment
    {
        private static readonly log4net.ILog log =
            LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        const string ATTACHMENT_PATH = "AttachmentPath";

        static void Main(string[] args)
        {
            string strZipFilepath = "";
            string strXMLFilePath = "";

            log.Info("===============================================================");
            log.Info("SPOTS_API_Attachment Started");
            SPOTS_OAEntities db = new SPOTS_OAEntities();

            try
            {
                var apiRequestList = db.spApiAttachmentGetPending();
                int iAttCount = 0;
                foreach (var req in apiRequestList)
                {
                    iAttCount++;
                }

                if (iAttCount > 0)
                {
                    apiRequestList = db.spApiAttachmentGetPending();

                    string mFIR = "";
                    int mRequestID = 0;
                    string mFIRFormatted = "";
                    AppConfig appConfig = new AppConfig();

                    String strAttachmentPath = ConfigurationManager.AppSettings[ATTACHMENT_PATH];
                    String strZipName = "spots_crimes_" + DateTime.Now.ToString("yyyyMMddHHmmss");

                    String strZipFolder = strAttachmentPath + "\\" + strZipName;

                    // create directory
                    if (!Directory.Exists(strZipFolder))
                    {
                        DirectoryInfo di = Directory.CreateDirectory(strZipFolder);
                    }

                    iAttCount = 0;

                    XmlWriterSettings settings = new XmlWriterSettings();
                    settings.Encoding = new UTF8Encoding(false);

                    using (XmlWriter writer = XmlWriter.Create(strAttachmentPath + "\\" + strZipName + ".xml", settings))
                    {
                        writer.WriteStartElement("spotsOSI");
                        writer.WriteStartElement("header");         // start of header
                        writer.WriteElementString("timestamp", DateTime.Now.ToString("yyyy-MM-ddThh:mm:ss"));
                        writer.WriteElementString("source", "SPOTS");
                        writer.WriteElementString("destination", "CRIMES3");
                        writer.WriteEndElement();                   // end of header
                        writer.WriteStartElement("details");

                        foreach (var req in apiRequestList)
                        {
                            if (!mFIR.Equals(req.fir))
                            {
                                if (mFIR.Length > 0)
                                {
                                    writer.WriteEndElement();   // attachments
                                    writer.WriteEndElement();   // detail

                                    // update db
                                    SPOTS_OAEntities dbUpdate = new SPOTS_OAEntities();

                                    ObjectParameter outputResponseID = new ObjectParameter("responseID", typeof(Int32));
                                    dbUpdate.spApiUpdateAttachmentResponse(mRequestID, strZipName, strZipName, outputResponseID);

                                    log.Info("ResponseID = " + outputResponseID.ToString());
                                }

                                mFIR = req.fir;
                                mFIRFormatted = mFIR.Replace("/", "_");
                                mRequestID = req.request_id;
                                log.Info("");
                                log.Info("Processing FIR " + mFIR);

                                writer.WriteStartElement("detail");
                                writer.WriteElementString("FIR", mFIR);
                                writer.WriteStartElement("attachments");
                            }

                            log.Info("Processing FIR " + mFIR + ", File Type " + req.file_type);

                            string sourceFile = "";
                            string destinationFile = "";

                            switch (req.file_type)
                            {
                                case "NP149":
                                    // create web client to create OSI pdf
                                    try
                                    {
                                        iAttCount++;

                                        writer.WriteStartElement("attachment");
                                        writer.WriteElementString("fileType", req.file_type);

                                        WebClientX myWebClient = new WebClientX();

                                        Stream myStream = myWebClient.OpenRead(appConfig.osiPdfUrl + mFIR);

                                        using (var fileStream = File.Create(strZipFolder + "\\" + mFIRFormatted + ".pdf"))
                                        {
                                            myStream.CopyTo(fileStream);
                                            log.Info("NP149 = " + mFIRFormatted + ".pdf");
                                            writer.WriteElementString("fileName", mFIRFormatted + ".pdf");
                                        }

                                        writer.WriteEndElement();   // attachment
                                    }
                                    catch (Exception ex)
                                    {
                                        log.Error("Error creating NP149 " + ex.Message);
                                        log.Error("Error creating NP149 " + ex.InnerException);
                                        break;
                                    }
                                    break;


                                case "Photo":
                                case "SketchPlan":
                                case "VDR":
                                    var attPathList = db.spApiAttachmentGetNP149Attachment(mFIR, req.file_type, req.file_id).GetEnumerator();
                                    if (attPathList.MoveNext())
                                    {
                                        sourceFile = (String)attPathList.Current;

                                        if (sourceFile != null && sourceFile.Length>0)
                                        {
                                            iAttCount++;

                                            writer.WriteStartElement("attachment");
                                            writer.WriteElementString("fileType", req.file_type);

                                            sourceFile = @".\" + sourceFile;
                                            sourceFile = sourceFile.Replace("/", @"\");
                                            
                                            String[] arrPath = sourceFile.Split('\\');
                                            destinationFile = strZipFolder + "\\" + arrPath[arrPath.Length - 1];

                                            writer.WriteElementString("fileName", arrPath[arrPath.Length - 1]);

                                            log.Info("Source = " + sourceFile);
                                            log.Info("Destination = " + destinationFile);

                                            if (File.Exists(sourceFile))
                                                File.Copy(sourceFile, destinationFile, true);
                                            else
                                                log.Error("Source file " + sourceFile + " does not exist!");

                                            writer.WriteEndElement();   // attachment
                                        }
                                    }

                                    break;
                            }

                        }

                        if (mRequestID > 0)
                        {
                            writer.WriteEndElement();   // attachments
                            writer.WriteEndElement();   // detail

                            // update db
                            SPOTS_OAEntities dbUpdate = new SPOTS_OAEntities();

                            ObjectParameter outputResponseID = new ObjectParameter("responseID", typeof(Int32));
                            dbUpdate.spApiUpdateAttachmentResponse(mRequestID, strZipName, strZipName, outputResponseID);

                            log.Info("ResponseID = " + outputResponseID.Value.ToString());
                        }

                        writer.WriteEndElement();   // details

                        writer.WriteStartElement("trailer");
                        writer.WriteElementString("totalNumber", iAttCount.ToString());
                        writer.WriteEndElement();   // trailer

                        writer.WriteEndElement();   // spotsOSI
                        writer.Flush();

                    }

                    // check xml file until it exists, then can create zip file
                    while (!File.Exists(strAttachmentPath + "\\" + strZipName + ".xml"))
                    {
                        //do nothing
                    }

                    // produce attachment, xml and zip
                    strZipFilepath = strAttachmentPath + @"\" + strZipName + ".zip";
                    ZipFile.CreateFromDirectory(strZipFolder, strZipFilepath);

                    strXMLFilePath = strAttachmentPath + @"\" + strZipName + ".xml";

                    // if zip is successfully created, delete the folder
                    if (File.Exists(strZipFilepath))
                    {

                        string[] files = Directory.GetFiles(strZipFolder);
                        foreach (string file in files)
                        {
                            File.Delete(file);
                        }

                        Directory.Delete(strZipFolder);
                    }

                    log.Info(iAttCount.ToString() + " attachment(s).");

                    if (iAttCount > 0)
                    {
                        // Create FTP connection
                        SftpClient ftpClient = SFTPUtility.CreateFTPConnection(appConfig.keyPath,
                            appConfig.ftpHost,
                            appConfig.ftpUserName);
                        if (ftpClient != null)
                        {
                            log.Info("SFTP Connection established.");

                            using (var fileStream = new FileStream(strZipFilepath, FileMode.Open))
                            {
                                var putRemoteFolderFilePath = Path.Combine(appConfig.putRemoteFolder, Path.GetFileName(strZipFilepath));
                                log.Info("Uploading " + Path.GetFileName(strZipFilepath) + " to " + putRemoteFolderFilePath);
                                ftpClient.BufferSize = 4 * 1024; // bypass Payload error large files
                                ftpClient.UploadFile(fileStream, putRemoteFolderFilePath, null);
                                ftpClient.ChangePermissions(putRemoteFolderFilePath, 755);

                                log.Info("Remote FTP file " + putRemoteFolderFilePath + " mode change to 755");
                                log.Info("File " + Path.GetFileName(strZipFilepath) + " uploaded to " + putRemoteFolderFilePath);
                            }

                            using (var fileStream = new FileStream(strXMLFilePath, FileMode.Open))
                            {
                                var putRemoteFolderFilePath = Path.Combine(appConfig.putRemoteFolder, Path.GetFileName(strXMLFilePath));
                                log.Info("Uploading " + Path.GetFileName(strXMLFilePath) + " to " + putRemoteFolderFilePath);
                                ftpClient.BufferSize = 4 * 1024; // bypass Payload error large files
                                ftpClient.UploadFile(fileStream, putRemoteFolderFilePath, null);
                                ftpClient.ChangePermissions(putRemoteFolderFilePath, 755);

                                log.Info("Remote FTP file " + putRemoteFolderFilePath + " mode change to 755");
                                log.Info("File " + Path.GetFileName(strXMLFilePath) + " uploaded to " + putRemoteFolderFilePath);
                            }
                        }
                        else
                        {
                            log.Error("Failed to establish SFTP Connection.");
                        }
                    }
                }
                else
                {
                    log.Info("There is no api request to process.");
                }
            }
            catch (Exception ex)
            {
                log.Error("Error Message : " + ex.Message);
                log.Error("Error InnerException : " + ex.InnerException);
            }

            log.Info("SPOTS_API_Attachment Completed");
            log.Info("===============================================================");

        }
    }
}
