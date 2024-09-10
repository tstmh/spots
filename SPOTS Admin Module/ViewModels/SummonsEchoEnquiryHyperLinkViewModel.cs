using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SPOTS_Repository.Models;


namespace SPOTSAdminModule.ViewModels
{
    public class SummonsEchoEnquiryHyperLinkViewModel
    {
        public ViewSummonsEcho RetrievedSummonsEcho { get; set; }
        public bool IsShowPrintButton { get; set; }
    }
}