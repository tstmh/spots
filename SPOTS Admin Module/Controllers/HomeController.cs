using System.Web.Mvc;
using SPOTS_Repository.Services;
using SPOTSAdminModule.ViewModels;
using SPOTSAdminModule.Utility;
using SPOTS_AuditLogging;
using SPOTS_Repository.Models;

namespace SPOTSAdminModule.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "HomeController";

        public HomeController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitOfWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        public ActionResult Index()
        {
            var userAction = "Viewed Home"; 
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            SearchModel searchModel = new SearchModel();

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

            var accidentReportsList = _unitOfWork.AccidentReportRepository.GetTop10AccidentReportsList(searchModel);
            var viewModel = new OnSceneInvestigationReportsEnquiryViewModel { AccidentReportsList = accidentReportsList };

            return View(viewModel);
        }

    }
}