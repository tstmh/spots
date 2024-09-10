using System.Collections.Generic;
using SPOTS_Repository;


namespace SPOTSAdminModule.ViewModels
{
    public class GroupViewModel
    {
        public group Group { get; set; }
        public IEnumerable<access_rights> AllAccessRights { get; set; }

        public IEnumerable<group_access> ExistingAccessRights { get; set; }

        public List<int> accessRightsListCheckbox { get; set;  }
    }
}