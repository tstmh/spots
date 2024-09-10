using SPOTS_Repository.Models;
using SPOTS_Repository.Services;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web.Mvc;

namespace SPOTSAdminModule.Utility
{
    public class GeneralUtilityHelper : Controller, IGeneralUtilityHelper
    {

        private readonly IUnitOfWork _unitofWork;

        public GeneralUtilityHelper(IUnitOfWork unitOfWork)
        {
            _unitofWork = unitOfWork;
        }

        // Format the Location string for View based on Incident Location
        public string FormatIncidentLocation(string incidentOccured, string timsLocation1, string timsLocation2)
        {
            var location = string.Empty;

            switch(incidentOccured)
            {
                case SpotsConstant.IncidentOccurredIndex1:
                   
                    location = string.Format(SpotsConstant.IncidentOccurred1, timsLocation1);
                    break;

                case SpotsConstant.IncidentOccurredIndex2:
                    // Junction of Road 1 and Road 2
                    location = string.Format(SpotsConstant.IncidentOccurred2, timsLocation1, timsLocation2);
                    break;

                case SpotsConstant.IncidentOccurredIndex3:
                    // Road 1 Slip onto Road 2
                    location = string.Format(SpotsConstant.IncidentOccurred3, timsLocation1, timsLocation2);
                    break;

                case SpotsConstant.IncidentOccurredIndex4:
                    //Along Road 1 Travelling Towards Road 2
                    location = string.Format(SpotsConstant.IncidentOccurred4, timsLocation1, timsLocation2);
                    break;

                default:
                    location = timsLocation1 + " " + timsLocation2;
                    break;

            }
          
            return location;
        }

        public string ConvertOffenderTypeIntoString(string OffenderType)
        {
            var offenderString = "";
            switch (OffenderType)
            {
                case SpotsConstant.PedalCyclistType:
                    offenderString = SpotsConstant.PedalCyclist;
                    break;
                case SpotsConstant.PedestrianType:
                    offenderString = SpotsConstant.Pedestrian;
                    break;
                case SpotsConstant.VehicleOwnerType:
                    offenderString = SpotsConstant.VehicleOwner;
                    break;
                case SpotsConstant.DriverMotoristType:
                    offenderString = SpotsConstant.DriverMotorist;
                    break;
                case SpotsConstant.OthersType:
                    offenderString = SpotsConstant.Others;
                    break;
                case SpotsConstant.FrontPassengerType:
                    offenderString = SpotsConstant.FrontPassenger;
                    break;
                case SpotsConstant.RearPassengerType:
                    offenderString = SpotsConstant.RearPassenger;
                    break;
                case SpotsConstant.PassengerType:
                    offenderString = SpotsConstant.Passenger;
                    break;
            }
            
            return offenderString;
        }

