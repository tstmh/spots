using System;
using System.Collections.Generic;
using SPOTS_Repository.Models;
using System.Web.Mvc;

namespace SPOTSAdminModule.ViewModels
{
    public class SummonsReconciliationViewModel
    {
        public DateTime GeneratedDateTime { get; set; }
        public IEnumerable<AllSummons> SummonsReconciliationList { get; set; }
        public SearchModel SearchModel { get; set; }
        public string SearchParameterString { get; set; }
        public string ReportGeneratedBy { get; set; }
    }
}