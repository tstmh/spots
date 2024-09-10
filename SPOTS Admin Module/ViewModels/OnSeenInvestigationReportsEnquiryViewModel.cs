using System.Collections.Generic;
using SPOTS_Repository.Models;

namespace SPOTSAdminModule.ViewModels
{
    public class OnSceneInvestigationReportsEnquiryViewModel
    {
        public IEnumerable<OnSceneInvestigationReportsEnquiry> AccidentReportsList { get; set; }
        public SearchModel SearchModel { get; set; }
    }
}