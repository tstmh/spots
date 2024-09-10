
using SPOTS_Repository;
using SPOTSapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SPOTSapi.Controllers
{
    public class NP149Controller : ApiController
    {
        private SPOTS_OAEntities db = new SPOTS_OAEntities();
        private const string STATUS_SUCCESS = "S";
        private const string STATUS_FAIL = "F";

        [HttpPost]
        [ResponseType(typeof(NP149Response))]
        public async Task<IHttpActionResult> NP149(NP149Request osiRequest)
        {
            IHttpActionResult result = null;

            await Task.Run(() =>
            {
                result = getOSI(osiRequest);
            });

            return result;
        }

        protected IHttpActionResult getOSI(NP149Request osiRequest)
        {
            NP149Response resp = new NP149Response();

            string strStatus = "";

            //To validate the JSON format, mandatory fields, and field data type
            if (!ModelState.IsValid)
            {
                resp.statusCode = 'F';
                resp.errorCode = "001";
                resp.errorMessage = "Request payload is invalid.";
                //logErrorMessage(_commonService, errorResponse, errorMessage, intUserID, logRequest, inboxRequest, logTime, responseSentTime, strlogAction);
                return Ok(resp);
            }

            var osiList = db.spApiGetNP149(osiRequest.FIR).ToList<spApiGetNP149_Result>();

            if (osiList.Count == 0)
            {
                resp.statusCode = 'F';
                resp.errorCode = "001";
                resp.errorMessage = "FIR not found.";
                strStatus = STATUS_FAIL;
                //logErrorMessage(_commonService, errorResponse, errorMessage, intUserID, logRequest, inboxRequest, logTime, responseSentTime, strlogAction);
            }
            else
            {
                resp.statusCode = 'S';
                //logErrorMessage(_commonService, errorResponse, errorMessage, intUserID, logRequest, inboxRequest, logTime, responseSentTime, strlogAction);

                spApiGetNP149_Result firstOSI = osiList.First();

                resp.incident = new IncidentReport(firstOSI);

                // First PO Form --------------------------------------------------------------------------------
                resp.incident.firstPOForm = new FirstPOForm();

                // Location
                var locationList = db.spApiGetNP149Location(osiRequest.FIR).ToList<spApiGetNP149Location_Result>();
                resp.incident.firstPOForm.incidentLocation = new Location(locationList.First());

                // Vehicle(s) Involved
                var vehicleList = db.spApiGetNP149Vehicle(osiRequest.FIR).ToList<spApiGetNP149Vehicle_Result>();

                List<VehicleInvolved> _vehiclesInvolved = new List<VehicleInvolved>();
                foreach (var _vehicle in vehicleList)
                {

                    VehicleInvolved _vehicleInvolved = new VehicleInvolved(_vehicle);

                    // Vehicle Driver
                    var driverList = db.spApiGetNP149VehicleDriver(_vehicle.driverDbID).ToList<spApiGetNP149VehicleDriver_Result>();

                    if (driverList.Count > 0)
                    {
                        Driver _driver = new Driver(driverList.First());

                        // Driver's Identification
                        var driverIDList = db.spApiGetNP149VehicleDriverIdentity(_vehicle.driverDbID).ToList<spApiGetNP149VehicleDriverIdentity_Result>();
                        if (driverIDList.Count > 0)
                        {
                            _driver.identification = new DriverIdentification(driverIDList.First());
                        }

                        // Driver's Address
                        var driverAddressList = db.spApiGetNP149VehicleDriverAddress(_vehicle.driverDbID).ToList<spApiGetNP149VehicleDriverAddress_Result>();
                        if (driverAddressList.Count > 0)
                        {
                            _driver.address = new DriverAddress(driverAddressList.First());
                        }

                        // Driver's Injury Treatment
                        var driverTreatmentList = db.spApiGetNP149VehicleDriverTreatment(_vehicle.driverDbID).ToList<spApiGetNP149VehicleDriverTreatment_Result>();
                        if (driverTreatmentList.Count > 0)
                        {
                            _driver.treatment = new DriverInjuryTreatment(driverTreatmentList.First());
                        }

                        _vehicleInvolved.driver = _driver;
                    }


                    //_vehicleInvolved.passenger
                    var passengerList = db.spApiGetNP149VehiclePassenger(_vehicle.vehicleDbID).ToList<spApiGetNP149VehiclePassenger_Result>();
                    List<Passenger> _passengers = new List<Passenger>();
                    if (passengerList.Count > 0)
                    {

                        foreach (var _passenger in passengerList)
                        {
                            // Passenger Involvement
                            Passenger _thePassenger = new Passenger(_passenger);

                            // Passenger Identification
                            var passengerIDList = db.spApiGetNP149VehiclePassengerIdentity(_passenger.passengerDbId).ToList<spApiGetNP149VehiclePassengerIdentity_Result>();
                            if (passengerIDList.Count > 0)
                            {
                                _thePassenger.identification = new PassengerIdentification(passengerIDList.First());
                            }

                            // Passenger Address
                            var passengerAddressList = db.spApiGetNP149VehiclePassengerAddress(_passenger.passengerDbId).ToList<spApiGetNP149VehiclePassengerAddress_Result>();
                            if (passengerAddressList.Count > 0)
                            {
                                _thePassenger.address = new PassengerAddress(passengerAddressList.First());
                            }

                            // Passenger Treatment
                            var passengerTreatmentList = db.spApiGetNP149VehiclePassengerTreatment(_passenger.passengerDbId).ToList<spApiGetNP149VehiclePassengerTreatment_Result>();
                            if (passengerTreatmentList.Count > 0)
                            {
                                _thePassenger.treatment = new PassengerInjuryTreatment(passengerTreatmentList.First());
                            }

                            _thePassenger.passengerInvolved = _passenger.passengerInvolved;
                            _passengers.Add(_thePassenger);
                        }

                    }
                    _vehicleInvolved.passenger = _passengers;

                    _vehiclesInvolved.Add(_vehicleInvolved);
                }

                resp.incident.firstPOForm.vehicleInvolved = _vehiclesInvolved;

                // Pedestrian
                List<PedestrianOrWitness> _pedestrianList = new List<PedestrianOrWitness>();

                // Pedestrian Identity
                var pedestrianIDList = db.spApiGetNP149PedestrianOrWitnessIdentity(osiRequest.FIR, 1).ToList<spApiGetNP149PedestrianOrWitnessIdentity_Result>();
                if (pedestrianIDList.Count > 0)
                {
                    foreach (var _id in pedestrianIDList)
                    {
                        PedestrianOrWitness _pedestrian = new PedestrianOrWitness();

                        PedestrianOrWitnessIdentification _pedestrianID = new PedestrianOrWitnessIdentification(_id);
                        _pedestrian.identification = _pedestrianID;

                        // Pedestrian Address
                        var pedestrianAddressList = db.spApiGetNP149PedestrianOrWitnessAddress(_id.personDbID).ToList<spApiGetNP149PedestrianOrWitnessAddress_Result>();
                        if (pedestrianAddressList.Count > 0)
                        {
                            _pedestrian.address = new PedestrianOrWitnessAddress(pedestrianAddressList.First());
                        }

                        // Pedestrian Injury Treatment         
                        _pedestrianList.Add(_pedestrian);

                    }
                    
                }
                resp.incident.firstPOForm.pedestrianInvolved = _pedestrianList;

                // Witness
                List<PedestrianOrWitness> _witnessList = new List<PedestrianOrWitness>();

                var witnessIDList = db.spApiGetNP149PedestrianOrWitnessIdentity(osiRequest.FIR, 2).ToList<spApiGetNP149PedestrianOrWitnessIdentity_Result>();
                if (witnessIDList.Count > 0)
                {
                    foreach (var _id in witnessIDList)
                    {
                        PedestrianOrWitness _witness = new PedestrianOrWitness();

                        // Witness Identity
                        PedestrianOrWitnessIdentification _witnessID = new PedestrianOrWitnessIdentification(_id);
                        _witness.identification = _witnessID;

                        // Witness Address
                        var witnessAddressList = db.spApiGetNP149PedestrianOrWitnessAddress(_id.personDbID).ToList<spApiGetNP149PedestrianOrWitnessAddress_Result>();
                        if (witnessAddressList.Count > 0)
                        {
                            _witness.address = new PedestrianOrWitnessAddress(witnessAddressList.First());
                        }

                        // Witness DON'T have injury treatment section


                        _witnessList.Add(_witness);

                    }

                }
                resp.incident.firstPOForm.witness = _witnessList;

                // First PO Form structure damages
                var structureDamageList = db.spApiGetNP149FirstPOForm(osiRequest.FIR).ToList<spApiGetNP149FirstPOForm_Result>();
                resp.incident.firstPOForm.structureDamage = structureDamageList.First().structureDamage;

                // Office Declaration
                var declarationList = db.spApiGetNP149Declaration(osiRequest.FIR).ToList<spApiGetNP149Declaration_Result>();
                resp.incident.firstPOForm.officerDeclaration = new OfficerDeclaration(declarationList.First());

                strStatus = STATUS_SUCCESS;
            }

            // to write request and the response to API_REQUEST table
            string apiRequest = JsonConvert.SerializeObject(osiRequest, Formatting.Indented);
            string apiResponse = JsonConvert.SerializeObject(resp, Formatting.Indented);

            //string apiResponse = JsonConvert.SerializeObject(resp, Newtonsoft.Json.Formatting.None, 
            //    new JsonSerializerSettings
            //    {
            //        NullValueHandling = NullValueHandling.Ignore
            //    });


            db.spReceiveNP149ApiRequest(apiRequest, apiResponse,strStatus);

            // removal of driverDbID

            return Ok(resp);
        }
    }
}