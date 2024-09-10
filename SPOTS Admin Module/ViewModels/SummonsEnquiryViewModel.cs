using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SPOTS_Repository.Models;


namespace SPOTSAdminModule.ViewModels
{
    public class SummonsEnquiryViewModel
    {
        public IEnumerable<EnquirySummons> EnquirySummonsList { get; set; }
        public SearchModel SearchModel { get; set; }
        public ViewSummonsM401 RetrievedSummonsM401 { get; set; }
    }
}