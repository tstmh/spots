using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Configuration;
using System.Windows.Forms;
using log4net;
using log4net.Config;
using SPOTS_MQ_Interface;
using SPOTS_MQ_Interface.Enums;
using SPOTS_MQ_Interface.Services;
using System.Reflection;
using SPOTS_Utility;
using SPOTS_MQ_Interface.Models;
using SPOTS_Repository;

namespace SPOTS_MQ_Integrator
{
    public partial class MqDashboard : Form
    {

        #region private declaration

        private const string Mqconfig = "MQ_CONFIG";
        private const string Inchannel = "IN_CHANNEL";
        private const string Outchannel = "OUT_CHANNEL";
        private const string Build = "BUILD";

        private const string SourceAudit = "[MQ_Dashboard]";
        private static readonly ILog AuditLogger = LogManager.GetLogger("AuditLogger");
        private readonly string _inChannelConfiguration = ConfigurationManager.AppSettings[Inchannel];
        private readonly string _outChannelConfiguration = ConfigurationManager.AppSettings[Outchannel];

        private const string TimeStampReceivedFormat = "yyyyMMddHHmmssfff";

        private ConnectionEvent _mqConnectionStatus;

        [Import]
        private IMessageChannelController MessageChannelController { get; set; }

        [Import]
        private IUtility Utility { get; set; }


        #endregion

        public MqDashboard()
        {
            InitializeComponent();

            try
            {
                // Initialize log4net
                XmlConfigurator.Configure();
                // Initialize MEF container
                var catalog = new AggregateCatalog();
                catalog.Catalogs.Add(new AssemblyCatalog(typeof(MqDashboard).Assembly));
                catalog.Catalogs.Add(new DirectoryCatalog("."));
                var container = new CompositionContainer(catalog);
                // Fill the imports of this object
                container.ComposeParts(this);
            }
            catch (ReflectionTypeLoadException ex)
            {
                foreach (var item in ex.LoaderExceptions)
                {
                    AuditLogger.Error("MQ DashBoard ReflectionTypeLoadException error : " + item.Message);
                }
            }
            catch (Exception ex)
            {
                AuditLogger.Error("MQ DashBoard cannot be initialized: " + ex, ex);
            }
        }

        private void MQ_Dashboard_Load(object sender, EventArgs e)
        {

            AuditLogger.Debug(SourceAudit + " SPOTS MQ Dashboard Loaded");
            UpdateTextBoxAuditDisplay("Ready...");

            // Display App Build Number
            labelBuildNumber.Text = "Build No : " + ConfigurationManager.AppSettings[Build];
            // Display the Configuration
            UpdateMQConfigurationDisplay();

            if (MessageChannelController != null)
            {
                // Hook to InChannel MQ Connection Status
                var inMessageChannel =
                    MessageChannelController.GetChannel(_inChannelConfiguration, ChannelDirection.In);
                if (inMessageChannel?.ConnectionProvider != null)
                {
                    inMessageChannel.ConnectionProvider.ConnectionEventRaised += OnConnectionEventRaised;
                    inMessageChannel.MessageEventRaised += OnMessageEventRaised;
                }

                // Hook to OutChannel MQ Connection Status
                var outMessageChannel =
                    MessageChannelController.GetChannel(_outChannelConfiguration, ChannelDirection.Out);
                if (outMessageChannel?.ConnectionProvider != null)
                {
                    outMessageChannel.ConnectionProvider.ConnectionEventRaised += OnConnectionEventRaised;
                    outMessageChannel.MessageEventRaised += OnMessageEventRaised;
                }
            }

            StartMQController();
        }

        private void StartMQController()
        {
            // Invoke the start of the Message Channel Controller
            if (MessageChannelController == null) return;
            try
            {
                buttonStartMQController.Enabled = false;
                buttonStopMQController.Enabled = true;
                UpdateTextBoxAuditDisplay("Starting MQ Controller...");
                // Start the MQ Connection
                MessageChannelController.StartController();
            }
            catch (Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " Start MQ Controller Exception : " + ex);
            }
        }

        private void MQ_Dashboard_FormClosed(object sender, FormClosedEventArgs e)
        {
            // Invoke stop of the Message Channel Controller
            MessageChannelController?.StopController();
        }

