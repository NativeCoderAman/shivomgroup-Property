import {combineReducers} from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import GetUserHostelSlice from '../slices/GetUserHostelSlice';
import getBasicRoomDetailsSlice from '../slices/getBasicRoomDetailsSlice';
import GetRoomsSlice from '../slices/GetRoomsSlice';
import RegisterSlice from '../slices/RegisterSlice';
import bookingSlice from '../slices/bookingSlice';
import saleSlice from '../slices/saleSlice';
import dashboardSlice from '../slices/dashboardSlice';
import bussinessRegisterSlice from '../slices/bussinessRegisterSlice';
import clientAuthSlice from '../slices/tenant/clientAuthSlice';
import employeeSlice from '../slices/employeeSlice';
import clientProfileSlice from '../slices/tenant/clientProfileSlice';
import clientComplaintSlice from '../slices/tenant/clientComplaintSlice';
import clientReferSlice from '../slices/tenant/clientReferSlice';
import subscriptionSlice from '../slices/subscriptionSlice';
import paymentSheetSlice from '../slices/tenant/paymentSheetSlice';
import permissionSlice from '../slices/permissionSlice';
import backupReducer from '../slices/backupSlice';
import profitlossReducer from '../slices/profitlossSlice';
import estimationReducer from '../slices/estimationSlice';
import salePartyReducer from '../slices/salePartySlice';

// kitchen master reducers
import attandanceReducer from '../slices/kitchenmaster/attandanceSlice';
import salaryReducer from '../slices/kitchenmaster/salarySlice';
import expenseNoteReducer from '../slices/kitchenmaster/expenseNoteSlice';

// Combine all reducers into one root reducer. This root reducer will be passed to the Redux store.
const rootReducer = combineReducers({
  // Reducers init
  auth: authSlice,
  hostelNames: GetUserHostelSlice,
  basicRoomDetails: getBasicRoomDetailsSlice,
  roomData: GetRoomsSlice,
  registerData: RegisterSlice,
  bookingData: bookingSlice,
  salesData: saleSlice,
  dashboardData: dashboardSlice,
  bussinessData: bussinessRegisterSlice,
  employeeData: employeeSlice,
  subscriptionData: subscriptionSlice,
  /* Client Section  */
  clientAuth: clientAuthSlice,
  clientProfileData: clientProfileSlice,
  clientComplaintData: clientComplaintSlice,
  clientReferData: clientReferSlice,
  autoPermission: permissionSlice,

  //tenant payment sheet //
  paymentSheet: paymentSheetSlice,

  //backup
  backupData: backupReducer,

  //profit loss
  profitData: profitlossReducer,

  //estimation
  estimationData: estimationReducer,
  salePartyData: salePartyReducer,

  //kitchen master reducers
  attandance: attandanceReducer,
  salary: salaryReducer,
  expenseNote: expenseNoteReducer
});

export default rootReducer;
