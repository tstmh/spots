using System.Collections.Generic;
using System.Web.Mvc;
using SPOTS_Repository;
using SPOTS_Repository.Models;
using System.Linq;
using System.Data.Entity;
using System;
using System.Web;


namespace SPOTSAdminModule.ViewModels
{
    public class ListSystemCodeViewModel
    { 

        public IEnumerable<system_code> SystemCodeList { get; set; }
        public IEnumerable<tims_country_code> TIMSCountryCodeList { get; set; }
        public IEnumerable<tims_location_code> TIMSLocationCodeList { get; set; }
        public IEnumerable<tims_nationality_code> TIMSNationalityCodeList { get; set; }
        public IEnumerable<tims_offence_code> TIMSOffenceCodeList { get; set; }
        public IEnumerable<tims_vehicle_make> TIMSVehicleMakeList { get; set; }
        public IEnumerable<tims_vehicle_type> TIMSVehicleTypeList { get; set; }
    }
}