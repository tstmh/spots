using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Rotativa;
using Rotativa.Options;
using SPOTSAdminModule.Utility;
using SPOTSAdminModule.ViewModels;
using SPOTS_Repository.Models;
using SPOTS_Repository.Services;
using System.Web.Security;
using SPOTS_AuditLogging;

namespace SPOTSAdminModule.Controllers
{
    [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_REPORT)]
    public class ReportController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "ReportController";

        public ReportController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitOfWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        public ActionResult ListSummonsReport()
        {
            var userAction = "Viewed List Summons";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View(GetSystemCodeDropDownList());
        }

        [HttpPost]
        public ActionResult ListSummonsReport(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search List Summons:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all M401 records                                
                bool result = SpotsConstant.canViewAllSummons(Session["UserRoles"].ToString());                
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);                

                if (result)
                {
                    searchModel.SearchOwnRecords = "";
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name;
                }

                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                searchModel.SearchParametersTrim();

                var summonsReportList = _unitOfWork.SummonsRepository.GetAllSummons(searchModel);
                foreach (var summons in summonsReportList)
                {
                    summons.Location = _generalUtilityHelper.FormatIncidentLocation(summons.Summon.incident_occured, summons.TimsLocation1, summons.TimsLocation2);                    
                }
                var viewModel = new ListSummonsViewModel
                {
                    GeneratedDateTime = DateTime.Now,
                    ReportGeneratedBy = reportGeneratedBy,
                    SearchParameterString = ConstructSearchParameterString(searchModel),
                    SummonsReportsList = summonsReportList,
                    SearchModel = searchModel
                };
                Session["ListSummonsReport"] = viewModel;
                return PartialView("Tables/_TableListSummonsPartial", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "ListSummonsReport"));
            }
        }

        public void ListSummonsExportToCsv(string searchParameterString)
        {
            var sw = new StringWriter();

            var searchModel = ConstructSearchParameterModel(searchParameterString);

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

            if (searchModel == null) return;
            var summonsReportList = _unitOfWork.SummonsRepository.GetAllSummons(searchModel).ToList();
            
            if (!summonsReportList.Any()) return;

            // Write and Create CSV file
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=ListSummons.csv");
            Response.ContentType = "text/csv";

            var count = 1;

            // Create CSV header
            sw.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7}", 
                "S/N", 
                "Officer ID",
                "Officer Name",
                "Summons Type", 
                "Offence Description", 
                "Report No.", 
                "Offence Date and Time", 
                "Location"));
            
            foreach (var summons in summonsReportList)
            {
                summons.Location = _generalUtilityHelper.FormatIncidentLocation(summons.Summon.incident_occured, summons.TimsLocation1, summons.TimsLocation2);

                sw.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7}",
                    count, 
                    "\"" + summons.AdAccount + "\"",
                    "\"" + summons.DisplayName + "\"",
                    "\"" + summons.SummonsType + "\"",
                    "\"" + summons.OffenceDescription + "\"",
                    "\"" + summons.TimsReportNo + "\"",
                    "\"" + summons.OffenceDateTime + "\"",
                    "\"" + summons.Location + "\""));
                count++;
            }
            
            Response.Write(sw.ToString());

            Response.End();
        }

        public ActionResult SummonsStatistics()
        {
            var userAction = "Viewed Summons Statistics";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View();
        }

        [HttpPost]
        public ActionResult SummonsStatistics(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Summons Statistics:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);

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

                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                searchModel.SearchParametersTrim();

                var summonsStatisticsReport = _unitOfWork.SummonsRepository.GetSummonsStatistics(searchModel);

                var viewModel = new SummonsStatisticsViewModel
                {
                    GeneratedDateTime = DateTime.Now,
                    ReportGeneratedBy = reportGeneratedBy,
                    SearchParameterString = ConstructSearchParameterString(searchModel),
                    SummonsStatisticsReport = ConvertStatisticResultToList(summonsStatisticsReport),
                    SearchModel = searchModel                    
                };

                Session["SummonsStatisticsReport"] = viewModel;
                return PartialView("Tables/_TableSummonsStatisticsPartial", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "SummonsStatistics"));
            }
        }

        public ActionResult SummonsStatisticsUsers()
        {
            var userAction = "Viewed Summons Statistics (User)";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View();
        }

        [HttpPost]
        public ActionResult SummonsStatisticsUsers(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Summons Statistics (User):" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);

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

                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                searchModel.SearchParametersTrim();
                var summonsStatisticsUsersReport = _unitOfWork.SummonsRepository.GetSummonsStatisticsUsers(searchModel);
                var viewModel = new SummonsStatisticsUsersViewModel
                {
                    GeneratedDateTime = DateTime.Now,
                    ReportGeneratedBy = reportGeneratedBy,
                    SearchParameterString = ConstructSearchParameterString(searchModel),
                    SummonsStatisticsUsersReport = ConvertStatisticUsersResultToList(summonsStatisticsUsersReport),
                    SearchModel = searchModel
                };

                Session["SummonsStatisticsUsersReport"] = viewModel;
                return PartialView("Tables/_TableSummonsStatisticsUsersPartial", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "SummonsStatisticsUsers"));
            }
        }

        public ActionResult SummonsReconciliation()
        {

            var userAction = "Viewed Summons Reconciliation";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View();
        }

        [HttpPost]
        public ActionResult SummonsReconciliation(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Summons Reconciliation:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);

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

                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                searchModel.SearchParametersTrim();
                var summonsReconciliationList = _unitOfWork.SummonsRepository.GetAllSummonsSentToTims(searchModel);
                var viewModel = new SummonsReconciliationViewModel
                {
                    GeneratedDateTime = DateTime.Now,
                    ReportGeneratedBy = reportGeneratedBy,
                    SearchParameterString = ConstructSearchParameterString(searchModel),
                    SummonsReconciliationList = summonsReconciliationList,
                    SearchModel = searchModel
                };
                Session["SummonsReconciliationReport"] = viewModel;
                return PartialView("Tables/_TableSummonsReconciliationPartial", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "SummonsReconciliation"));
            }
        }

        public void SummonsReconciliationExportToCsv(string searchParameterString)
        {
            var sw = new StringWriter();

            var searchModel = ConstructSearchParameterModel(searchParameterString);

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

            if (searchModel == null) return;

            var summonsReport = (_unitOfWork.SummonsRepository.GetAllSummonsSentToTims(searchModel)).ToList();

            if (!summonsReport.Any()) return;

            // Write and Create CSV file
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=SummonsReconciliation.csv");
            Response.ContentType = "text/csv";

            var count = 1;

            // Create CSV header
            sw.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}",
                "S/N", 
                "Summons Type", 
                "Report No.", 
                "Offence Date", 
                "Location", 
                "Vehicle No.", 
                "Offender NRIC", 
                "Officer ID", 
                "Officer Service No.", 
                "Date Uploaded"));                        

            foreach (var summons in summonsReport)
            {                
                summons.Location = _generalUtilityHelper.FormatIncidentLocation(summons.Summon.incident_occured, summons.TimsLocation1, summons.TimsLocation2);
                
                sw.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}",
                    count,
                    "\"" + summons.SummonsType + "\"",
                    "\"" + summons.TimsReportNo + "\"",
                    "\"" + summons.OffenceDateTime + "\"",
                    "\"" + summons.Location + "\"",
                    "\"" + summons.VehicleNo + "\"",
                    "\"" + summons.OffenderPersonNRIC + "\"",
                    "\"" + summons.AdAccount + "\"",
                    "\"" + summons.DisplayName + "\"",
                    "\"" + summons.SentToTimsDateTime + "\""));

                count++;
            }

            Response.Write(sw.ToString());
            Response.End();
        }

        public ActionResult ListAccidentReport()
        {
            var userAction = "Viewed List On-Seen Investigation Report";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View();
        }

        [HttpPost]
        public ActionResult ListAccidentReport(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search List On-Seen Investigation Report:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                // Check if user can view all OSI records                                
                bool result = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);                

                if (result)
                {
                    searchModel.SearchOwnRecords = "";                    
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name;
                }

                if (searchModel != null && _unitOfWork != null && _unitOfWork.AccidentReportRepository != null)
                {
                    if (searchModel.SearchToDate != null)
                    {
                        DateTime toDate = searchModel.SearchToDate.Value;
                        TimeSpan ts = new TimeSpan(23, 59, 59);
                        toDate = toDate.Date + ts;
                        searchModel.SearchToDate = toDate;
                    }
                    searchModel.SearchParametersTrim();

                    var accidentReportsList = _generalUtilityHelper.UpdateTimsFormattedLocation(_unitOfWork.AccidentReportRepository.GetAccidentReportsList(searchModel));

                    var viewModel = new ListAccidentReportViewModel
                    {
                        GeneratedDateTime = DateTime.Now,
                        ReportGeneratedBy = reportGeneratedBy,
                        SearchParameterString = ConstructSearchParameterString(searchModel),
                        AccidentReportsList = accidentReportsList.ToList(),
                        SearchModel = searchModel
                    };
                    Session["ListAccidentReport"] = viewModel;
                    return PartialView("Tables/_TableListAccidentReportView", viewModel);
                }
                else
                {
                    
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ": Exception in retrieving Search parameters");
                    return PartialView("Error");
                }
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "ListAccidentReport"));
            }

        }

        public ActionResult AccidentReportStatistics()
        {
            var userAction = "Viewed OSI Statistics (USER)";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View();
        }

        [HttpPost]
        public ActionResult AccidentReportStatistics(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search OSI Statistics (USER):" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
                var reportGeneratedBy = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);

                // Check if user can view all OSI records                                
                bool result = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());

                if (result)
                {
                    searchModel.SearchOwnRecords = "";
                }
                else
                {
                    var _userDisplayName = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);
                    searchModel.SearchOwnRecords = _userDisplayName;
                }

                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                searchModel.SearchParametersTrim();
                var accidentReportStatisticsList = (List<AccidentReportStatistics>)_unitOfWork.AccidentReportRepository.GetAccidentReportStatisticList(searchModel);

                var viewModel = new ListAccidentReportViewModel
                    {
                        GeneratedDateTime = DateTime.Now,
                        ReportGeneratedBy = reportGeneratedBy,
                        SearchParameterString = ConstructSearchParameterString(searchModel),
                        AccidentReportStatisticList = accidentReportStatisticsList,
                        SearchModel = searchModel
                    };
                Session["ListAccidentStatisticsReport"] = viewModel;
                return PartialView("Tables/_TableAccidentReportStatisticsView", viewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "Report", "AccidentReportStatistics"));
            }
        }
                
        public void UserStatsExportToCsv(string searchParameterString)
        {
            var sw = new StringWriter();

            var searchModel = ConstructSearchParameterModel(searchParameterString);

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

            if (searchModel == null) return;

            var summonsStatisticsUserReport =
                ConvertStatisticUsersResultToList(_unitOfWork.SummonsRepository.GetSummonsStatisticsUsers(searchModel));

            if (!summonsStatisticsUserReport.Any()) return;

            // Write and Create CSV file
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=SummonsStatisticsReport.csv");
            Response.ContentType = "text/csv";

            var count = 1;
            var m401Total = 0;
            var echoTotal = 0;
            // Create CSV header
            sw.WriteLine("S/N,User ID, User Name, m401 Issued, Echo Issued, Total");

            // Create CSV list
            foreach (var user in summonsStatisticsUserReport)
            {
                sw.WriteLine($"{count}," +
                             $"{user.UserId}," +
                             $"Test user 1 Fake," +
                             $"{user.M401}," +
                             $"{user.Echo}," +
                             $"{user.M401 + user.Echo}");
                m401Total += user.M401;
                echoTotal += user.Echo;
                count++;
            }

            sw.WriteLine("," +
                         "," +
                         "Total," +
                         $"{m401Total}," +
                         $"{echoTotal}," +
                         $"{m401Total + echoTotal}");

            Response.Write(sw.ToString());

            Response.End();
        }

        public void StatsExportToCsv(string searchParameterString)
        {
            var sw = new StringWriter();

            var searchModel = ConstructSearchParameterModel(searchParameterString);

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

            if (searchModel == null) return;

            var summonsStatisticsReport =
                ConvertStatisticResultToList(_unitOfWork.SummonsRepository.GetSummonsStatistics(searchModel));

            if (!summonsStatisticsReport.Any()) return;

            // Write and Create CSV file
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=SummonsStatisticsReport.csv");
            Response.ContentType = "text/csv";

            var count = 1;

            // Create CSV header
            sw.WriteLine("S/N,Summon Type,Total Created");

            var totalSummons = 0;
            // Create CSV list
            foreach (var summon in summonsStatisticsReport)
            {
                sw.WriteLine($"{count}," +
                             $"{summon.Type}," +
                             $"{summon.Count}");
                totalSummons += summon.Count;
                count++;
            }

            sw.WriteLine("," +
                         "Total," +
                         $"{totalSummons}");

            Response.Write(sw.ToString());
            Response.End();
        }

        public List<SummonsStatistics> ConvertStatisticResultToList(IEnumerable<AllSummons> summonsStatisticsReport)
        {
            var statisticResult = new List<SummonsStatistics>();

            var m401 = new SummonsStatistics {Type = "M401", Count = 0};
            var echo = new SummonsStatistics {Type = "M401E", Count = 0};

            foreach (var s in summonsStatisticsReport)                
                if (s.Summon.summons_type == 1)
                    m401.Count++;
                else if (s.Summon.summons_type == 2)
                    echo.Count++;

            statisticResult.Add(m401);
            statisticResult.Add(echo);
            return statisticResult;
        }

        // Converting the Summons Statistics (User) query result from database into a new list for better data display
        public List<SummonsStatisticsUser> ConvertStatisticUsersResultToList(
            IEnumerable<AllSummons> summonsStatisticsReport)
        {
            var statisticResult = new List<SummonsStatisticsUser>();

            var list = (from summons in summonsStatisticsReport
                group summons by summons.Summon.created_by
                into b
                select new
                {
                    UserId = from x in b select x.AdAccount,
                    Username = from x in b select x.DisplayName,
                    M401 = (from x in b select x.Summon.summons_type == 1 ? 1 : 0).Sum(),
                    Echo = (from x in b select x.Summon.summons_type == 2 ? 1 : 0).Sum()
                }).ToList();
            
            foreach (var user in list)
            {
                var arrayId = user.UserId.ToArray();
                var arrayUsername = user.Username.ToArray();
                statisticResult.Add(new SummonsStatisticsUser
                {
                    UserId = arrayId[0],
                    Username = arrayUsername[0],
                    Echo = user.Echo,
                    M401 = user.M401
                });
            }

            return statisticResult;
        }

        public void ExportToCsv(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);

            if(searchModel != null && _unitOfWork != null && _unitOfWork.AccidentReportRepository != null)
            {

                var sw = new StringWriter();

                // Check if user can view all OSI records                                
                bool result = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());

                if (result)
                {
                    searchModel.SearchOwnRecords = "";
                }
                else
                {
                    searchModel.SearchOwnRecords = System.Web.HttpContext.Current.User.Identity.Name; ;
                }

                var accidentReportsList = _generalUtilityHelper.UpdateTimsFormattedLocation(_unitOfWork.AccidentReportRepository.GetAccidentReportsList(searchModel));
                
                if (!accidentReportsList.Any()) return;

                // Write and Create CSV file
                Response.ClearContent();
                Response.AddHeader("content-disposition", "attachment;filename=ListAccidentReport.csv");
                Response.ContentType = "text/csv";

                var count = 1;

                // Create CSV header
                sw.WriteLine(
                    "S/N,Officer ID,Officer Name,Incident No.,Investigation Officer,Ext No.,Accident Date,Accident Time,Location,Device ID");

                // Create CSV list
                foreach (var accidentReport in accidentReportsList)
                {
                    sw.WriteLine($"{count}," +
                                 $"{accidentReport.AccidentReport.officer_id}," +
                                 $"{accidentReport.AccidentReport.officer_name}," +
                                 $"{accidentReport.AccidentReport.incident_number}," +
                                 $"{accidentReport.AccidentReport.io_name}," +
                                 $"{accidentReport.AccidentReport.io_extension_number}," +
                                 $"{accidentReport.AccidentReport.created_time.ToShortDateString()}," +
                                 $"{accidentReport.AccidentReport.created_time.ToShortTimeString()}," +
                                 $"{accidentReport.TimsFormattedLocation}," +
                                 $"{accidentReport.AccidentReport.device_id}");

                    count++;
                }

                Response.Write(sw.ToString());

                Response.End();
            }
        }

        public void ExportToCsvAccidentStatistics(string searchParameterString)
        {
            var sw = new StringWriter();

            var searchModel = ConstructSearchParameterModel(searchParameterString);

            // Check if user can view all OSI records                                
            bool result = SpotsConstant.canViewAllOSI(Session["UserRoles"].ToString());

            if (result)
            {
                searchModel.SearchOwnRecords = "";
            }
            else
            {
                var _userDisplayName = _unitOfWork.UserRepository.GetUserDisplayName(User.Identity.Name);
                searchModel.SearchOwnRecords = _userDisplayName;
            }

            if (searchModel == null) return;

            var accidentReportStatisticsList = _unitOfWork.AccidentReportRepository.GetAccidentReportStatisticList(searchModel);

            var accidentReportStatisticses = accidentReportStatisticsList as AccidentReportStatistics[] ??
                                             accidentReportStatisticsList.ToArray();
            if (!accidentReportStatisticses.Any()) return;

            // Write and Create CSV file
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment;filename=ListAccidentReport.csv");
            Response.ContentType = "text/csv";

            var count = 1;

            // Create CSV header
            sw.WriteLine(
                "S/N,User ID,User Name,Accident Report Submitted");

            var total = 0;

            // Create CSV list
            foreach (var accidentReport in accidentReportStatisticses)
            {
                sw.WriteLine($"{count}," +
                             $"{accidentReport.UserId}," +
                             $"{accidentReport.UserName}," +
                             $"{accidentReport.AccidentReportsSubmitted}");

                total += accidentReport.AccidentReportsSubmitted;
                count++;
            }

            sw.WriteLine("," +
             "," +
             "Total," +
             $"{total}");

            Response.Write(sw.ToString());

            Response.End();
        }

        public SearchModel ConstructSearchParameterModel(string searchParameterString)
        {
            if (string.IsNullOrEmpty(searchParameterString))
                return null;

            var searchParameters = searchParameterString.Split('|');
            var searchModel = new SearchModel();

            // Filter by Incident No.
            if (!string.IsNullOrEmpty(searchParameters[0]))
                searchModel.SearchIncidentNo = searchParameters[0];

            // Filter by Officer ID
            if (!string.IsNullOrEmpty(searchParameters[1]))
                searchModel.SearchOfficerId = searchParameters[1];

            // Filter by Officer Name
            if (!string.IsNullOrEmpty(searchParameters[2]))
                searchModel.SearchOfficerName = searchParameters[2];

            // Filter by Investigation Officer Name
            if (!string.IsNullOrEmpty(searchParameters[3]))
                searchModel.SearchInvestigationOfficerName = searchParameters[3];

            // Filter by Date From
            if (!string.IsNullOrEmpty(searchParameters[4]))
                searchModel.SearchFromDate = Convert.ToDateTime(searchParameters[4]);

            // Filter by Date To
            if (!string.IsNullOrEmpty(searchParameters[5]))
                searchModel.SearchToDate = Convert.ToDateTime(searchParameters[5]);

            // Filter by Time From
            if (!string.IsNullOrEmpty(searchParameters[6]))
                searchModel.SearchFromTime = Convert.ToDateTime(searchParameters[6]);

            // Filter by Time To
            if (!string.IsNullOrEmpty(searchParameters[7]))
                searchModel.SearchToTime = Convert.ToDateTime(searchParameters[7]);

            // Filter by TIMS Location
            if (!string.IsNullOrEmpty(searchParameters[8]))
                searchModel.SearchLocation = searchParameters[8];

            // Filter by Summons Type
            if (!string.IsNullOrEmpty(searchParameters[9]))
                searchModel.SearchSummonsType = short.Parse(searchParameters[9]);

            // Filter by Offence Description
            if (!string.IsNullOrEmpty(searchParameters[10]))
                searchModel.SearchOffenceDescription = searchParameters[10];

            return searchModel;
        }

        public string ConstructSearchParameterString(SearchModel searchModel)
        {
            // Keep a copy of the Search parameters for generating of CSV

            // Filter by Incident No.
            var tempSearchString = searchModel.SearchIncidentNo + "|";

            // Filter by Officer ID
            tempSearchString = tempSearchString + searchModel.SearchOfficerId + "|";

            // Filter by Officer Name
            tempSearchString = tempSearchString + searchModel.SearchOfficerName + "|";

            // Filter by Investigation Officer Name
            tempSearchString = tempSearchString + searchModel.SearchInvestigationOfficerName + "|";

            // Filter by Date From
            tempSearchString = tempSearchString + searchModel.SearchFromDate + "|";

            // Filter by Date To
            tempSearchString = tempSearchString + searchModel.SearchToDate + "|";

            // Filter by Time From
            tempSearchString = tempSearchString + searchModel.SearchFromTime + "|";

            // Filter by Time To
            tempSearchString = tempSearchString + searchModel.SearchToTime + "|";

            // Filter by Location
            tempSearchString = tempSearchString + searchModel.SearchLocation + "|";

            // Filter by Summon Type
            tempSearchString = tempSearchString + searchModel.SearchSummonsType + "|"; 

            // Filter by Offence Description
            tempSearchString = tempSearchString + searchModel.SearchOffenceDescription;
            
            return tempSearchString;
        }

        private ListSummonsViewModel GetSystemCodeDropDownList()
        {
            const short applicationTypeCode = 23;
            var listSummonsViewModel = new ListSummonsViewModel
            {
                ApplicationTypeSelectList = new SelectList(
                    _unitOfWork.SystemCodeRepository.GetSystemCodeDropDownList(applicationTypeCode, true),
                    "key", "value", 0)
            };

            return listSummonsViewModel;
        }

        private Dictionary<string,string> GetCookieCollection()
        {
            //build cookie dict here

            Dictionary<string, string> cookieCollection = new Dictionary<string, string>();

            foreach (var key in Request.Cookies.AllKeys)
            {
                if (key == FormsAuthentication.FormsCookieName) { 
                    cookieCollection.Add(key, Request.Cookies.Get(key).Value);
                }
            }
            return cookieCollection;
        }
        
        public ActionResult PrintListAccidentReportToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["ListAccidentReport"] as ListAccidentReportViewModel;
                return new ViewAsPdf("PdfTemplates/ListAccidentReportPdf", vm)

                {
                    FileName = SpotsConstant.ListAccidentReportPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }            
        }

        public ActionResult ListAccidentReportPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);

            if (searchModel != null && _unitOfWork != null && _unitOfWork.AccidentReportRepository != null)
            {
                var accidentReportsList = _generalUtilityHelper.UpdateTimsFormattedLocation(_unitOfWork.AccidentReportRepository.GetAccidentReportsList(searchModel));

                var viewModel =
                    new ListAccidentReportViewModel
                    {
                        GeneratedDateTime = DateTime.Now,
                        SearchParameterString = ConstructSearchParameterString(searchModel),
                        AccidentReportsList = accidentReportsList.ToList()
                    };

                return View("PdfTemplates/ListAccidentReportPdf", viewModel);
            }
            else
            {
                return View("Error");
            }
        }

        public ActionResult PrintAccidentReportStatisticsToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["ListAccidentStatisticsReport"] as ListAccidentReportViewModel;
                return new ViewAsPdf("PdfTemplates/ListAccidentReportStatisticsPdf", vm)
                {
                    FileName = SpotsConstant.AccidentReportStatisticsPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName,
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }
        }

        public ActionResult ListAccidentReportStatisticsPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);

            var accidentReportStatisticsList =
            (List<AccidentReportStatistics>)_unitOfWork.AccidentReportRepository.GetAccidentReportStatisticList(searchModel);

            var viewModel =
                new ListAccidentReportViewModel
                {
                    GeneratedDateTime = DateTime.Now,
                    SearchParameterString = ConstructSearchParameterString(searchModel),
                    AccidentReportStatisticList = accidentReportStatisticsList
                };

            return View("PdfTemplates/ListAccidentReportStatisticsPdf", viewModel);
        }

        public ActionResult PrintSummonsStatisticsToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["SummonsStatisticsReport"] as SummonsStatisticsViewModel;
                return new ViewAsPdf("PdfTemplates/ListSummonsStatisticsPdf", vm)
                {
                    FileName = SpotsConstant.SummonsStatisticsPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName,
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }
        }

        public ActionResult ListSummonsStatisticsPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);

            var summonsStatisticsReport = _unitOfWork.SummonsRepository.GetSummonsStatistics(searchModel);

            var viewModel = new SummonsStatisticsViewModel
            {
                GeneratedDateTime = DateTime.Now,
                SearchParameterString = ConstructSearchParameterString(searchModel),
                SummonsStatisticsReport = ConvertStatisticResultToList(summonsStatisticsReport)
            };

            return View("PdfTemplates/ListSummonsStatisticsPdf", viewModel);
        }

        public ActionResult PrintSummonsStatisticsUsersToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["SummonsStatisticsUsersReport"] as SummonsStatisticsUsersViewModel;
                return new ViewAsPdf("PdfTemplates/ListSummonsStatisticsUsersPdf", vm)
                {
                    FileName = SpotsConstant.SummonsStatisticsUsersPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }
            
        }

        public ActionResult ListSummonsStatisticsUsersPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);
            var summonsStatisticsUsersReport = _unitOfWork.SummonsRepository.GetSummonsStatisticsUsers(searchModel);
            var viewModel = new SummonsStatisticsUsersViewModel
            {
                GeneratedDateTime = DateTime.Now,
                SearchParameterString = ConstructSearchParameterString(searchModel),
                SummonsStatisticsUsersReport = ConvertStatisticUsersResultToList(summonsStatisticsUsersReport)
            };

            return View("PdfTemplates/ListSummonsStatisticsUsersPdf", viewModel);
        }

        public ActionResult PrintSummonsToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["ListSummonsReport"] as ListSummonsViewModel;
                return new ViewAsPdf("PdfTemplates/ListSummonsPdf", vm)
                {
                    FileName = SpotsConstant.SummonsPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }
            
        }

        public ActionResult ListSummonsPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);
            var summonsReportList = _unitOfWork.SummonsRepository.GetAllSummons(searchModel);
            var viewModel = new ListSummonsViewModel
            {
                GeneratedDateTime = DateTime.Now,
                SummonsReportsList = summonsReportList
            };
            return View("PdfTemplates/ListSummonsPdf", viewModel);
        }

        public ActionResult PrintSummonsReconciliationToPdf(string searchParameterString)
        {
            try
            {
                var vm = Session["SummonsReconciliationReport"] as SummonsReconciliationViewModel;
                return new ViewAsPdf("PdfTemplates/ListSummonsReconciliationPdf", vm)

                {
                    FileName = SpotsConstant.SummonsReconciliationPdfFileName,
                    CustomSwitches = SpotsConstant.PdfFooterFormat,
                    PageOrientation = Orientation.Landscape,
                    Cookies = GetCookieCollection(),
                    FormsAuthenticationCookieName = FormsAuthentication.FormsCookieName
                };
            }
            catch (Exception e)
            {
                var msg = e.Message;
                return PartialView("Error");
            }
        }

        public ActionResult ListSummonsReconciliationPdf(string searchParameterString)
        {
            var searchModel = ConstructSearchParameterModel(searchParameterString);
            var summonsReconciliationList = _unitOfWork.SummonsRepository.GetAllSummonsSentToTims(searchModel);
            var viewModel = new SummonsReconciliationViewModel
            {
                GeneratedDateTime = DateTime.Now,
                SearchParameterString = ConstructSearchParameterString(searchModel),
                SummonsReconciliationList = summonsReconciliationList
            };
            return View("PdfTemplates/ListSummonsReconciliationPdf", viewModel);
        }
      
    }
}