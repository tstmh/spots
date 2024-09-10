using System.Web.Mvc;
using System.Collections.Generic;
using SPOTS_Repository;
using SPOTS_Repository.Models;



namespace SPOTSAdminModule.ViewModels
{
    public class SystemCodeViewModel
    { 
        public IEnumerable<system_code> SystemCodeList { get; set; }
        public IEnumerable<tims_country_code> TIMSCountryCodeList { get; set; }
        public IEnumerable<tims_location_code> TIMSLocationCodeList { get; set; }
        public IEnumerable<tims_nationality_code> TIMSNationalityCodeList { get; set; }
        public IEnumerable<ViewTIMSOffenceCode> TIMSOffenceCodeList { get; set; }
        public IEnumerable<tims_vehicle_make> TIMSVehicleMakeList { get; set; }
        public IEnumerable<tims_vehicle_type> TIMSVehicleTypeList { get; set; }
        public IEnumerable<tims_vehicle_color> TIMSVehicleColorList { get; set; }

        public SelectList SystemCodeSelectList { get; set; }
        public SelectList TIMSCodeSelectList { get; set; }
        public string PartialTableViewName { get; set; }
        public string SelectedCodeType { get; set; }
        public string SelectedCode { get; set; }
        public bool IsSelectedCodeTypeEditable { get; set; }
        public SearchModel SearchModel { get; set; }
        public string TIMSCodeTypeDescription { get; set; }
        public SystemCodeViewModel()
        {
            PartialTableViewName = "Tables/_TableSystemCodeResultView";
        }

    }
}