// const moment          = require('moment');
const postgresQueries = require('./postgresQueries.js');
const dbQueries       = require('./dbQueries.js');

const UNMATCHED_DRIVERS_ROUTE = 'unmatched-drivers';
const DRIVER_ROUTE            = 'driver';
const RIDER_ROUTE             = 'rider';
const HELPER_ROUTE                  = 'helper';
const CANCEL_RIDE_REQUEST_ROUTE = 'cancel-ride-request';
const DELETE_DRIVER_ROUTE           = 'driver';
const PUT_RIDER_ROUTE               = 'rider';
const PUT_DRIVER_ROUTE              = 'driver';

var rfPool = undefined;

// NOTE: module.exports at bottom of file

function setPool(pool) {
  rfPool = pool;
}

function getAnon (req, reply) {
  var results = {
    success: 'GET carpool: ',
    failure: 'GET error: ' 
  };

  req.log();

  postgresQueries.dbGetData(rfPool, dbQueries.dbGetQueryString, reply, results);
}

function logPostDriver (req) {
  var payload = req.payload;

    console.log("driver radius1 : " + payload.DriverCollectionRadius);
    sanitiseDriver(payload);
    console.log("driver radius2 : " + payload.DriverCollectionRadius);

    console.log("driver payload: " + JSON.stringify(payload, null, 4));
    console.log("driver zip: " + payload.DriverCollectionZIP);

    req.log();
}

var postDriver = 
  createPostFn 
  (DRIVER_ROUTE, 
    dbQueries.dbGetInsertDriverString, 
    getDriverPayloadAsArray, logPostDriver);

// function cancelRideRequest (req, reply) {
//       var payload = req.payload;
//       var results = getExecResultStrings('cancel ride request: ');


//         if (req === undefined) {
//     console.log("cancelRideRequest: no req");
//   }
//   else {
//     // console.log("cancelRideRequest req: ", req);    
//   }

//   if (payload === undefined) {
//     console.log("cancelRideRequest: no payload");
//   }
//   else {
//     console.log("cancelRideRequest payload: ", payload);    
//   }

//   if (payload.UUID === undefined) {
//     console.log("cancelRideRequest: no payload UUID");
//   }

//   if (payload.RiderPhone === undefined) {
//     console.log("cancelRideRequest: no payload RiderPhone");
//   }



//       console.log("cancelRideRequest-payload xx: ", payload);

//       req.log();

//       console.log('cancel ride request: ' + JSON.stringify(payload, null, 4));

//       postgresQueries.dbExecuteFunction
//         (payload, rfPool, dbQueries.dbCancelRideRequestFunctionString, getCancelConfirmPayloadAsArray, req, reply, results);
// }

// function postDriver (req, reply) {
//     var payload = req.payload;
//     var results = getInsertResultStrings(DRIVER_ROUTE);

//     console.log("driver radius1 : " + payload.DriverCollectionRadius);
//     sanitiseDriver(payload);
//     console.log("driver radius2 : " + payload.DriverCollectionRadius);

//     console.log("driver payload: " + JSON.stringify(payload, null, 4));
//     console.log("driver zip: " + payload.DriverCollectionZIP);

//     req.log();

//     postgresQueries.dbInsertData(payload, rfPool, dbQueries.dbGetInsertDriverString, 
//                   getDriverPayloadAsArray,
//                   req, reply, results);
// }

function logPost (req) {
  req.log();
}

function createPostFn 
  (resultStringText: string, 
    dbQueryFn: any, payloadFn: any, logFn: any) {
  
  function postFn (req, reply) {
    var payload = req.payload;
    var results = getInsertResultStrings(resultStringText);

    if (logFn !== undefined) {
      logFn(req);
    } 
    else {
      logPost(req);
    }

    postgresQueries.dbInsertData(payload, rfPool, dbQueryFn, 
                  payloadFn,
                  req, reply, results);
  }

  return postFn; 
}

function logPostRider (req) {
    var payload = req.payload;

    console.log("rider state1 : " + payload.RiderVotingState);
    sanitiseRider(payload);
    console.log("rider state2 : " + payload.RiderVotingState);

    req.log();

    console.log("rider payload: " + JSON.stringify(payload, null, 4));
    console.log("rider zip: " + payload.RiderCollectionZIP);
}

var postRider = 
  createPostFn 
  (RIDER_ROUTE, 
    dbQueries.dbGetInsertRiderString, 
    getRiderPayloadAsArray, logPostRider);

// function postRiderx (req, reply) {
//     var payload = req.payload;
//     var results = getInsertResultStrings(RIDER_ROUTE);

//     console.log("rider state1 : " + payload.RiderVotingState);
//     sanitiseRider(payload);
//     console.log("rider state2 : " + payload.RiderVotingState);

//     req.log();

//     console.log("rider payload: " + JSON.stringify(payload, null, 4));
//     console.log("rider zip: " + payload.RiderCollectionZIP);

