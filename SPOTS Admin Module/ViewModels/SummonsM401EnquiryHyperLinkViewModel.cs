using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SPOTS_Repository.Models;


namespace SPOTSAdminModule.ViewModels
{
    public class SummonsM401EnquiryHyperLinkViewModel
    {
        public ViewSummonsM401 RetrievedSummonsM401 { get; set; }
        public bool IsShowPrintButton { get; set; }
    }
}