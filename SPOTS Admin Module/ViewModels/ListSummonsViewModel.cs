using System;
using System.Collections.Generic;
using SPOTS_Repository.Models;
using System.Web.Mvc;

namespace SPOTSAdminModule.ViewModels
{
    public class ListSummonsViewModel
    {
        public DateTime GeneratedDateTime { get; set; }
        public IEnumerable<AllSummons> SummonsReportsList { get; set; }
        public SearchModel SearchModel { get; set; }
        public SelectList ApplicationTypeSelectList { get; set; }
        public string SearchParameterString { get; set; }
        public string ReportGeneratedBy { get; set; }
    }
}