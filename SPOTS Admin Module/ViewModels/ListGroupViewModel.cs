using System.Collections.Generic;
using SPOTS_Repository;


namespace SPOTSAdminModule.ViewModels
{
    public class ListGroupViewModel
    {
        public IEnumerable<group> GroupList { get; set; }
    }
}