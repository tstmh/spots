using System;
using System.Collections.Generic;
namespace SPOTSAdminModule.Utility

{
    public static class SpotsConstant
    {

        public static readonly string TIMS_COUNTRY_CODE = "1";
        public static readonly string TIMS_LOCATION_CODE = "2";
        public static readonly string TIMS_NATIONALITY_CODE = "3";
        public static readonly string TIMS_OFFENCE_CODE = "4";
        public static readonly string TIMS_VEHICLE_MAKE = "5";
        public static readonly string TIMS_VEHICLE_TYPE = "6";
        public static readonly string TIMS_VEHICLE_COLOR = "7";


        public static readonly string SEARCH_SPOTS = "Search_SPOTS";
        public static readonly string SEARCH_TIMS = "Search_TIMS";
        public static readonly string SEARCH_SPOTS_TabIndex = "0";
        public static readonly string SEARCH_TIMS_TabIndex = "1";

        public static readonly string PdfOSIHeaderFooterFormat = "--header-left \"NP149E (SPOTS)\" " +
                                                                 "--header-font-size \"9\" --header-spacing 5 --header-font-name \"calibri light\" " +
                                                                 "--footer-left \"NP149E (SPOTS)\" " +
                                                                 "--footer-right \"" + DateTime.Now.Date.ToString("dd/MM/yyyy") + " [time]\" " +
                                                                 "--footer-center \"Incident No: {0} (Page [page] of [toPage])\" --footer-line --footer-font-size \"9\" --footer-spacing 5 --footer-font-name \"calibri light\"";

        public static readonly string PdfOSIImagesHeaderFooterFormat = "--header-left \"SPOTS\" " +
                                                                 "--header-font-size \"9\" --header-spacing 5 --header-font-name \"calibri light\" " +
                                                                 "--footer-left \"SPOTS\" " +
                                                                 "--footer-right \"" + DateTime.Now.Date.ToString("dd/MM/yyyy") + " [time]\" " +
                                                                 "--footer-center \"Incident No: {0} (Page [page] of [toPage])\" --footer-line --footer-font-size \"9\" --footer-spacing 5 --footer-font-name \"calibri light\"";


        public static readonly string PdfFooterFormat = "--footer-left \"SINGAPORE POLICE ON-THE-SPOT TICKETING SYSTEM (SPOTS)\" " +
                                                        "--footer-right \"" + DateTime.Now.Date.ToString("dd/MM/yyyy") + " [time]\" " +
                                                        "--footer-center \"Page: [page] of [toPage]\" --footer-line --footer-font-size \"9\" --footer-spacing 5 --footer-font-name \"calibri light\"";

        public static readonly string ListAccidentReportPdfFileName = "ListOn-SceneInvestigationReport.pdf";
        public static readonly string AccidentReportStatisticsPdfFileName = "AccidentReportStatisticsPdf.pdf";
        public static readonly string SummonsStatisticsPdfFileName = "SummonsStatisticsPdf.pdf";
        public static readonly string SummonsStatisticsUsersPdfFileName = "SummonsStatisticsUsersPdf.pdf";
        public static readonly string SummonsPdfFileName = "SummonsPdf.pdf";
        public static readonly string SummonsReconciliationPdfFileName = "SummonsReconciliationPdf.pdf";
        public static readonly string OnSceneInvestigationReportPdfFileName = "OnSceneInvestigationReportFirstPOForm.pdf";

        #region IncidentOccurred

        public const string IncidentOccurredIndex1 = "1";
        public const string IncidentOccurredIndex2 = "2";
        public const string IncidentOccurredIndex3 = "3";
        public const string IncidentOccurredIndex4 = "4";

        public static readonly string IncidentOccurred1 = "Along {0}";
        public static readonly string IncidentOccurred2 = "Junction of {0} and {1}";
        public static readonly string IncidentOccurred3 = "{0} Slip onto {1}";
        public static readonly string IncidentOccurred4 = "Along {0} Travelling Towards {1}";

        #endregion

        // Access Rights List for Mobile App
        public const string CAN_CREATE_M401_MOBILE = "CanCreatem401";
        public const string CAN_CREATE_M401E_MOBILE = "CanCreatem401E";
        public const string CAN_CREATE_ACCIDENT_REPORT_MOBILE = "CanCreateAccReport";
        public const string CAN_EDIT_M401_MOBILE = "CanEditm401/m401E";
        public const string CAN_VIEW_SUMMONS_MOBILE = "CanViewm401/m401E";

