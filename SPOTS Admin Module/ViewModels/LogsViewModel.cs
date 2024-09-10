using System.Collections.Generic;
using System.Web.Mvc;
using SPOTS_Repository.Models;

namespace SPOTSAdminModule.ViewModels
{
    public class LogsViewModel
    {
        public SelectList ApplicationTypeSelectList { get; set; }
        public IEnumerable<SystemLogs> SystemLogsList { get; set; }
        public SearchModel SearchModel { get; set; }
    }
}