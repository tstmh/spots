using System;
using System.Web.Mvc;
using System.Collections.Generic;
using SPOTSAdminModule.ViewModels;
using SPOTSAdminModule.Utility;
using SPOTS_Repository.Models;
using SPOTS_Repository.Services;
using Rotativa;
using Rotativa.Options;
using System.Web.Security;
using System.Linq;
using SPOTS_AuditLogging;
using System.Configuration;
using AddressAccessFiltering;

namespace SPOTSAdminModule.Controllers
{
    public class EnquiryController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "EnquiryController";

        public EnquiryController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitOfWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        public ActionResult Index()
        {
            return View();
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS)]
        public ActionResult SummonsEnquiry()
        {
            var userAction = "Viewed Summons Enquiry";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var viewModel = new SummonsEnquiryViewModel();
            return View(viewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS)]
        [HttpPost]
        public ActionResult SummonsEnquiry(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Summons M401:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401 records                                
                bool result = SpotsConstant.canViewAllSummons(Session["UserRoles"].ToString());

                if (result)
                {
                    searchModel.SearchOwnRecords = "";
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name;
                }                
                
                // Date To 235959
                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }

                searchModel.SearchParametersTrim();

                var summonsList = _unitOfWork.SummonsRepository.GetSummons(searchModel);

                foreach (var summons in summonsList)
                {
                    summons.Location = _generalUtilityHelper.FormatIncidentLocation(summons.Summon.incident_occured, summons.TimsLocation1, summons.TimsLocation2);
                    summons.OffenderType = _generalUtilityHelper.ConvertOffenderTypeIntoString(summons.OffenderType);
                }
                
                var viewModel = new SummonsEnquiryViewModel {EnquirySummonsList = summonsList};
                return PartialView("Tables/_TableEnquirySummonsM401Partial", viewModel);
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "SummonsEnquiry"));
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS_ECHO)]
        public ActionResult SummonsEchoEnquiry()
        {
            var userAction = "Viewed Summons Echo Enquiry";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var viewModel = new SummonsEchoEnquiryViewModel();
            return View(viewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS_ECHO)]
        [HttpPost]
        public ActionResult SummonsEchoEnquiry(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Summons M401E:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401E records                
                bool result = SpotsConstant.canViewAllSummonsEcho(Session["UserRoles"].ToString());
                                
                if (result)
                {
                    searchModel.SearchOwnRecords = "";
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name;
                }

                if (searchModel.SearchToDate!=null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }

                searchModel.SearchParametersTrim();

                var summonsEchoList = _unitOfWork.SummonsRepository.GetSummonsEcho(searchModel);

                foreach (var summonsEcho in summonsEchoList)
                {
                    summonsEcho.Location = _generalUtilityHelper.FormatIncidentLocation(summonsEcho.Summon.incident_occured, summonsEcho.TimsLocation1, summonsEcho.TimsLocation2);
                }

                var viewModel = new SummonsEchoEnquiryViewModel { EnquirySummonsEchoList = summonsEchoList };
                return PartialView("Tables/_TableEnquirySummonsEchoPartial", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "SummonsEchoEnquiry"));
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_ACCIDENT_REPORT)]
        public ActionResult OnSceneInvestigationReportsEnquiry()
        {
            var userAction = "Viewed On-Scene Investigation Reports Enquiry";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
            return View();
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_ACCIDENT_REPORT)]
        [HttpPost]
        public ActionResult OnSceneInvestigationReportsEnquiry(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search On-Scene Investigation Reports Enquiry:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all OSI records                                
                bool result = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());

                if (result)
                {
                    searchModel.SearchOwnRecords = string.Empty;
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name; ;
                }
                // Date To 235959
                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }

                searchModel.SearchParametersTrim();

                var accidentReportsList = _unitOfWork.AccidentReportRepository.GetAccidentReportsList(searchModel);
                var viewModel = new OnSceneInvestigationReportsEnquiryViewModel { AccidentReportsList = accidentReportsList };
                return PartialView("Tables/_TableOnSceneInvestigationReportsEnquiryResultView", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "OnSceneInvestigationReportsEnquiry"));
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_ACCIDENT_REPORT)]
        public ActionResult RetrieveOnSceneInvestigationReport(string incidentNo)
        {
            try
            {

                var userAction = "Retrieve On-Scene Investigation Report: " + incidentNo;
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401E records                                
                bool _canViewAll = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());
                var queryString = "";
                if (_canViewAll)
                {
                    queryString = incidentNo;
                }
                else
                {
                    queryString = incidentNo + "|" + User.Identity.Name;
                }

                var viewModel = GetAccidentReportViewModel(queryString, _canViewAll);
                // Set to show the print button
                viewModel.IsShowPrintButton = true;
                // Show both First PO Form and Images
                viewModel.IsShowOSIFirstPOForm = true;
                viewModel.IsShowOSIImages = true;

                return PartialView("PdfTemplates/ListAccidentReportFirstPOFormPdf", viewModel);                
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "RetrieveOnSceneInvestigationReport"));
            }
        }

        // Retrieving only 1 SummonsM401 vehicle record
        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS)]
        public ActionResult RetrieveSummonsM401Vehicle(string summons)
        {
            try
            {
                var userAction = "Retrieve Summons M401 Vehicle: " + summons;
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401E records                                
                bool result = SpotsConstant.canViewAllSummons(Session["UserRoles"].ToString());
                var queryString = "";
                if (result)
                {
                    queryString = summons;
                }
                else
                {
                    queryString = summons + "|" + System.Web.HttpContext.Current.User.Identity.Name;
                }

                var summonsM401 = _unitOfWork.SummonsRepository.RetrieveSummonsM401VehicleForHyperLinkView(queryString);
                summonsM401.Location = _generalUtilityHelper.FormatIncidentLocation(summonsM401.Summon.incident_occured, summonsM401.TimsLocation1, summonsM401.TimsLocation2);
                summonsM401.OffenderType = _generalUtilityHelper.ConvertOffenderTypeIntoString(summonsM401.OffenderType);            

                var viewModel = new SummonsM401EnquiryHyperLinkViewModel
                {
                    RetrievedSummonsM401 = summonsM401
                };
                viewModel.IsShowPrintButton = true;
                if (viewModel.RetrievedSummonsM401.SpeedingOffence!=null && viewModel.RetrievedSummonsM401.SpeedingOffence.speed_device_id > 0)
                { 
                    viewModel.RetrievedSummonsM401.speedDeviceUsed = _unitOfWork.SystemCodeRepository.GetSystemCode(Utility.SpotsConstant.SPEED_DEVICE_USED, (int) viewModel.RetrievedSummonsM401.SpeedingOffence.speed_device_id ).description;
                }
                if (viewModel.RetrievedSummonsM401.Offence!= null)
                {
                    if (viewModel.RetrievedSummonsM401.Offence.operation_type != null)
                    {
                        viewModel.RetrievedSummonsM401.OperationType = _unitOfWork.SystemCodeRepository.GetSystemCode(32, Int16.Parse(viewModel.RetrievedSummonsM401.Offence.operation_type)).value;
                    }
                }
                Session["SummonsHyperLink"] = viewModel;
                return PartialView("PdfTemplates/SummonsEnquiryPdfNoPrintButton", viewModel);
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "RetrieveSummonsM401Vehicle"));
            }
        }

        // Retrieving only 1 SummonsM401 pedestrian record
        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS)]
        public ActionResult RetrieveSummonsM401Pedestrian(string summons)
        {
            try
            {
                var userAction = "Retrieve Summons M401 Pedestrian: " + summons;
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401E records                                
                bool result = SpotsConstant.canViewAllSummons(Session["UserRoles"].ToString());
                var queryString = "";
                if (result)
                {
                    queryString = summons;
                }
                else
                {
                    queryString = summons + "|" + System.Web.HttpContext.Current.User.Identity.Name;
                }

                var summonsM401 = _unitOfWork.SummonsRepository.RetrieveSummonsM401PedestrianForHyperLinkView(queryString);
                summonsM401.Location = _generalUtilityHelper.FormatIncidentLocation(summonsM401.Summon.incident_occured, summonsM401.TimsLocation1, summonsM401.TimsLocation2);
                summonsM401.OffenderType = _generalUtilityHelper.ConvertOffenderTypeIntoString(summonsM401.OffenderType);

                var viewModel = new SummonsM401EnquiryHyperLinkViewModel
                {
                    RetrievedSummonsM401 = summonsM401
                };
                // Set to show the print button
                viewModel.IsShowPrintButton = true;
                Session["SummonsHyperLink"] = viewModel;
                return PartialView("PdfTemplates/SummonsEnquiryPedestrianPdfNoPrintButton", viewModel);
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "RetrieveSummonsM401Pedestrian"));
            }
        }

        // Retrieving only 1 SummonsEcho record with details to display
        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SUMMONS_ECHO)]
        public ActionResult RetrieveSummonsEcho(string summons)
        {
            try
            {
                var userAction = "Retrieve Summons Echo: " + summons;
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401E records                                
                bool result = SpotsConstant.canViewAllSummonsEcho(Session["UserRoles"].ToString());
                var queryString = "";               
                if (result)
                {
                    queryString = summons;
                }
                else
                {
                    queryString = summons+ "|" + System.Web.HttpContext.Current.User.Identity.Name;
                }

                var summonsEcho = _unitOfWork.SummonsRepository.RetrieveSummonsEchoForHyperLinkView(queryString);
                summonsEcho.Location = _generalUtilityHelper.FormatIncidentLocation(summonsEcho.Summon.incident_occured, summonsEcho.TimsLocation1, summonsEcho.TimsLocation2);
                var viewModel = new SummonsEchoEnquiryHyperLinkViewModel
                {
                    RetrievedSummonsEcho = summonsEcho
                };
                // Set to show the print button
                viewModel.IsShowPrintButton = true;
                if (viewModel.RetrievedSummonsEcho.SpeedingOffences != null && viewModel.RetrievedSummonsEcho.SpeedingOffences.speed_device_id > 0)
                {
                    viewModel.RetrievedSummonsEcho.speedDeviceUsed = _unitOfWork.SystemCodeRepository.GetSystemCode(Utility.SpotsConstant.SPEED_DEVICE_USED, (int)viewModel.RetrievedSummonsEcho.SpeedingOffences.speed_device_id).description;
                }
                if (viewModel.RetrievedSummonsEcho.Offences.operation_type != null)
                {
                    viewModel.RetrievedSummonsEcho.OperationType= _unitOfWork.SystemCodeRepository.GetSystemCode(32, Int16.Parse(viewModel.RetrievedSummonsEcho.Offences.operation_type)).value;
                }

                Session["SummonsEchoHyperLink"] = viewModel;
                return PartialView("PdfTemplates/SummonsEchoEnquiryPdfNoPrintButton", viewModel);
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Enquiry", "RetrieveSummonsEcho"));
            }
        }

        private Dictionary<string, string> GetCookieCollection()
        {
            //build cookie dict here
            Dictionary<string, string> cookieCollection = new Dictionary<string, string>();

            foreach (var key in Request.Cookies.AllKeys)
            {
                if (key == FormsAuthentication.FormsCookieName)
                {
                    cookieCollection.Add(key, Request.Cookies.Get(key).Value);
                }
            }
            return cookieCollection;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_SUMMONS)]
        public ActionResult PrintSummonsM401VehicleHyperLinkToPdf(SummonsM401EnquiryHyperLinkViewModel viewModel)
        {
            var vm = Session["SummonsHyperLink"] as SummonsM401EnquiryHyperLinkViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            return new ViewAsPdf("PdfTemplates/SummonsEnquiryPdfNoPrintButton", vm)
            {
                FileName = vm.RetrievedSummonsM401.Summon.spots_id + ".pdf",
                CustomSwitches = SpotsConstant.PdfFooterFormat,
                PageOrientation = Orientation.Portrait,                
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_SUMMONS)]
        public ActionResult PrintSummonsM401PedestrianHyperLinkToPdf()
        {
            var vm = Session["SummonsHyperLink"] as SummonsM401EnquiryHyperLinkViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            return new ViewAsPdf("PdfTemplates/SummonsEnquiryPedestrianPdfNoPrintButton", vm)
            {
                FileName = vm.RetrievedSummonsM401.Summon.spots_id + ".pdf",
                CustomSwitches = SpotsConstant.PdfFooterFormat,
                PageOrientation = Orientation.Portrait,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_SUMMONS_ECHO)]
        public ActionResult PrintSummonsM401EHyperLinkToPdf()
        {
            var vm = Session["SummonsEchoHyperLink"] as SummonsEchoEnquiryHyperLinkViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            return new ViewAsPdf("PdfTemplates/SummonsEchoEnquiryPdfNoPrintButton", vm)
            {
                FileName = vm.RetrievedSummonsEcho.Summon.spots_id + ".pdf",
                CustomSwitches = SpotsConstant.PdfFooterFormat,
                PageOrientation = Orientation.Portrait,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_ACCIDENT_REPORT)]
        public ActionResult PrintOnSceneInvestigationReportToPdf(string incidentNo)
        {
            var userAction = "Print On Scene Investigation Report To Pdf: " + incidentNo;
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var vm = Session["AccidentReport"] as ListAccidentReportViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            return new ViewAsPdf("PdfTemplates/ListAccidentReportFirstPOFormPdf", vm)
            {
                FileName = vm.IncidentReportNumber + ".pdf",
                CustomSwitches = string.Format(SpotsConstant.PdfOSIHeaderFooterFormat, vm.IncidentReportNumber),
                PageOrientation = Orientation.Portrait,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };

        }

        [AuthorizeIPAddress]
        public ActionResult PrintOSIToPdfForCrimes3(string incidentNo)
        {
            string strADAdminUser = ConfigurationManager.AppSettings[SpotsConstant.ADAdminUser];

            var userAction = "Print On Scene Investigation Report To Pdf for CRIMES3 : " + incidentNo;
            _auditService.LogAudit(SourceAudit, strADAdminUser + ":" + userAction);
            _auditService.LogUserActionToDB( strADAdminUser, SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var viewModel = GetAccidentReportViewModel(incidentNo, true); // true -> no restriction, can view

            var vm = Session["AccidentReport"] as ListAccidentReportViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            // Show First PO Form but Hide the Images
            vm.IsShowOSIFirstPOForm = true;
            vm.IsShowOSIImages = false;
            return new ViewAsPdf("PdfTemplates/ListAccidentReportFirstPOFormPdf", vm)
            {
                FileName = vm.IncidentReportNumber + ".pdf",
                CustomSwitches = string.Format(SpotsConstant.PdfOSIHeaderFooterFormat, vm.IncidentReportNumber),
                PageOrientation = Orientation.Portrait,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };

        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_ACCIDENT_REPORT)]
        public ActionResult PrintOnSceneInvestigationReportOnlyToPdf(string incidentNo)
        {
            var userAction = "Print On Scene Investigation Report To Pdf: " + incidentNo;
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var vm = Session["AccidentReport"] as ListAccidentReportViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            // Show First PO Form but Hide the Images
            vm.IsShowOSIFirstPOForm = true;
            vm.IsShowOSIImages = false;

            return new ViewAsPdf("PdfTemplates/ListAccidentReportFirstPOFormPdf", vm)
            {
                FileName = vm.IncidentReportNumber + ".pdf",
                CustomSwitches = string.Format(SpotsConstant.PdfOSIHeaderFooterFormat, vm.IncidentReportNumber),                
                PageOrientation = Orientation.Portrait,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };

        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_PRINT_ACCIDENT_REPORT)]
        public ActionResult PrintOnSceneInvestigationReportImagesToPdf(string incidentNo)
        {
            var userAction = "Print On Scene Investigation Report To Pdf: " + incidentNo;
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var vm = Session["AccidentReport"] as ListAccidentReportViewModel;
            // Set to hide the print button
            vm.IsShowPrintButton = false;
            // Hide First PO Form but Show the Images
            vm.IsShowOSIFirstPOForm = false;
            vm.IsShowOSIImages = true;

            return new ViewAsPdf("PdfTemplates/ListAccidentReportFirstPOFormPdf", vm)
            {
                FileName = vm.IncidentReportNumber + "_images.pdf",
                CustomSwitches = string.Format(SpotsConstant.PdfOSIImagesHeaderFooterFormat, vm.IncidentReportNumber),
                PageOrientation = Orientation.Landscape,
                Cookies = GetCookieCollection(),
                FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
            };

        }

        private ListAccidentReportViewModel GetAccidentReportViewModel(string queryString, bool _canViewAll)
        {

            ListAccidentReportViewModel model = new ListAccidentReportViewModel();
            try
            {
                var accidentReportsList = _generalUtilityHelper.UpdateTimsFormattedLocation(_unitOfWork.AccidentReportRepository.GetAccidentReport(queryString, _canViewAll));

                if (accidentReportsList != null && accidentReportsList.Any())
                {
                    // Retrieve out a distinct list of vehicle(s)
                    var vehicleList = accidentReportsList.GroupBy(x => x.Vehicle).Select(y => y.First()).ToList();

                    model =
                    new ListAccidentReportViewModel()
                    {
                        GeneratedDateTime = DateTime.Now,
                        SearchParameterString = string.Empty,
                        AccidentReportsList = accidentReportsList.ToList(),
                        IncidentReportNumber = accidentReportsList.First().AccidentReport?.incident_number,
                        IOExtensionNumber = accidentReportsList.First().AccidentReport?.io_extension_number,
                        IOName = accidentReportsList.First().AccidentReport?.io_name,
                        IncidentOccurred = accidentReportsList.First().TimsFormattedLocation,
                        Road1Name = accidentReportsList.First().TimsLocationCode?.description,
                        Road2Name = accidentReportsList.First().TimsLocationCode2?.description,
                        LocationRemarks = accidentReportsList.First().AccidentReport?.location_remarks,
                        StructureDamage = accidentReportsList.First().AccidentReport?.structure_damage,
                        VehicleList = vehicleList,
                        Weather = accidentReportsList.First().AccidentReportWeatherSystemCode?.value,
                        RoadSurface = accidentReportsList.First().AccidentRoadSurfaceSystemCode?.value,
                        TrafficVolume = accidentReportsList.First().AccidentTrafficVolumeSystemCode?.value,
                        OfficerNRIC = accidentReportsList.First().AccidentReport?.officer_nric,
                        OfficerRank = accidentReportsList.First().AccidentReport?.officer_rank,
                        OfficerName = accidentReportsList.First().AccidentReport?.officer_name,
                        OfficerDeclarationTime = accidentReportsList.First().AccidentReport?.officer_declaration_time,
                        OfficerTeam = accidentReportsList.First().AccidentReport?.officer_team,
                        PreserveDate = accidentReportsList.First().AccidentReport?.preserve_date,
                        CreatedBy = accidentReportsList.First().AccidentReport?.created_by.ToString(),
                        CreatedTime = accidentReportsList.First().AccidentReport.created_time,
                        OfficerArrivalTime = accidentReportsList.First().AccidentReport?.po_arrival_time,
                        OfficerResumeDutyTime = accidentReportsList.First().AccidentReport?.po_resume_duty_time,
                        CreatedByDisplayName = accidentReportsList.First().User?.display_name,
                        CreatedByNric = accidentReportsList.First().User?.nric,
                        AccidentTime = accidentReportsList.First().AccidentReport?.accident_time,
                        CreatedByAdAccount = accidentReportsList.First().User?.ad_account,
                        SpecialZone = accidentReportsList.First().AccidentSpecialZoneSystemCode?.value,
                        SchoolName = accidentReportsList.First().AccidentReport?.school_name
                    };                      

                    // Set the show preserve the scene section flag
                    if(!string.IsNullOrEmpty(model.OfficerName) && !string.IsNullOrEmpty(model.OfficerTeam) && model.PreserveDate.HasValue)
                    {
                        model.IsShowPreserveSceneSection = true;
                    }
                    else
                    {
                        model.IsShowPreserveSceneSection = false;
                    }


                    Session["AccidentReport"] = model;
                }
            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
            }

            return model;
        }
    }
}