        // Access Rights List for Admin Module Portal
        public const string CAN_EDIT_ACCIDENT_REPORT_MOBILE = "CanEditAccReport";
        public const string CAN_VIEW_USER_ACCOUNT = "CanViewUserAccount";
        public const string CAN_ADD_USER_ACCOUNT = "CanAddUserAccount";
        public const string CAN_EDIT_USER_ACCOUNT = "CanEditUserAccount";
        public const string CAN_DELETE_USER_ACCOUNT = "CanDeleteUserAccount";
        public const string CAN_VIEW_USER_GROUP = "CanViewUserGroup";
        public const string CAN_ADD_USER_GROUP = "CanAddUserGroup";
        public const string CAN_EDIT_USER_GROUP = "CanEditUserGroup";
        public const string CAN_DELETE_USER_GROUP = "CanDeleteUserGroup";
        public const string CAN_VIEW_SYSTEM_CODE = "CanViewReferenceCode";
        public const string CAN_ADD_SYSTEM_CODE = "CanAddReferenceCode";
        public const string CAN_EDIT_SYSTEM_CODE = "CanEditReferenceCode";
        public const string CAN_DELETE_SYSTEM_CODE = "CanDeleteReferenceCode";
        public const string CAN_VIEW_TRANSACTION_LOG = "CanViewTransLog";
        public const string CAN_VIEW_LOGIN_LOG = "CanViewLoginLog";
        public const string CAN_VIEW_SUMMONS = "CanViewm401";
        public const string CAN_PRINT_SUMMONS = "CanPrintm401";
        public const string CAN_VIEW_SUMMONS_ECHO = "CanViewm401E";
        public const string CAN_PRINT_SUMMONS_ECHO = "CanPrintm401E";
        public const string CAN_VIEW_ACCIDENT_REPORT = "CanViewAccReport";
        public const string CAN_PRINT_ACCIDENT_REPORT = "CanPrintAccReport";
        public const string CAN_VIEW_REPORT = "CanViewReport";
        public const string CAN_PRINT_REPORT = "CanPrintReport";

        public const string CAN_VIEW_ALL_SUMMONS = "CanViewAllm401";
        public const string CAN_PRINT_ALL_SUMMONS = "CanPrintAllm401";
        public const string CAN_VIEW_ALL_SUMMONS_ECHO = "CanViewAllm401E";
        public const string CAN_PRINT_ALL_SUMMONS_ECHO = "CanPrintAllm401E";
        public const string CAN_VIEW_ALL_ACCIDENT_REPORT = "CanViewAllAccReport";
        public const string CAN_PRINT_ALL_ACCIDENT_REPORT = "CanPrintAllAccReport";

        public const string URL_SYSTEM_CODE = "/CodeMaintenance/Index";
        public const string URL_TRANSACTION_LOGS = "/Logs/GetTransactionLogs";
        public const string URL_LOGIN_LOGS = "/Logs/GetUserLoginsLogs";
        public const string URL_USER_ADMIN = "/UserAdmin/GetUserList";
        public const string URL_GROUP_ADMIN = "/UserAdmin/GetGroupList";
        public const string URL_ENQUIRY_SUMMONS = "/Enquiry/SummonsEnquiry";
        public const string URL_ENQUIRY_SUMMONS_ECHO = "/Enquiry/SummonsEchoEnquiry";
        public const string URL_ENQUIRY_OSI = "/Enquiry/OnSceneInvestigationReportsEnquiry";
        public const string URL_REPORT = "/Report/";

        public const string MENU_SYSTEM_ADMIN = "System Admin";
        public const string MENU_USER_ADMIN = "User Admin";
        public const string MENU_ENQUIRY = "Enquiry";
        public const string MENU_REPORT = "Report";

        // Type of Offender
        public const string PedalCyclistType = "11";
        public const string PedestrianType = "12";
        public const string VehicleOwnerType = "21";
        public const string DriverMotoristType = "22";
        public const string OthersType = "23";
        public const string FrontPassengerType = "31";
        public const string RearPassengerType = "32";
        public const string PassengerType = "33";

        public const int SPEED_DEVICE_USED = 14;

        public static readonly string PedalCyclist = "Pedal Cyclist";
        public static readonly string Pedestrian = "Pedestrian";
        public static readonly string VehicleOwner = "Vehicle Owner";
        public static readonly string DriverMotorist = "Driver/Motorcylist";
        public static readonly string Others = "Others";
        public static readonly string FrontPassenger = "FrontPassenger";
        public static readonly string RearPassenger = "RearPassenger";
        public static readonly string Passenger = "Passenger";

        public static readonly string ADEnvironment = "ADEnvironment";
        public static readonly string ADServer = "ADServer";
        //public static readonly string ADSITUser = "ADSITUser";
        //public static readonly string ADSITKey = "ADSITKey";
        public static readonly string ADAdminUser = "ADAdminUser";
        public static readonly string ADAdminKey = "ADAdminKey";
        public static readonly string ADDomain = "ADDomain";
        public static readonly string ADUserDomain = "ADUserDomain";
        //public static readonly string SIT = "SIT";
        public static readonly string LOCAL = "LOCAL";
        //public static readonly string UATFixedADUser = "UATFixedADUser";

        // User Action Logging constants
        public static readonly short AdminPortalType = 2;
        public static readonly string AdminPortalLoginDesc = "Login";
        public static readonly string AdminPortalLogoutDesc = "Logout";

        public static bool canViewAllSummons(string _userRoles)
        {
            return _userRoles.Contains(CAN_VIEW_ALL_SUMMONS);
        }
        public static bool canViewAllSummonsEcho(string _userRoles)
        {
            return _userRoles.Contains(CAN_VIEW_ALL_SUMMONS_ECHO);
        }

        public static bool canViewAllOSI(string _userRoles)
        {
            return _userRoles.Contains(CAN_VIEW_ALL_ACCIDENT_REPORT);
        }
        private static List<string> CurrentUsers = new List<string>();
        public static bool ConcurrentUserTracker(string Id)
        {
            if (CurrentUsers.Contains(Id)) { return true; }
            else
            {
                return false;

            }

        }
        public static void LogCurrentUser(string Id)
        {
            CurrentUsers.Add(Id);

        }
        public static void RemoveCurrentUser(string Id)
        {
            CurrentUsers.Remove(Id);
        }

    }
}