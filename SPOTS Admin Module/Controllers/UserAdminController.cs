using System.Linq;
using System.Web.Mvc;
using SPOTSAdminModule.Utility;
using SPOTSAdminModule.ViewModels;
using SPOTS_Repository.Services;
using SPOTS_Repository;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System;
using System.Configuration;
using SPOTS_AuditLogging;

namespace SPOTSAdminModule.Controllers
{
    [Authorize]
    public class UserAdminController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditService _auditService;
        private readonly IGeneralUtilityHelper _generalUtilityHelper;
        private const string SourceAudit = "UserAdminController";

        public UserAdminController(IUnitOfWork unitOfWork, IAuditService auditService, IGeneralUtilityHelper generalUtilityHelper)
        {
            _unitOfWork = unitOfWork;
            _auditService = auditService;
            _generalUtilityHelper = generalUtilityHelper;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_DELETE_USER_ACCOUNT)]
        public ActionResult DeleteUser(int userID)
        {
            ViewBag.Title = "USER MAINTENANCE";

            var _user = _unitOfWork.UserRepository.Get(userID);
            if (_user != null) {
                _user.modified_time = DateTime.Now;
                _user.delete_flag = true;
                _unitOfWork.Complete();
            }

            _unitOfWork.Complete();

            return RedirectToAction("GetUserList");
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_USER_ACCOUNT)]
        public ActionResult GetUserList()
        {
            try
            {
                ViewBag.Title = "USER MAINTENANCE";

                var userAction = "Viewed User List";
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);


                var userList = _unitOfWork.UserRepository.GetActiveUser();
                List<UserViewModel> userViewModelList = new List<UserViewModel>();

                foreach (var _user in userList)
                {
                    var groupList = _unitOfWork.UserGroupRepository.Find(c => c.user_id == _user.user_id);
                    var userGroupListText = "";
                    foreach (var _groupID in groupList)
                    {
                        if (userGroupListText != "") userGroupListText = userGroupListText + ", ";
                        var _group = _unitOfWork.GroupRepository.Get(_groupID.group_id);
                        if (_group != null) userGroupListText = userGroupListText + _group.group_name;
                    }

                    var userViewModel = new UserViewModel
                    {
                        User = _user,
                        GroupList = groupList,
                        UserGroupListText = userGroupListText
                    };
                    userViewModelList.Add(userViewModel);
                }

                var listUserViewModel = new ListUserViewModel
                {
                    UserList = userViewModelList
                };

                return View(listUserViewModel);
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "UserAdmin", "GetUserList"));
            }

           
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_EDIT_USER_ACCOUNT)]
        public ActionResult Edit(int userID)
        {

            var userAction = "Editing User ID: " + userID ;
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            ViewBag.Title = "USER MAINTENANCE";

            var user = _unitOfWork.UserRepository.Get(userID);
            var groupList = _unitOfWork.UserGroupRepository.Find(g => g.user_id == userID);
            var allGroups = _unitOfWork.GroupRepository.GetActiveGroup();

            var userViewModel = new UserViewModel
            {
                User = user,
                GroupList = groupList,
                AllGroups = allGroups
            };

            return View(userViewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_EDIT_USER_ACCOUNT)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(UserViewModel _userViewModel)
        {
            ViewBag.Title = "USER MAINTENANCE";
            if (ModelState.IsValid)
            {
                _userViewModel.GroupList = _unitOfWork.UserGroupRepository.Find(g => g.user_id == _userViewModel.User.user_id);
                _userViewModel.AllGroups = _unitOfWork.GroupRepository.GetActiveGroup();

                if (isErrorUserViewModelGroup(_userViewModel, false))
                {
                    return View(_userViewModel);
                }

                var existingUser = _unitOfWork.UserRepository.Get(_userViewModel.User.user_id);
                existingUser.ad_account = _userViewModel.User.ad_account;
                existingUser.display_name = _userViewModel.User.display_name;

                // delete existing group
                var _userGroups = _unitOfWork.UserGroupRepository.Find(u => u.user_id == _userViewModel.User.user_id);
                _unitOfWork.UserGroupRepository.RemoveRange(_userGroups);

                if (_userViewModel.groupListCheckbox != null) {
                    // add user group
                    foreach (var _group in _userViewModel.groupListCheckbox)
                    {
                        var _userGroup = new user_group();
                        _userGroup.user_id = _userViewModel.User.user_id;
                        _userGroup.group_id = _group;
                        _userGroup.created_time = DateTime.Now;
                        _userGroup.modified_time = DateTime.Now;
                        _unitOfWork.UserGroupRepository.Add(_userGroup);
                    }
                }
                _unitOfWork.Complete();

                return RedirectToAction("GetUserList");
            }

            return View(_userViewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_ADD_USER_ACCOUNT)]
        public ActionResult AddUser()
        {
            ViewBag.Title = "USER MAINTENANCE";

            var _userViewModel = new UserViewModel();
            _userViewModel.AllGroups = _unitOfWork.GroupRepository.GetActiveGroup();

            return View(_userViewModel);

        }

        private bool doesUserExistInActiveDirectory(string username)
        {
            var boolExist = false;

            //string ADEnvironment = ConfigurationManager.AppSettings[SpotsConstant.ADEnvironment];
            string ADDomain = ConfigurationManager.AppSettings[SpotsConstant.ADDomain];
            string ADServer = ConfigurationManager.ConnectionStrings[SpotsConstant.ADServer].ConnectionString;
            string ADDomainConnection = ConfigurationManager.ConnectionStrings[SpotsConstant.ADDomain].ConnectionString;

            //_auditService.LogAudit(SourceAudit, "ADServer: " + ADServer + " ADDomain: " + ADDomain + " ADDomainConnection: " + ADDomainConnection + " ADEnvironment: " + ADEnvironment);
            _auditService.LogAudit(SourceAudit, "ADServer: " + ADServer + " ADDomain: " + ADDomain + " ADDomainConnection: " + ADDomainConnection);

            if (!string.IsNullOrEmpty(ADServer) && !string.IsNullOrEmpty(ADDomainConnection))
            {
                string domainUserName = ConfigurationManager.AppSettings[SpotsConstant.ADAdminUser];
                string domainKey = ConfigurationManager.AppSettings[SpotsConstant.ADAdminKey];

                /*
                if (!string.IsNullOrEmpty(ADEnvironment) && ADEnvironment == SpotsConstant.SIT)
                {
                    // Set to default AD User Name and Password if configuration is missing for SIT environment
                    if (string.IsNullOrEmpty(domainUserName))
                    {
                        domainUserName = "spf\\pmsadmin";
                    }
                    if(string.IsNullOrEmpty(domainKey))
                    {
                        domainKey = "Welcome123";
                    }
                }
                */

                _auditService.LogAudit(SourceAudit, "Domain User Name: " + domainUserName + "Domain Key: " + domainKey);

                try
                {
                    using (var domainContext = new PrincipalContext(ContextType.Domain, ADServer, ADDomainConnection, domainUserName, domainKey))
                    {
                        using (var ADUser = UserPrincipal.FindByIdentity(domainContext, IdentityType.SamAccountName, username))
                        {
                            if (ADUser != null)
                            {
                                boolExist = true;
                                _auditService.LogAudit(SourceAudit, "AD User : " + username + " found");
                            }
                            else
                            {
                                _auditService.LogAudit(SourceAudit, "AD User : " + username + " not found");
                            }
                        }
                    }
                }
                catch(Exception e)
                {
                    _auditService.LogAudit(SourceAudit, "Exception in AD Authentication : " + e.Message.ToString());
                }
            }
            else
            {
                _auditService.LogAudit(SourceAudit, "Incomplete AD Configuration information. Unable to verify user with AD");
                boolExist = false;
            }

            return boolExist;
        }

        private bool isErrorUserViewModelGroup(UserViewModel _userViewModel, bool IsAddUser)
        {
            if (_userViewModel.User.ad_account == null || _userViewModel.User.display_name == null)
            {
                if (_userViewModel.User.ad_account == null)
                {
                    ModelState.AddModelError(string.Empty, "Please enter the Username.");
                }
                if (_userViewModel.User.display_name == null)
                {
                    ModelState.AddModelError(string.Empty, "Please enter the Display Name.");
                }
                return true;
            }
            else if (!doesUserExistInActiveDirectory(_userViewModel.User.ad_account))
            {
                ModelState.AddModelError(string.Empty, "Username " + _userViewModel.User.ad_account + " does not exist in the Active Directory.");
                return true;
            }
            else 
            {
                if(IsAddUser)
                {
                    var _existingActiveUser = _unitOfWork.UserRepository.Find(u => u.ad_account.Equals(_userViewModel.User.ad_account) &&
                    u.delete_flag == false);

                    if (_existingActiveUser != null && _existingActiveUser.Any())
                    {
                        ModelState.AddModelError(string.Empty, "Username " + _userViewModel.User.ad_account + " already exists in SPOTS.");
                        return true;
                    }
                } 
            }

            return false;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_ADD_USER_ACCOUNT)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddUser(UserViewModel _userViewModel)
        {
            ViewBag.Title = "USER MAINTENANCE";

            try
            {

                if (ModelState.IsValid)
                {
                    _userViewModel.AllGroups = _unitOfWork.GroupRepository.GetActiveGroup();

                    if (isErrorUserViewModelGroup(_userViewModel, true))
                    {
                        return PartialView(_userViewModel);
                    }
                    else
                    {
                        // get the max user_id in table user
                        _userViewModel.User.user_id = (int)_unitOfWork.UserRepository.GetMaxID() + 1;

                        // TODO: Need to access the actual source/DB for the following user information
                        _userViewModel.User.email = _userViewModel.User.ad_account.ToString() + "@email.com";
                        _userViewModel.User.rank = "RANK_" + _userViewModel.User.user_id.ToString();
                        _userViewModel.User.department = "TP";
                        _userViewModel.User.created_by = 1;
                        _userViewModel.User.created_time = DateTime.Now;
                        _userViewModel.User.delete_flag = false;

                        _unitOfWork.UserRepository.Add(_userViewModel.User);

                        if (_userViewModel.groupListCheckbox != null)
                        {
                            // add user group
                            foreach (var _group in _userViewModel.groupListCheckbox)
                            {
                                var _userGroup = new user_group();
                                _userGroup.user_id = _userViewModel.User.user_id;
                                _userGroup.group_id = _group;
                                _unitOfWork.UserGroupRepository.Add(_userGroup);
                            }
                        }

                        _unitOfWork.Complete();

                        _auditService.LogAudit(SourceAudit, "User " + _userViewModel.User.ad_account + " created successfully in SPOTS");
                        
                        return Json(new { success = true, msg = "Success" });
                    }
                }
                else
                {
                    return Json(new { success = true, msg = "Failed" });
                }
            }
            catch(Exception e)
            {
                _auditService.LogAudit(SourceAudit, "Exception during AddUser " + e.ToString());
                return Json(new { success = true, msg = "Failed" });
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_VIEW_USER_GROUP)]
        public ActionResult GetGroupList()
        {
            ViewBag.Title = "GROUP MAINTENANCE";

            var userAction = "Viewed Group List";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);


            var groupList = _unitOfWork.GroupRepository.GetActiveGroup();
            var groupViewModel = new ListGroupViewModel
            {
                GroupList = groupList
            };
            return View(groupViewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_ADD_USER_GROUP )]
        public ActionResult AddGroup()
        {
            ViewBag.Title = "USER MAINTENANCE";

            var userAction = "Viewed Add Group";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var group = new group();
            var allAccessRigths = _unitOfWork.AccessRightsRepository.GetAll();

            var groupViewModel = new GroupViewModel
            {
                Group = group,
                AllAccessRights = allAccessRigths
            };

            return View(groupViewModel);
        }

        private bool isErrorGroupViewModel(GroupViewModel _groupViewModel)
        {
            // check compulsory fields
            if (_groupViewModel.Group.group_name == null || _groupViewModel.Group.group_description == null)
            {
                if (_groupViewModel.Group.group_name == null)
                {
                    ModelState.AddModelError(string.Empty, "Please enter the group name.");
                }
                if (_groupViewModel.Group.group_description == null)
                {
                    ModelState.AddModelError(string.Empty, "Please enter the group description.");
                }

                return true;
            }

            // check if the group exists
            var _existingGroup = _unitOfWork.GroupRepository.Find(g => g.group_name.Equals(_groupViewModel.Group.group_name)
                && g.group_id != _groupViewModel.Group.group_id);
            if (_existingGroup.ToArray().Count() > 0)
            {
                ModelState.AddModelError(string.Empty, "The group exists. Please enter a different group name.");
                return true;
            }
            return false;
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_ADD_USER_GROUP)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddGroup(GroupViewModel _groupViewModel)
        {
            ViewBag.Title = "GROUP MAINTENANCE";
            if (ModelState.IsValid)
            {
                try
                {
                    // retain the view model value when error occur
                    _groupViewModel.AllAccessRights = _unitOfWork.AccessRightsRepository.GetAll();

                    // check compulsory and if the group exists                
                    if (isErrorGroupViewModel(_groupViewModel))
                    {
                        return View(_groupViewModel);
                    }

                    // get the next identity number for group_id
                    _groupViewModel.Group.group_id = (int)_unitOfWork.GroupRepository.GetMaxID() + 1;
                    _groupViewModel.Group.created_by = _generalUtilityHelper.GetCurrentLoginUserNameUserId(User);
                    _groupViewModel.Group.created_time = DateTime.Now;
                    _groupViewModel.Group.delete_flag = false;

                    _unitOfWork.GroupRepository.Add(_groupViewModel.Group);

                    if (_groupViewModel.accessRightsListCheckbox != null)
                    {
                        foreach (var _access in _groupViewModel.accessRightsListCheckbox)
                        {
                            var _groupAccess = new group_access();
                            _groupAccess.group = _groupViewModel.Group.group_id;
                            _groupAccess.access_id = _access;
                            _unitOfWork.GroupAccessRepository.Add(_groupAccess);
                        }
                        _unitOfWork.Complete();

                        var userAction = "Add Group: " + _groupViewModel.Group.group_name + " | " + _groupViewModel.Group.group_description;
                        _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                        _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                        return RedirectToAction("GetGroupList");
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Please select at least one Group Function.");
                        return View(_groupViewModel);
                    }
                }
                catch(Exception ex)
                {
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                    return PartialView("Error", new HandleErrorInfo(ex, "UserAdmin", "AddGroup"));
                }                       
                
            }

            return View(_groupViewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_EDIT_USER_GROUP)]
        public ActionResult EditGroup(int groupId)
        {

            var userAction = "Viewed Edit Group";
            _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
            _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

            var group = _unitOfWork.GroupRepository.Get(groupId);
            var allAccessRigths = _unitOfWork.AccessRightsRepository.GetAll();
            var selectedAccessRights = _unitOfWork.GroupAccessRepository.Find( g => g.group == groupId);

            var groupViewModel = new GroupViewModel
            {
                Group = group,
                AllAccessRights = allAccessRigths,
                ExistingAccessRights = selectedAccessRights
            };

            return View(groupViewModel);
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_EDIT_USER_GROUP)]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditGroup(GroupViewModel _groupViewModel)
        {
            try
            {
                ViewBag.Title = "GROUP MAINTENANCE";
                if (ModelState.IsValid)
                {
                    // retain the view model value when error occur
                    _groupViewModel.AllAccessRights = _unitOfWork.AccessRightsRepository.GetAll();
                    _groupViewModel.ExistingAccessRights = _unitOfWork.GroupAccessRepository.Find(g => g.group == _groupViewModel.Group.group_id);

                    // check compulsory and if the group exists
                    if (isErrorGroupViewModel( _groupViewModel))
                    {
                        return View(_groupViewModel);
                    }

                    var existingGroup = _unitOfWork.GroupRepository.Get(_groupViewModel.Group.group_id);
                    existingGroup.group_name = _groupViewModel.Group.group_name;
                    existingGroup.group_description = _groupViewModel.Group.group_description;
                    existingGroup.modified_by = _generalUtilityHelper.GetCurrentLoginUserNameUserId(User);
                    existingGroup.modified_time = DateTime.Now;
                    existingGroup.delete_flag = false;

                    //delete existing access rights 
                    var _groupAccessList = _unitOfWork.GroupAccessRepository.Find(g => g.group == _groupViewModel.Group.group_id);
                    _unitOfWork.GroupAccessRepository.RemoveRange(_groupAccessList);

                    if (_groupViewModel.accessRightsListCheckbox == null)
                    {
                        ModelState.AddModelError(string.Empty, "Please select at least one Group Function.");
                        _groupViewModel.AllAccessRights = _unitOfWork.AccessRightsRepository.GetAll();
                        return View(_groupViewModel);
                    }

                    //add newly checked access rights
                    foreach (var _access in _groupViewModel.accessRightsListCheckbox)
                    {
                        var _groupAccess = new group_access();
                        _groupAccess.group = _groupViewModel.Group.group_id;
                        _groupAccess.access_id = _access;
                        _unitOfWork.GroupAccessRepository.Add(_groupAccess);
                    }

                    _unitOfWork.Complete();

                    var userAction = "Edit Group: " + _groupViewModel.Group.group_name + " | " + _groupViewModel.Group.group_description;
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                    return RedirectToAction("GetGroupList");

                } else
                {
                    return View(_groupViewModel);
                }

            }
            catch (Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "UserAdmin", "EditGroup"));
            }
        }

        [CustomAuthorize(AllowAccess = SpotsConstant.CAN_DELETE_USER_GROUP)]
        public ActionResult DeleteGroup(int groupID)
        {
            ViewBag.Title = "GROUP MAINTENANCE";

            try
            {
                var _group = _unitOfWork.GroupRepository.Get(groupID);
                if (_group != null)
                {
                    _group.modified_time = DateTime.Now;
                    _group.delete_flag = true;
                    _unitOfWork.Complete();

                    var userAction = "Delete Group ID: " + groupID;
                    _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + userAction);
                    _auditService.LogUserActionToDB(_generalUtilityHelper.GetCurrentLoginUserName(User), SpotsConstant.AdminPortalType, userAction, string.Empty, string.Empty);

                }

                return RedirectToAction("GetGroupList");
            }
            catch(Exception ex)
            {
                _auditService.LogAudit(SourceAudit, _generalUtilityHelper.GetCurrentLoginUserName(User) + ":" + ex.ToString());
                return PartialView("Error", new HandleErrorInfo(ex, "UserAdmin", "DeleteGroup"));
            }
        }
    }
}
