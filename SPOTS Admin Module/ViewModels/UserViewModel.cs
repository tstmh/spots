using System.Collections.Generic;
using SPOTS_Repository;


namespace SPOTSAdminModule.ViewModels
{
    public class UserViewModel
    {
        public user User { get; set; }
        public IEnumerable<user_group> GroupList { get; set; }
        public string UserGroupListText { get; set; }
        public IEnumerable<group> AllGroups { get; set; }

        public List<int> groupListCheckbox { get; set; }
    }
}