        private void UpdateDBWithIDMSRequestMessage(RequestMessage requestMessage)
        {
            if (requestMessage != null)
            {
                switch (requestMessage.MessageBody?.AccessDetail?.RequestType)
                {
                    #region IDMS_CreateAccess
                    case Constants.IDMS_CreateAccess:
                        
                        if (requestMessage.MessageBody?.AccessDetail?.PersonData != null)
                        {
                            using (var unitofwork = new UnitOfWork(new SPOTS_OAEntities()))
                            {
                                var personData = requestMessage.MessageBody?.AccessDetail?.PersonData;

                                if(personData != null)
                                {
                                    // Check whether user already exist in SPOTS DB. If exist reject create request
                                    var dbData = unitofwork.UserRepository.SingleOrDefault(c => c.nric == personData.NRIC);

                                    if (dbData != null)
                                    {
                                        // Reject Create Acccess request since data exist
                                        AuditLogger.Debug(SourceAudit + " IDMS Create Access Request rejected as Person Data : " + personData.NRIC + " already exist.");
                                    }
                                    else
                                    {
                                        user createdUser = new user();
                                        createdUser.nric = personData?.NRIC;
                                        createdUser.ad_account = personData?.LoginID;
                                        createdUser.display_name = personData?.Name;
                                        createdUser.created_by = 0; // TODO to try for process account id if not default to zero
                                        createdUser.created_time = DateTime.Now;
                                        createdUser.email = personData?.EmailID;
                                        createdUser.rank = personData?.RankCode;
                                        createdUser.delete_flag = false;

                                        if (requestMessage.MessageBody?.AccessDetail?.OwnerDeployment != null)
                                        {
                                            var ownerDeployment = requestMessage.MessageBody?.AccessDetail?.OwnerDeployment;
                                            createdUser.department = ownerDeployment?.OwnerUnitLevel3Code;
                                        }

                                        // Create person data into DB
                                        unitofwork.UserRepository.Add(createdUser);
                                        unitofwork.Complete();

                                        AuditLogger.Debug(SourceAudit + " IDMS Create Access Request completed for Person Data : " + personData.NRIC + ". SPOTS DB updated.");
                                    }
                                }
                            }

                        }
                        else
                        {
                            AuditLogger.Debug(SourceAudit + " Invalid IDMS Create Access Data");
                        }                        

                        break;
                        #endregion
                }
            }

        }

        private void UpdateMQConfigurationDisplay()
        {
            try
            {
                var mqConnectionString = ConfigurationManager.AppSettings[Mqconfig];

                // Populate the MQ Connection information
                var mqConfigText = string.Empty;

                // Display the current DB catalog
                var dbConnection = ConfigurationManager.ConnectionStrings[Constants.DBConnectionName].ConnectionString;
                if (!string.IsNullOrEmpty(dbConnection))
                {
                    string[] connectionList = dbConnection.Split(';');
                    // Read the Catalog Info
                    mqConfigText = mqConnectionString + "\n" + connectionList[3];
                }

                labelMQConfig.Text = mqConfigText;
            }
            catch
            {
                labelMQConfig.Text = "MQ Configuration Not found !";
            }
        }