        public IEnumerable<OnSceneInvestigationReportsEnquiry> UpdateTimsFormattedLocation(IEnumerable<OnSceneInvestigationReportsEnquiry> accidentReportsList)
        {
            var formattedaccidentReportsList = new List<OnSceneInvestigationReportsEnquiry>();

            if (accidentReportsList != null)
            {
                // Update the Incident Location information
                foreach (OnSceneInvestigationReportsEnquiry tempReport in accidentReportsList)
                {
                    var timLocationCodeDesc1 = string.Empty;
                    var timLocationCodeDesc2 = string.Empty;

                    // Check whether tims_location_code_1 is available  
                    if (tempReport.TimsLocationCode != null && !string.IsNullOrEmpty(tempReport.TimsLocationCode.description))
                    {
                        timLocationCodeDesc1 = tempReport.TimsLocationCode.description;
                    }

                    // Check whether tims_location_code_2 is available  
                    if (tempReport.TimsLocationCode2 != null && !string.IsNullOrEmpty(tempReport.TimsLocationCode2.description))
                    {
                        timLocationCodeDesc2 = tempReport.TimsLocationCode2.description;
                    }

                    tempReport.TimsFormattedLocation = FormatIncidentLocation(tempReport.AccidentReport.incident_occured,
                     timLocationCodeDesc1, timLocationCodeDesc2).ToUpper();

                    // VDR Location

                    var timVDRLocationCodeDesc1 = string.Empty;
                    var timVDRLocationCodeDesc2 = string.Empty;

                    // Check whether TimsVDRLocationCode1 is available  
                    if (tempReport.TimsVDRLocationCode1 != null && !string.IsNullOrEmpty(tempReport.TimsVDRLocationCode1.description))
                    {
                        timVDRLocationCodeDesc1 = tempReport.TimsVDRLocationCode1.description;
                    }

                    // Check whether tims_location_code_2 is available  
                    if (tempReport.TimsVDRLocationCode2 != null && !string.IsNullOrEmpty(tempReport.TimsVDRLocationCode2.description))
                    {
                        timVDRLocationCodeDesc2 = tempReport.TimsVDRLocationCode2.description;
                    }

                    if(tempReport.VdrAccidentReport != null)
                    {
                        tempReport.TimsVDRFormattedLocation = FormatIncidentLocation(tempReport.VdrAccidentReport.incident_occured,
                                            timVDRLocationCodeDesc1, timVDRLocationCodeDesc2).ToUpper();
                    }
                }

                formattedaccidentReportsList = accidentReportsList.ToList();
            }

            return formattedaccidentReportsList;
        }

        public string GetCurrentLoginUserName(IPrincipal user)
        {
            var username = "<unknown>";
            
            if (user != null && user.Identity != null && !string.IsNullOrEmpty(user.Identity.Name))
            {
                username = user.Identity.Name;
            }

            return username;
        }

