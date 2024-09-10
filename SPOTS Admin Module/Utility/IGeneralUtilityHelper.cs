using SPOTS_Repository.Models;
using System.Collections.Generic;
using System.Security.Principal;

namespace SPOTSAdminModule.Utility
{
    public interface IGeneralUtilityHelper
    {
        string FormatIncidentLocation(string incidentOccured, string timsLocation1, string timsLocation2);       
        string ConvertOffenderTypeIntoString(string OffenderType);        
        IEnumerable<OnSceneInvestigationReportsEnquiry> UpdateTimsFormattedLocation(IEnumerable<OnSceneInvestigationReportsEnquiry> accidentReportsList);
        string GetCurrentLoginUserName(IPrincipal user);
        string GetSearchParameters(SearchModel searchModel);
        int GetCurrentLoginUserNameUserId(IPrincipal user);
    }
}
