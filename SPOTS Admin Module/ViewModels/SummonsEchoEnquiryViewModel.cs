using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SPOTS_Repository.Models;


namespace SPOTSAdminModule.ViewModels
{
    public class SummonsEchoEnquiryViewModel
    {
        public IEnumerable<EnquirySummonsEcho> EnquirySummonsEchoList { get; set; }
        public SearchModel SearchModel { get; set; }
    }
}