        public string GetSearchParameters(SearchModel searchModel)
        {
            const short applicationTypeCode = 30;
            const short summonsTypeCode = 29;
            string searchString = string.Empty;

            // System Code Type
            if(searchModel.SearchSystemCodeType.HasValue)
            {
                var systemCodeLookUpModel = _unitofWork.SystemCodeLookupRepository.GetSystemCodeLookUpByCode(searchModel.SearchSystemCodeType);

                if(systemCodeLookUpModel != null)
                {
                    searchString = "Code Type:" + systemCodeLookUpModel.description.ToString() + " | ";
                }
                else
                {
                    searchString = "Code Type:" + " null | ";
                        
                }

            }
            // SPOTS Code Description
            if(!string.IsNullOrEmpty(searchModel.SearchSPOTSCodeDescription))
            {
                searchString = searchString + "Code Description:" + searchModel.SearchSPOTSCodeDescription.ToString() + " | ";
            }
            // Date From
            if(searchModel.SearchFromDate.HasValue)
            {
                searchString = searchString + "Date From:" + searchModel.SearchFromDate.Value.ToShortDateString() + " | ";
            }
            // Time From
            if(searchModel.SearchFromTime.HasValue)
            {
                searchString = searchString + "Time From:" + searchModel.SearchFromTime.Value.ToShortTimeString() + " | ";
            }
            // Date To
            if (searchModel.SearchToDate .HasValue)
            {
                searchString = searchString + "Date To:" + searchModel.SearchToDate.Value.ToShortDateString() + " | ";
            }
            // Time To
            if (searchModel.SearchToTime.HasValue)
            {
                searchString = searchString + "Time To:" + searchModel.SearchToTime.Value.ToShortTimeString() + " | ";
            }
            // Application Type
            if (searchModel.SearchApplicationType.HasValue && searchModel.SearchApplicationType != 0)
            {
                var applicationType = _unitofWork.SystemCodeRepository.GetSystemCode(applicationTypeCode, searchModel.SearchApplicationType.Value).value.ToString();
                searchString = searchString + "Application Type:" + applicationType + " | ";
            }
            // User ID
            if(searchModel.SearchUserId.HasValue)
            {
                searchString = searchString + "User ID:" + searchModel.SearchUserId.ToString() + " | ";
            }
            // User Name
            if(!string.IsNullOrEmpty(searchModel.SearchUserName))
            {
                searchString = searchString + "User Name:" + searchModel.SearchUserName.ToString() + " | ";
            }
            // Transaction Description
            if(!string.IsNullOrEmpty(searchModel.SearchTransactionDescription))
            {
                searchString = searchString + "Transaction Description:" + searchModel.SearchTransactionDescription.ToString() + " | ";
            }
            // Device ID
            if(!string.IsNullOrEmpty(searchModel.SearchDeviceId))
            {
                searchString = searchString + "Device ID:" + searchModel.SearchDeviceId.ToString() + " | ";
            }
            // Officer ID
            if(!string.IsNullOrEmpty(searchModel.SearchOfficerId))
            {
                searchString = searchString + "Officer ID:" + searchModel.SearchOfficerId.ToString() + " | ";
            }
            // Officer Name
            if (!string.IsNullOrEmpty(searchModel.SearchOfficerName))
            {
                searchString = searchString + "Officer Name:" + searchModel.SearchOfficerName.ToString() + " | ";
            }
            // Offender Name
            if(!string.IsNullOrEmpty(searchModel.SearchOffenderName))
            {
                searchString = searchString + "Offender Name:" + searchModel.SearchOffenderName.ToString() + " | ";
            }
            // Offender ID
            if (!string.IsNullOrEmpty(searchModel.SearchOffenderId))
            {
                searchString = searchString + "Offender ID:" + searchModel.SearchOffenderId.ToString() + " | ";
            }
            // Vehicle ID
            if(!string.IsNullOrEmpty(searchModel.SearchVehicleId))
            {
                searchString = searchString + "Vehicle ID:" + searchModel.SearchVehicleId.ToString() + " | ";
            }
            // TIMS Report No
            if(!string.IsNullOrEmpty(searchModel.SearchTimsReport))
            {
                searchString = searchString + "Tims Report No:" + searchModel.SearchTimsReport.ToString() + " | ";
            }
            // Location
            if (!string.IsNullOrEmpty(searchModel.SearchLocation))
            {
                searchString = searchString + "Location:" + searchModel.SearchLocation.ToString() + " | ";
            }
            // Incident No
            if(!string.IsNullOrEmpty(searchModel.SearchIncidentNo))
            {
                searchString = searchString + "Incident No:" + searchModel.SearchIncidentNo.ToString() + " | ";
            }
            // Investigation Officer Name
            if(!string.IsNullOrEmpty(searchModel.SearchInvestigationOfficerName))
            {
                searchString = searchString + "Investigation Officer:" + searchModel.SearchInvestigationOfficerName.ToString() + " | ";
            }
            // Summons Type
            if (searchModel.SearchSummonsType.HasValue && searchModel.SearchSummonsType != 0)
            {
                var summonsType = _unitofWork.SystemCodeRepository.GetSystemCode(summonsTypeCode, searchModel.SearchSummonsType.Value).value.ToString();
                searchString = searchString + "Summons Type:" + summonsType + " | ";
            }
            // Offence Description
            if(!string.IsNullOrEmpty(searchModel.SearchOffenceDescription))
            {
                searchString = searchString + "Offence Description:" + searchModel.SearchOffenceDescription.ToString() + " | ";
            }

            return searchString;
        }

        public int GetCurrentLoginUserNameUserId(IPrincipal user)
        {
            var userId = 0;

            if(user != null)
            {
                var userName = GetCurrentLoginUserName(user);
                var userRepo = _unitofWork.UserRepository.SingleOrDefault(x => x.ad_account == userName);
                if(userRepo != null)
                {
                   userId = userRepo.user_id;
                }
            }

            return userId;
        }
    }
}