        private void ProcessPreLoadedMqServerMsgData(string payLoad)
        {
            try
            {
                // Deserialize the manually loaded XML string
                RequestMessage requestMessage = Utility.DeserializeMQIncomingMessageToRequestMessage(payLoad);

                if(requestMessage != null)
                {
                    AuditLogger.Debug(SourceAudit + " ProcessPreLoadedMqServerMsgData Requested Message serialized successfully");
                    labelDeSerializerDisplay.Text = "Success...";

                    if(Utility.UpdateDBWithIDMSRequestMessage(requestMessage))
                    {
                        AuditLogger.Debug(SourceAudit + " ProcessPreLoadedMqServerMsgData UpdateDBWithIDMSRequestMessage process completed successfully");
                    }
                    else
                    {
                        AuditLogger.Debug(SourceAudit + " ProcessPreLoadedMqServerMsgData UpdateDBWithIDMSRequestMessage process failed");
                    }
                }
                else
                {
                    AuditLogger.Debug(SourceAudit + " ProcessPreLoadedMqServerMsgData Requested Message serialization failed");
                    labelDeSerializerDisplay.Text = "Failed...";
                }

            }
            catch (Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " ProcessPreLoadedMqServerMsgData Exception : " + ex);
                labelDeSerializerDisplay.Text = "Failed with Exception...";

            }
        }

        private void ProcessIncomingMqServerMsgData(MessageRequest request)
        {

            string statusCode = SPOTS_MQ_Interface.Common.Constants.SUCCESSSTATUSCODE;
            RequestMessage requestMessage = new RequestMessage();

            try
            {

                // Print out the message properties
                if (request.PropertyNames != null)
                {
                    foreach (var keyPair in request.PropertyNames)
                    {
                        AuditLogger.Debug(SourceAudit + " MQ Property:" + keyPair.ToString() + "=" + request.GetProperty(keyPair.ToString()));
                    }
                }

                var incomingMessageSummary = "\nChannel ID : " + request.ChannelId
                                             + "\nService ID : " + request.ServiceId
                                             + "\nService TimeStamp : " + request.ServiceTimestamp
                                             + "\nStatus : " + request.Status
                                             + "\nPayload : " + request.Payload;

                AuditLogger.Debug(SourceAudit + ":Processing MQ Server Incoming Message " + incomingMessageSummary);

                // Deserialize the incoming XML message
                requestMessage = Utility.DeserializeMQIncomingMessageToRequestMessage(request.Payload.ToString());

                if(Utility.UpdateDBWithIDMSRequestMessage(requestMessage))
                {
                    UpdateTextBoxAuditDisplay("MQ Incoming Request Message processed successfully...");
                }
                else
                {
                    UpdateTextBoxAuditDisplay("MQ Incoming Request Message failed to process...");
                    statusCode = SPOTS_MQ_Interface.Common.Constants.UNSUCCESSFULSTATUSCODE;
                }
            }
            catch (Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " ProcessIncomingMqServerMsgData Exception : " + ex);
                statusCode = SPOTS_MQ_Interface.Common.Constants.UNSUCCESSFULSTATUSCODE;
            }
            finally
            {
                // Send the reply message as a receipt to MQ server
                if(requestMessage != null)
                {
                    if (!SendReplyMessage(requestMessage, statusCode, request))
                    {
                        AuditLogger.Debug(SourceAudit + " Failed in Sending out reply message");
                    }
                }
                else
                {
                    AuditLogger.Debug(SourceAudit + " Request Message cannot be deserialized");
                }
            }

        }

        private bool SendReplyMessage(RequestMessage requestMessage, string statusCode, MessageRequest request)
        {
            bool status = true;

            try
            {
                if(requestMessage != null)
                {
                    // Create a reply message
                    ReplyMessage replyMessage = new ReplyMessage();
                    // Message Header
                    replyMessage.MessageHeader = new MessageHeader();
                    replyMessage.MessageHeader.MsgRefId = requestMessage.MessageHeader.MsgRefId;
                    replyMessage.MessageHeader.TimeStampCreated = requestMessage.MessageHeader.TimeStampCreated;
                    replyMessage.MessageHeader.MsgType = requestMessage.MessageHeader.MsgType;
                    replyMessage.MessageHeader.SourceSysID = requestMessage.MessageHeader.SourceSysID;
                    replyMessage.MessageHeader.AgencyID = requestMessage.MessageHeader.AgencyID;
                    // Request Info
                    replyMessage.MessageHeader.RequestInfo = new RequestInfo();
                    replyMessage.MessageHeader.RequestInfo.RequestTimeout = requestMessage.MessageHeader.RequestInfo.RequestTimeout;
                    // DeSysID
                    replyMessage.MessageHeader.DestSysID = requestMessage.MessageHeader.DestSysID;
                    // Status Info
                    replyMessage.MessageHeader.StatusInfo = new StatusInfo();
                    replyMessage.MessageHeader.StatusInfo.StatusCode = statusCode;
                    // TO DO : To find out the defined list of error codes if status Code is 1
                    replyMessage.MessageHeader.StatusInfo.ErrorCode = string.Empty;
                    replyMessage.MessageHeader.StatusInfo.ErrorMessage = string.Empty;
                    replyMessage.MessageHeader.StatusInfo.TimestampReceived = DateTime.Now.ToString(TimeStampReceivedFormat);

                    // Message Body
                    replyMessage.MessageBody = new MessageBody();
                    replyMessage.MessageBody.AccessDetailsResponse = new AccessDetailsResponse();
                    replyMessage.MessageBody.ServiceId = requestMessage.MessageBody.ServiceId;
                    replyMessage.MessageBody.AccessDetailsResponse.TransactionID = requestMessage.MessageBody.AccessDetail.TransactionID;
                    replyMessage.MessageBody.AccessDetailsResponse.ReplyCode = statusCode;
                    replyMessage.MessageBody.AccessDetailsResponse.ErrorCode = string.Empty;
                    replyMessage.MessageBody.AccessDetailsResponse.ErrorMessage = string.Empty;
                    replyMessage.MessageBody.AccessDetailsResponse.TimestampReceived = DateTime.Now.ToString(TimeStampReceivedFormat);

                    // Serialize the Message
                    string serializedXMLstring = Utility.SerializeReplyMessageToXMLString(replyMessage);
                    AuditLogger.Debug(SourceAudit + " Serialized Reply XML string : " + serializedXMLstring);

                    if (!string.IsNullOrEmpty(serializedXMLstring))
                    {
                        // Send Reply Message to MQ
                        SendMessage(serializedXMLstring, request);
                    }
                    else
                    {
                        status = false;
                        AuditLogger.Debug(SourceAudit + " Null Serialized XML string. Not able to send Reply Message");
                    }                 
                }
                else
                {
                    status = false;
                    AuditLogger.Debug(SourceAudit + " Request Message null. Serialized XML string operation aborted.");
                }
            }
            catch(Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " " + ex.ToString());
                status = false;
            }

            return status;
        }

        private void UpdateMqConnectionStatus(ConnectionEvent connectionEvent)
        {
            _mqConnectionStatus = connectionEvent;
        }

        /// <summary>
        /// Connection event trigger.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnConnectionEventRaised(object sender, MqConnectionEventArgs e)
        {
            if (e == null) return;
            switch (e.ConnEventType)
            {
                case ConnectionEvent.Connecting:
                    UpdateTextBoxAuditDisplay("Connecting to MQ..");
                    UpdateSendComponents(false);
                    break;
                case ConnectionEvent.Started:
                    UpdateTextBoxAuditDisplay("MQ Connection Started..");
                    UpdateSendComponents(true);
                    break;
                case ConnectionEvent.Broken:
                    UpdateTextBoxAuditDisplay("MQ Connection Broken..");
                    UpdateSendComponents(false);
                    break;
                case ConnectionEvent.Reset:
                    UpdateTextBoxAuditDisplay("MQ Connection Resetted");
                    UpdateSendComponents(false);
                    break;
                case ConnectionEvent.Stopped:
                    UpdateTextBoxAuditDisplay("MQ Connection Stopped..");
                    UpdateSendComponents(false);
                    break;
            }

            // Update the local MQ Connection Event Status
            UpdateMqConnectionStatus(e.ConnEventType);
        }

        /// <summary>
        /// Connection event trigger.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnMessageEventRaised(object sender, MessageEventArgs e)
        {
            if (e == null) return;
            switch (e.MessageEventType)
            {
                case MessageEvent.Received:
                    UpdateChannelMessageEventDisplay("In-Message Received from Channel : " + e.Request.ChannelId);
                    ProcessIncomingMqServerMsgData(e.Request);
                    break;
                case MessageEvent.Sent:
                    UpdateChannelMessageEventDisplay("Out-Message Sent to Channel : " + e.Request.ChannelId);
                    break;
                default:
                    UpdateChannelMessageEventDisplay("Unknown Message Event");
                    break;
            }
        }

        private void UpdateChannelMessageEventDisplay(string msg)
        {
            if (string.IsNullOrEmpty(msg))
                return;

            Invoke(new MethodInvoker(delegate
            {
                // Flush the display once it reaches the text length
                if (textBoxChannelMessageEvent.Text.Length > 3000)
                {
                    textBoxChannelMessageEvent.Clear();
                }
                textBoxChannelMessageEvent.AppendText(DateTime.Now.ToLongTimeString() + ": " + msg + "\r\n");
            }));
        }

        private void UpdateTextBoxAuditDisplay(string msg)
        {
            if (string.IsNullOrEmpty(msg))
                return;

            Invoke(new MethodInvoker(delegate
            {
                // Flush the display once it reaches the text length
                if (textBoxAuditDisplay.Text.Length > 3000)
                {
                    textBoxAuditDisplay.Clear();
                }
                textBoxAuditDisplay.AppendText(DateTime.Now.ToLongTimeString() + ": " + msg + "\r\n");
            }));
        }

        private void buttonSend_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(textBoxSendMessage.Text))
            {
                UpdateTextBoxAuditDisplay("Cannot Send Null Message to MQ !");
                return;
            }

            SendMessage(textBoxSendMessage.Text);
        }

        private void SendMessage(string message,MessageRequest request)
        {
            if (MessageChannelController == null) return;

            IDictionary<string, string> messageProperties = new Dictionary<string, string>();
            // Remap MQMD message from Request to Reply
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILID] = SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILID_REPLY;
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_REQUESTNUMBER] = request.GetProperty(SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_REQUESTNUMBER);
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILNUMBER] = request.GetProperty(SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILNUMBER);
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_SUBJECTID] = request.GetProperty(SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_SUBJECTID);
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DATALENGTH] = request.GetProperty(SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DATALENGTH);
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DESTSYSID] = request.GetProperty(SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DESTSYSID);

            AuditLogger.Debug(SourceAudit + " Preparing to Send Reply Message to ");

            // Construct the message request
            var sendMessageRequest = new MessageRequest(_outChannelConfiguration, message, messageProperties);

            // Send the message request
            MessageChannelController.Send(sendMessageRequest);

            PrintMessageProperties(messageProperties);
            AuditLogger.Debug(SourceAudit + " SendMessage XML: " + message.ToString());
        }

        private void SendMessage(string message)
        {
            if (MessageChannelController == null) return;
            // Construct the message request
            IDictionary<string, string> messageProperties = new Dictionary<string, string>();
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILID] = "MAILID_XXXX";
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_REQUESTNUMBER] = "REQUESTNUMBER_XXXX";
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_MAILNUMBER] = "MAILNUMBER_XXXX";
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_SUBJECTID] = "SUBJECTID_XXXX";
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DATALENGTH] = "DATALENGTH_XXXX";
            messageProperties[SPOTS_MQ_Interface.Common.Constants.MQ_MSGPROPERTY_DESTSYSID] = "DESTSYSID_XXXX";

            PrintMessageProperties(messageProperties);
            AuditLogger.Debug(SourceAudit + " SendMessage XML: " + message.ToString());

            // Construct the message request
            var request = new MessageRequest(_outChannelConfiguration, message, messageProperties);

            // Send the message request
            MessageChannelController.Send(request);
        }

        private void UpdateSendComponents(bool enabled)
        {
            Invoke(new MethodInvoker(delegate
            {
                buttonSend.Enabled = enabled;
                textBoxSendMessage.Enabled = enabled;
            }));
        }

        private void buttonStartMQController_Click(object sender, EventArgs e)
        {
            StartMQController();
            /*
            // Invoke the start of the Message Channel Controller
            if (MessageChannelController == null) return;
            try
            {
                buttonStartMQController.Enabled = false;
                buttonStopMQController.Enabled = true;
                UpdateTextBoxAuditDisplay("Starting MQ Controller...");
                // Start the MQ Connection
                MessageChannelController.StartController();
            }
            catch (Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " Start MQ Controller Exception : " + ex);
            }
            */
        }

        private void buttonStopMQController_Click(object sender, EventArgs e)
        {
            // Invoke the stopping of the Message Channel Controller
            if (MessageChannelController == null) return;
            try
            {
                buttonStopMQController.Enabled = false;
                buttonStartMQController.Enabled = true;
                UpdateTextBoxAuditDisplay("Stopping MQ Controller...");
                // Stop the MQ Connection
                MessageChannelController.StopController();
            }
            catch (Exception ex)
            {
                AuditLogger.Debug(SourceAudit + " Stop MQ Controller Exception : " + ex);
            }
        }

        private void MqDashboard_Resize(object sender, EventArgs e)
        {
            //if the form is minimized  
            //hide it from the task bar  
            //and show the system tray icon (represented by the NotifyIcon control)  
            if (this.WindowState == FormWindowState.Minimized)
            {
                Hide();
                notifyIconSPOTSMQ.Visible = true;
            }
        }

        private void notifyIconSPOTSMQ_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            // Show the form is it minimized
            Show();
            this.WindowState = FormWindowState.Normal;
            notifyIconSPOTSMQ.Visible = false;
        }

        private void PrintMessageProperties(IDictionary<string, string> messageProperties)
        {
            // Print out the message properties
            foreach (var keyPair in messageProperties)
            {
               AuditLogger.Debug(SourceAudit + " MQ Message Property:" + keyPair.ToString());
            }
        }

        private void buttonDeserialize_Click(object sender, EventArgs e)
        {
            if(!string.IsNullOrEmpty(textBoxInputXML.Text))
            {
                ProcessPreLoadedMqServerMsgData(textBoxInputXML.Text);
            }

        }

        private void checkBoxEnableDeSerializerTest_CheckedChanged(object sender, EventArgs e)
        {
            if(checkBoxEnableDeSerializerTest.Checked)
            {
                textBoxInputXML.Enabled = true;
                buttonDeserialize.Enabled = true;
            }
            else
            {
                textBoxInputXML.Enabled = false;
                buttonDeserialize.Enabled = false;
            }
        }
    }
}