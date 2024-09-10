using System.Collections.Generic;
using SPOTS_Repository;


namespace SPOTSAdminModule.ViewModels
{
    public class ListUserViewModel
    {
        public IEnumerable<UserViewModel> UserList { get; set; }
    }
}