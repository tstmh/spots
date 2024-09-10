using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPOTSMobileApi.Models
{
    public class Summon
    {
        public int Id { get; set; }
        public string SpotsId { get; set; }
        public string DeviceId { get; set; }
        public int OfficerId { get; set; }
        public int StatusId { get; set; }
        public short Type { get; set; }
        public string CreatedAt { get; set; }
        public string IncidentOccured { get; set; }
        public string LocationCode { get; set; }
        public string LocationCode2 { get; set; }
        public Nullable<short> SpecialZone { get; set; }
        public string RemarksLocation { get; set; }
        public string SchoolName { get; set; }

    }
}