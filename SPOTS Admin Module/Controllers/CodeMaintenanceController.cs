using System;
using System.Web.Mvc;
using SPOTSAdminModule.Utility;
using SPOTSAdminModule.ViewModels;
using SPOTS_Repository.Services;
using SPOTS_Repository.Models;
using SPOTS_Repository;
using Newtonsoft.Json;
using SPOTS_AuditLogging;
using System.Collections.Generic;

namespace SPOTSAdminModule.Controllers
{

    [Authorize]
    public class CodeMaintenanceController : Controller
    {

        private readonly IUnitOfWork _unitofWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "CodeMaintenanceController";
        private const short timsCode = 31;

        public CodeMaintenanceController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitofWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        private SystemCodeViewModel UpdateDropDownList()
        {
            // Dropdown selection for SPOTS System Code Lookup and Dropdown selection for SPOTS Tims Code
            var viewModel = new SystemCodeViewModel
            {
                SystemCodeSelectList = new SelectList(_unitofWork.SystemCodeLookupRepository.GetSystemCodeLookUpDropDownList(false), "code", "description", 0),
                TIMSCodeSelectList = new SelectList(_unitofWork.SystemCodeRepository.GetSystemCodeDropDownList(timsCode, false), "key", "value", 0)
            };

            return viewModel;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SYSTEM_CODE)]
        // GET: CodeMaintenance
        public ActionResult Index()
        {
            var userAction = "Viewed Code Maintenance";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);
            return View(UpdateDropDownList());
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_SYSTEM_CODE)]
        [HttpPost]
        public ActionResult Index(SearchModel searchModel)
        {

            try
            {
                // Refresh the view model dropdown list
                var viewModel = UpdateDropDownList();

                if (searchModel.SearchByCodeMaintenanceType.Equals(SpotsConstant.SEARCH_SPOTS_TabIndex))
                {

                    var userAction = "Search Code Maintenance [SPOTS Tab]:" + _generalUtilityHelper.GetSearchParameters(searchModel);
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                    if (searchModel.SearchSystemCodeType.HasValue && searchModel.SearchSystemCodeType > 0)
                    {                        
                        var systemCodeModelList = _unitofWork.SystemCodeRepository.GetSystemCodeByCodeAndDescription(searchModel);
                        var systemCodeLookUpModel = _unitofWork.SystemCodeLookupRepository.GetSystemCodeLookUpByCode(searchModel.SearchSystemCodeType);

                        if (systemCodeModelList != null)
                        {
                            viewModel.SystemCodeList = systemCodeModelList;
                            viewModel.PartialTableViewName = "Tables/_TableSystemCodeResultView";
                            viewModel.SelectedCodeType = systemCodeLookUpModel.description;
                            viewModel.SelectedCode = systemCodeLookUpModel.code.ToString();
                            viewModel.IsSelectedCodeTypeEditable = systemCodeLookUpModel.editable;
                        }
                    }
                }
                else if (searchModel.SearchByCodeMaintenanceType.Equals(SpotsConstant.SEARCH_TIMS_TabIndex))
                {

                    var userAction = "Search Code Maintenance ";

                    if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeType))
                    {
                        // to show country code list
                        if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_COUNTRY_CODE))
                        {
                            userAction = userAction + " [TIMS_COUNTRY_CODE]:TIMS Code Description : ";
                            if(!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSCountryCodeRepository.GetTIMSCountryByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSCountryCodeList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSCountryCodeResultView";
                            }

                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_LOCATION_CODE))
                        {
                            userAction = userAction + " [TIMS_LOCATION_CODE]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSLocationCodeRepository.GetTIMSLocationByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSLocationCodeList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSLocationCodeResultView";
                            }

                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_NATIONALITY_CODE))
                        {
                            userAction = userAction + " [TIMS_NATIONALITY_CODE]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSNationalityCodeRepository.GetTIMSNationalityByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSNationalityCodeList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSNationalityCodeResultView";
                            }

                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_OFFENCE_CODE))
                        {
                            userAction = userAction + " [TIMS_OFFENCE_CODE]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSOffenceCodeRepository.GetTIMSOffenceByDescription(searchModel);

                            if (timsCodeModelList != null)                                
                            {
                                viewModel.TIMSCodeTypeDescription = searchModel.TIMSCodeTypeDescription;

                                List<ViewTIMSOffenceCode> vtocl = new List<ViewTIMSOffenceCode>();
                                 
                                foreach (tims_offence_code toc in timsCodeModelList) {
                                    ViewTIMSOffenceCode vtoc = new ViewTIMSOffenceCode();
                                    vtoc.TIMSOffenceCode = toc;
                                    /*
                                    if (_unitofWork.SystemCodeRepository.GetSystemCode(34, Int16.Parse(toc.offender_type)) != null)
                                    {
                                        vtoc.offenderTypeDescription = _unitofWork.SystemCodeRepository.GetSystemCode(34, Int16.Parse(toc.offender_type)).value.ToString();
                                    }
                                    */
                                    if (_unitofWork.SystemCodeRepository.GetSystemCodesByPrefix(34, toc.offender_type) != null)
                                    {
                                        vtoc.offenderTypeDescription = _unitofWork.SystemCodeRepository.GetSystemCodesByPrefix(34, toc.offender_type).value.ToString();
                                    }
                                    vtocl.Add(vtoc);
                                }

                                viewModel.TIMSOffenceCodeList = vtocl;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSOffenceCodeResultView";
                            }
                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_VEHICLE_MAKE))
                        {
                            userAction = userAction + " [TIMS_VEHICLE_MAKE]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSVehicleMakeRepository.GetTIMSVehicleMakeByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSVehicleMakeList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSVehicleMakeResultView";
                            }
                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_VEHICLE_TYPE))
                        {
                            userAction = userAction + " [TIMS_VEHICLE_TYPE]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSVehicleTypeRepository.GetTIMSVehicleTypeByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSVehicleTypeList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSVehicleTypeResultView";
                            }
                        }
                        else if (searchModel.SearchTIMSCodeType.Equals(SpotsConstant.TIMS_VEHICLE_COLOR))
                        {
                            userAction = userAction + " [TIMS_VEHICLE_COLOR]:TIMS Code Description : ";
                            if (!string.IsNullOrEmpty(searchModel.SearchTIMSCodeDescription))
                            {
                                userAction = userAction + searchModel.SearchTIMSCodeDescription.ToString();
                            }

                            var timsCodeModelList = _unitofWork.TIMSVehicleColorRepository.GetTIMSVehicleColorByDescription(searchModel);

                            if (timsCodeModelList != null)
                            {
                                viewModel.TIMSVehicleColorList = timsCodeModelList;
                                viewModel.PartialTableViewName = "Tables/_TableTIMSVehicleColorResultView";
                            }
                        }

                        // Log User Action
                        _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                        _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                    }

                }

                return PartialView(viewModel.PartialTableViewName, viewModel);

            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error");
            }
            
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_ADD_SYSTEM_CODE)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Add(string jsonRequest)
        {

            if (ModelState.IsValid)
            {
                try
                {

                    var newSystemCode = (system_code)JsonConvert.DeserializeObject(jsonRequest, typeof(system_code));
                    newSystemCode.key = (short)(_unitofWork.SystemCodeRepository.GetMaxKey(newSystemCode.code) + 1);
                    newSystemCode.created_by = _unitofWork.UserRepository.SingleOrDefault(x => x.ad_account == User.Identity.Name).user_id;
                    newSystemCode.created_time = DateTime.Now;
                    newSystemCode.delete_flag = false;
                    newSystemCode.prefix = string.Empty;
                    // Persist object
                    _unitofWork.SystemCodeRepository.Add(newSystemCode);
                    _unitofWork.Complete();

                    // Refresh the View
                    var searchModel = new SearchModel
                    {
                        SearchByCodeMaintenanceType = SpotsConstant.SEARCH_SPOTS_TabIndex,
                        SearchSystemCodeType = newSystemCode.code,
                    };

                    // Log User Action
                    var userAction = "Add System Code : Value = " + newSystemCode.value.ToString() + " | Description = " + newSystemCode.description.ToString();
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                    return Index(searchModel);
                }
                catch(Exception ex)
                {
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                    return PartialView("Error", new HandleErrorInfo(ex, "CodeMaintenance", "Add"));
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_EDIT_SYSTEM_CODE)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(string jsonRequest)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    var editSystemCode = (system_code)JsonConvert.DeserializeObject(jsonRequest, typeof(system_code));
                    // Retrieve DB 
                    var dbSystemcode = _unitofWork.SystemCodeRepository.GetSystemCode(editSystemCode.code, editSystemCode.key);
                    // Update Value
                    dbSystemcode.value = editSystemCode.value;
                    // Update Description
                    dbSystemcode.description = editSystemCode.description;
                    // Update Modified Time
                    dbSystemcode.modified_time = DateTime.Now;
                    // Update Modified by
                    dbSystemcode.modified_by = _unitofWork.UserRepository.SingleOrDefault(x => x.ad_account == User.Identity.Name).user_id;
                    // Persist update
                    _unitofWork.Complete();

                    // Log User Action
                    var value = dbSystemcode.value != null ? dbSystemcode.value.ToString() : string.Empty;
                    var description = dbSystemcode.description != null ? dbSystemcode.description.ToString() : string.Empty;
                    var userAction = "Edited System Code : Value = " + value + " | Description = " + description;
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);


                    // Refresh the View
                    var searchModel = new SearchModel
                   {
                       SearchByCodeMaintenanceType = SpotsConstant.SEARCH_SPOTS_TabIndex,
                       SearchSystemCodeType = editSystemCode.code,
                   };

                    return Index(searchModel);
                }
                catch (Exception ex)
                {
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                    return PartialView("Error");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_DELETE_SYSTEM_CODE)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(string jsonRequest)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    var editSystemCode = (system_code)JsonConvert.DeserializeObject(jsonRequest, typeof(system_code));
                    // Retrieve DB 
                    var dbSystemcode = _unitofWork.SystemCodeRepository.GetSystemCode(editSystemCode.code, editSystemCode.key);
                    // Update Delete Flag
                    dbSystemcode.delete_flag = true;
                    // Update Modified Time
                    dbSystemcode.modified_time = DateTime.Now;
                    // Update Modified by
                    dbSystemcode.modified_by = _unitofWork.UserRepository.SingleOrDefault(x => x.ad_account == User.Identity.Name).user_id;
                    // Persist update
                    _unitofWork.Complete();

                    // Log User Action
                    var value = dbSystemcode.value != null ? dbSystemcode.value.ToString() : string.Empty;
                    var description = dbSystemcode.description != null ? dbSystemcode.description.ToString() : string.Empty;
                    var userAction = "Deleted System Code : Value = " + value + " | Description = " + description;
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                    // Refresh the View
                    var searchModel = new SearchModel
                    {
                        SearchByCodeMaintenanceType = SpotsConstant.SEARCH_SPOTS_TabIndex,
                        SearchSystemCodeType = editSystemCode.code,
                    };

                    return Index(searchModel);
                }
                catch (Exception ex)
                {
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                    return PartialView("Error");
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

    }
}