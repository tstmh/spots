using System;
using System.Collections.Generic;
using SPOTS_Repository.Models;
using System.Web.Mvc;

namespace SPOTSAdminModule.ViewModels
{
    public class SummonsStatisticsViewModel
    {
        public DateTime GeneratedDateTime { get; set; }
        public List<SummonsStatistics> SummonsStatisticsReport { get; set; }
        public SearchModel SearchModel { get; set; }
        public string SearchParameterString { get; set; }
        public string ReportGeneratedBy { get; set; }
    }
}