//     postgresQueries.dbInsertData(payload, rfPool, dbQueries.dbGetInsertRiderString, 
//                   getRiderPayloadAsArray,
//                   req, reply, results);
// }

function logPostHelper (req) {
  var payload = req.payload;

  req.log();

  console.log("helper payload: " + JSON.stringify(payload, null, 4));
}

var postHelper = 
  createPostFn 
  (HELPER_ROUTE, 
    dbQueries.dbGetInsertHelperString, 
    getHelperPayloadAsArray, logPostHelper);

// function postHelper (req, reply) {
//     var payload = req.payload;
//     var results = getInsertResultStrings(HELPER_ROUTE);

//     req.log();

//     console.log("helper payload: " + JSON.stringify(payload, null, 4));

//     postgresQueries.dbInsertData(payload, rfPool, dbQueries.dbGetInsertHelperString, 
//                   getHelperPayloadAsArray,
//                   req, reply, results);
// }

function getUnmatchedDrivers (req, reply) {
  var results = {
    success: 'GET unmatched drivers: ',
    failure: 'GET unmatched drivers error: ' 
  };

  req.log();

  postgresQueries.dbGetUnmatchedDrivers(rfPool, dbQueries.dbGetUnmatchedDriversQueryString, reply, results);
}

var cancelRideRequest = createConfirmCancelFn 
  ('cancel ride request: ', "get payload: ", 
    dbQueries.dbCancelRideRequestFunctionString, 
    // getCancelConfirmPayloadAsArray
    getCancelConfirmQueryAsArray
    );

 
  // ('cancel ride request: ', "get payload: ", 
  //   dbQueries.dbCancelRideRequestFunctionString, getCancelConfirmPayloadAsArray);



// function cancelRider (req, reply) {
//     var payload = req.payload;
//     var results = getExecResultStrings('cancel ride: ');

//     req.log();

//     console.log("delete payload: " + JSON.stringify(payload, null, 4));

//     postgresQueries.dbExecuteFunction(payload, pool, dbQueries.dbCancelRideFunctionString, 
//                       getCancelRidePayloadAsArray,
//                       req, reply, results);
// }

var cancelRideOffer = createConfirmCancelFn 
  ('cancel ride offer: ', "delete payload: ", dbQueries.dbCancelRideOfferFunctionString, getCancelRideOfferPayloadAsArray);

// function cancelRideOffer (req, reply) {
//     var payload = req.payload;
//     var results = getExecResultStrings('cancel ride offer: ');

//     req.log();

//     console.log("delete payload: " + JSON.stringify(payload, null, 4));

//     postgresQueries.dbExecuteFunction(payload, pool, dbQueries.dbCancelRideOfferFunctionString, 
//                       getCancelRideOfferPayloadAsArray,
//                       req, reply, results);
// }

var rejectRide = createConfirmCancelFn 
  ('reject ride: ', "reject payload: ", dbQueries.dbRejectRideFunctionString, getRejectRidePayloadAsArray);

var confirmRide = createConfirmCancelFn 
  ('confirm ride: ', "confirm payload: ", dbQueries.dbConfirmRideFunctionString, 'getConfirmRidePayloadAsArray');

// function rejectRide (req, reply) {
//     var payload = req.payload;
//     var results = getExecResultStrings('reject ride: ');

//     req.log();

//     console.log("reject payload: " + JSON.stringify(payload, null, 4));

//     postgresQueries.dbExecuteFunction(payload, pool, dbQueries.dbRejectRideFunctionString, 
//                       getRejectRidePayloadAsArray,
//                       req, reply, results);
// }

// function confirmRide (req, reply) {
//     var payload = req.payload;
//     var results = getExecResultStrings('confirm ride: ');

//     req.log();

//     console.log("confirm payload: " + JSON.stringify(payload, null, 4));

//     postgresQueries.dbExecuteFunction(payload, pool, dbQueries.dbConfirmRideFunctionString, 
//                       getConfirmRidePayloadAsArray,
//                       req, reply, results);
// }

function createConfirmCancelFn 
  (resultStringText: string, consoleText: string, dbQueryFn: any, payloadFn: any) {
  
  function execFn (req, reply) {
      // var payload = req.payload;
      var payload = req.query;
      
      var results = getExecResultStrings(resultStringText);

      console.log("createConfirmCancelFn-payload: ", payload);

      req.log();

      console.log(consoleText + JSON.stringify(payload, null, 4));

      postgresQueries.dbExecuteFunction
        (payload, rfPool, dbQueryFn, payloadFn, req, reply, results);
  }

  return execFn;
}

var getInsertResultStrings  = createResultStringFn(' row inserted', ' row insert failed'); 
var getExecResultStrings    = createResultStringFn(' fn called: ', ' fn call failed: '); 

function createResultStringFn (successText, failureText) {

  function getResultStrings (tableName) {
      var resultStrings = {
        success: ' xxx ' + successText,
        failure: ' ' + failureText 
      }

      resultStrings.success = tableName + resultStrings.success; 
      resultStrings.failure = tableName + resultStrings.failure; 

      return resultStrings;
  }

  return getResultStrings;
}

