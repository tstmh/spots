using System;
using System.Collections.Generic;
using SPOTS_Repository.Models;
using SPOTSAdminModule.Utility;

namespace SPOTSAdminModule.ViewModels
{
    public class ListAccidentReportViewModel
    {
        public DateTime GeneratedDateTime { get; set; }
        public string SearchParameterString { get; set; }
        public List<OnSceneInvestigationReportsEnquiry> AccidentReportsList { get; set; }
        public List<AccidentReportStatistics> AccidentReportStatisticList { get; set; }
        public SearchModel SearchModel { get; set; }
        public string IncidentReportNumber { get; set; }
        public string IOExtensionNumber { get; set; }
        public string IOName { get; set; }
        public string IncidentOccurred { get; set; }
        public string Road1Name { get; set; }
        public string Road2Name { get; set; }
        public string LocationRemarks { get; set; }
        public List<OnSceneInvestigationReportsEnquiry> VehicleList { get; set; }
        public string StructureDamage { get; set; }
        public string Weather { get; set; }
        public string RoadSurface { get; set; }
        public string TrafficVolume { get; set; }
        public bool IsShowPrintButton { get; set; }
        public string OfficerNRIC { get; set; }
        public string OfficerRank { get; set; }
        public string OfficerName { get; set; }
        public DateTime? OfficerDeclarationTime { get; set; }
        public string OfficerTeam { get; set; }
        public DateTime? PreserveDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool IsShowPreserveSceneSection { get; set; }
        public DateTime? OfficerArrivalTime { get; set; }
        public DateTime? OfficerResumeDutyTime { get; set; }
        public string ReportGeneratedBy { get; set; }
        public string CreatedByDisplayName { get; set; }
        public string CreatedByNric { get; set; }
        public DateTime? AccidentTime { get; set; }
        public string CreatedByAdAccount { get; set; }
        public string SpecialZone { get; set; }
        public string SchoolName { get; set; }
        public bool IsShowOSIFirstPOForm { get; set; }
        public bool IsShowOSIImages { get; set; }

        public ListAccidentReportViewModel()
        {
            SearchParameterString = string.Empty;
            IncidentReportNumber = string.Empty;
            IOExtensionNumber = string.Empty;
            IOName = string.Empty;
            IncidentOccurred = string.Empty;
            Road1Name = string.Empty;
            Road2Name = string.Empty;
            LocationRemarks = string.Empty;
            StructureDamage = string.Empty;
            AccidentReportsList = new List<OnSceneInvestigationReportsEnquiry>();
            AccidentReportStatisticList = new List<AccidentReportStatistics>();
            VehicleList = new List<OnSceneInvestigationReportsEnquiry>();
            SearchModel = new SearchModel();
            Weather = string.Empty;
            RoadSurface = string.Empty;
            TrafficVolume = string.Empty;
            IsShowPrintButton = true;
            OfficerNRIC = string.Empty;
            OfficerRank = string.Empty;
            OfficerName = string.Empty;
            OfficerDeclarationTime = null;
            OfficerTeam = string.Empty;
            PreserveDate = null;
            CreatedBy = string.Empty;
            IsShowPreserveSceneSection = true;
            OfficerArrivalTime = null;
            OfficerResumeDutyTime = null;
            CreatedByDisplayName = string.Empty;
            CreatedByNric = string.Empty;
            AccidentTime = null;
            CreatedByAdAccount = string.Empty;
            SpecialZone = string.Empty;
            SchoolName = string.Empty;
            IsShowOSIFirstPOForm = true;
            IsShowOSIImages = true;
        }

    }

}