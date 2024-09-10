using System.Web.Mvc;
using System;
using System.Linq;
using SPOTSAdminModule.ViewModels;
using SPOTSAdminModule.Utility;
using SPOTS_Repository.Models;
using SPOTS_Repository.Services;
using SPOTS_AuditLogging;

namespace SPOTSAdminModule.Controllers
{
    [Authorize]
    public class LogsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "LogsController";


        public LogsController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitOfWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_TRANSACTION_LOG)]
        public ActionResult GetTransactionLogs()
        {
            var userAction = "Viewed Transaction Logs";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View(GetSystemCodeDropDownList());
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_TRANSACTION_LOG)]
        [HttpPost]
        public ActionResult GetTransactionLogs(SearchModel searchModel)
        {
            try
            {
                var userAction = "Search Transaction Logs:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
                
                // Set system code is for Application Type
                searchModel.SystemCodeCode = 30;
                searchModel.SearchLogType = string.Empty;
                if (searchModel.SearchToDate != null)
                {
                    DateTime toDate = searchModel.SearchToDate.Value;
                    TimeSpan ts = new TimeSpan(23, 59, 59);
                    toDate = toDate.Date + ts;
                    searchModel.SearchToDate = toDate;
                }
                var logsList = _unitOfWork.LogRepository.GetLogs(searchModel);
                logsList = logsList.OrderByDescending(x => x.Log.log_time);
                var logsViewModel = new LogsViewModel { SystemLogsList = logsList };

                return PartialView("Tables/_TableReturnResultView", logsViewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error");
            }

        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_LOGIN_LOG)]
        public ActionResult GetUserLoginsLogs()
        {
            var userAction = "Viewed User Login Logs";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            return View(GetSystemCodeDropDownList());
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_LOGIN_LOG)]
        [HttpPost]
        public ActionResult GetUserLoginsLogs(SearchModel searchModel)
        {

            var userAction = "Search User Logins Logs:" + _generalUtilityHelper.GetSearchParameters(searchModel);
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            // Set system code is for Application Type
            searchModel.SystemCodeCode = 30;
            searchModel.SearchLogType = "GetUserLoginsLogs";
            if (searchModel.SearchToDate != null)
            {
                DateTime toDate = searchModel.SearchToDate.Value;
                TimeSpan ts = new TimeSpan(23, 59, 59);
                toDate = toDate.Date + ts;
                searchModel.SearchToDate = toDate;
            }
            var logsList = _unitOfWork.LogRepository.GetLogs(searchModel);
            var logsViewModel = new LogsViewModel { SystemLogsList = logsList };

            return PartialView("Tables/_TableUserLoginsView", logsViewModel);
        }

        private LogsViewModel GetSystemCodeDropDownList()
        {
            const short applicationTypeCode = 30;
            var logsViewModel = new LogsViewModel
            {
                ApplicationTypeSelectList = new SelectList(
                    _unitOfWork.SystemCodeRepository.GetSystemCodeDropDownList(applicationTypeCode, true),
                    "key", "value", 0)
            };


            return logsViewModel;
        }
    }
}