function getHelperPayloadAsArray (req, payload) {
  return [      
        payload.Name, payload.Email, payload.Capability
        // 1, moment().toISOString()
    ]
}

function getRiderPayloadAsArray (req, payload) {
  return [      
        req.info.remoteAddress, payload.RiderFirstName, payload.RiderLastName, payload.RiderEmail
      , payload.RiderPhone, payload.RiderVotingState
      , payload.RiderCollectionZIP, payload.RiderDropOffZIP, payload.AvailableRideTimesJSON
      , payload.TotalPartySize
      , (payload.TwoWayTripNeeded ? 'true' : 'false')
      , payload.RiderPreferredContactMethod
      , (payload.RiderIsVulnerable ? 'true' : 'false')
      , (payload.RiderWillNotTalkPolitics ? 'true' : 'false')
      , (payload.PleaseStayInTouch ? 'true' : 'false')
      , (payload.NeedWheelchair ? 'true' : 'false')
      , payload.RiderAccommodationNotes
      , (payload.RiderLegalConsent ? 'true' : 'false')
    ]
}

function getDriverPayloadAsArray (req, payload) {
  return [
        req.info.remoteAddress, payload.DriverCollectionZIP, payload.DriverCollectionRadius, payload.AvailableDriveTimesJSON
      , (payload.DriverCanLoadRiderWithWheelchair ? 'true'  : 'false')
      , payload.SeatCount
      , (payload.DriverHasInsurance ? 'true' : 'false')
      , payload.DriverFirstName, payload.DriverLastName
      , payload.DriverEmail, payload.DriverPhone
      , (payload.DrivingOnBehalfOfOrganization ? 'true' : 'false')
      , payload.DrivingOBOOrganizationName 
      , (payload.RidersCanSeeDriverDetails ? 'true' : 'false')
      , (payload.DriverWillNotTalkPolitics ? 'true' : 'false')
      , (payload.PleaseStayInTouch ? 'true' : 'false')
      , payload.DriverLicenceNumber 
    ]
}

// for all two param Rider fns
function getCancelConfirmPayloadAsArray (req, payload) {

  if (req === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no req");
  }

  if (payload === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload");
  }

  if (payload.UUID === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload UUID");
  }

  if (payload.RiderPhone === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload RiderPhone");
  }

  return [      
        payload.UUID, payload.RiderPhone
    ]
}

// for all two param Rider fns
function getCancelConfirmQueryAsArray (req, payload) {

  if (req === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no req");
  }

  if (payload === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload");
  }

  if (payload.UUID === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload UUID");
  }

  if (payload.RiderPhone === undefined) {
    console.log("getCancelConfirmPayloadAsArray: no payload RiderPhone");
  }

  return [      
        payload.UUID, payload.RiderPhone
    ]
}

function getRejectRidePayloadAsArray (req, payload) {
  return [
        payload.UUID, payload.RiderPhone
    ]
}

function getConfirmRidePayloadAsArray (req, payload) {
  return [
        payload.UUID, payload.RiderPhone
    ]
}

function getCancelRidePayloadAsArray (req, payload) {
  return [      
        payload.UUID, payload.RiderPhone
    ]
}

function getCancelRideOfferPayloadAsArray (req, payload) {
  return [
        payload.UUID, payload.DriverPhone
    ]
}

function sanitiseDriver (payload) {
  if (payload.DriverCollectionRadius === undefined ||
      payload.DriverCollectionRadius === "") {
    // console.log("santising...");
    payload.DriverCollectionRadius = 0;
  }    
}

function sanitiseRider (payload) {

  if (payload.RiderVotingState === undefined) {
    payload.RiderVotingState = "MO";
  }
}

module.exports = {
  getAnon: getAnon,
  postDriver: postDriver,
  postRider: postRider,
  postHelper: postHelper,
  getUnmatchedDrivers: getUnmatchedDrivers,
  cancelRideRequest: cancelRideRequest,
  cancelRideOffer: cancelRideOffer,
  rejectRide: rejectRide,
  confirmRide: confirmRide,
  UNMATCHED_DRIVERS_ROUTE: UNMATCHED_DRIVERS_ROUTE,
  DRIVER_ROUTE: DRIVER_ROUTE,
  RIDER_ROUTE: RIDER_ROUTE,
  HELPER_ROUTE: HELPER_ROUTE,
  CANCEL_RIDE_REQUEST_ROUTE: CANCEL_RIDE_REQUEST_ROUTE,
  DELETE_DRIVER_ROUTE: DELETE_DRIVER_ROUTE,
  PUT_RIDER_ROUTE: PUT_RIDER_ROUTE,
  PUT_DRIVER_ROUTE: PUT_DRIVER_ROUTE,
  setPool: setPool
}
