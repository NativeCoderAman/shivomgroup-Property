import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteData, fetchData, getPropertyAPI, postData, putData,updatePropertyAPI, getRoomsAPI, getRoomByIdAPI ,updateRoomAPI, EditRoomApi } from './apis';
import {
  SalarySetupRecord_Api,
  addAttendance_Api,
  addEmployee_Api,
  addMenuImage_Api,
  addNewLead_Api,
  addNewUserRoll_Api,
  addStudentBooking_Api,
  addSubscriptionPlan_Api,
  addTermsAndConditions_Api,
  businessRegister_Api,
  changeUserPassword_Api,
  checkStudentPasswordIsCreatedOrNot_Api,
  compaintGraphCategoryData_Api,
  complainBoardGraphData_Api,
  createComplaint_Api,
  createCustomSales_Api,
  createEmpSalaryRecords_Api,
  createMenuItems_Api,
  createMenu_Api,
  createNewSaleItems_Api,
  createNoticeRequest_Api,
  createOrUpdateMenuTimer_Api,
  createPaymentInInvoice_Api,
  createPaymentSetup_Api,
  createReferAndEarnSetup_Api,
  createSale_Api,
  createStudentPassword_Api,
  dashboradGraphDate_Api,
  deleteAttendance_Api,
  deleteCustomeSale_Api,
  deleteEmpSalaryRecords_Api,
  deleteEmployes_Api,
  deleteMainSale_Api,
  deleteMenuImage_Api,
  deleteMenuItem_Api,
  deleteSalesItme_Api,
  deleteStudentBooking_Api,
  deleteTenanatNotice_Api,
  deleteTermsAndConditions_Api,
  deletelead_Api,
  downloadElectricityReport_Api,
  electricityView_Api,
  empAttendacesRecords_Api,
  expenseGraphData_Api,
  expensesGraphWithCategoryName_Api,
  filterSubscriptionDetails_Api,
  filterexpensesCetegorys_Api,
  generateSalesReport_Api,
  generateUniqueEmpFormNo_Api,
  genrateCustomSaleInvoice_Api,
  genrateExpenseReport_Api,
  genrateSaleInvoice_Api,
  getAllBillDetails_Api,
  getAllPermission_Api,
  getAppRefers_Api,
  getBusinessProfileData_Api,
  getBusinessProfileDocumets_Api,
  getComplaintOfStudent_Api,
  getComplaints_Api,
  getCreatedMenuMonthDate_Api,
  getCustomSaleData_Api,
  getDashboardBoxData_Api,
  getElectricityBillRecordsForStudent_Api_Api,
  getElectricityForStoreBill_Api,
  getEmpAttendace_Api,
  getEmpSalaryByMonth_Api,
  getEmpTotalAttendace_Api,
  getEmployes_Api,
  getHostelRefers_Api,
  getInvoiceTermsAndCondtions_Api,
  getItemCode_Api,
  getLatestInvoiceNo_Api,
  getMealTypes_Api,
  getMenuImagesData_Api,
  getMenuTimerData_Api,
  getMenus_Api,
  getNoticesOfStudent_Api,
  getNotices_Api,
  getReferEarnSetupData_Api,
  getRegisterHostelList_Api,
  getSalaryRecordsById_Api,
  getSalesData_Api,
  getSalesItemData_Api,
  getSalesItemDetails_Api,
  getSalesItems_Api,
  getSelectMonthWeekNumber_Api,
  getStudentDetailsById_Api,
  getStudentElectricityBill_Api,
  getStudentReviews_Api,
  getStudentRoommates_Api,
  getStudentsNameByRoomNo_Api,
  getSubscriptionDetails_Api,
  giveComplaintResponse_Api,
  giveNoticeResponse_Api,
  login_Api,
  logoutUserSession_Api,
  makePaymentInForSales_Api,
  checkNextDayMenu_Api,
  menuByweek_Api,
  menuItemsView_Api,
  profitLossDetails_Api,
  referApp_Api,
  referEarnAdminSetup_Api,
  referEarnSetup_Api,
  referhostel_Api,
  repeatMenu_Api,
  saleExpensesGraph_Api,
  saleGraphData_Api,
  saleStatement_Api,
  shareRegistrationForm_Api,
  storeElectricityRecords_Api,
  storeEmpAttendance_Api,
  studentCustomSalesDetails_Api,
  studentDetails_Api,
  studentLogin_Api,
  studentSalesAccountDetails_Api,
  studentSalesDetails_Api,
  studentSingUp_Api,
  subscriptionFeatureAndPermissionCompare_Api,
  subscriptionFeaturesDetailsByFilter_Api,
  tenantForgetStudentPassword_Api,
  tenantResetStudentPassword_Api,
  tenantStudentSelfRegister_Api,
  tenantVerifyForgetPasswordOtp_Api,
  updateAddUserRoll_Api,
  updateBusinessProfileImg_Api,
  updateBusinessProfile_Api,
  updateComplaintAction_Api,
  updateCustomSales_Api,
  updateElectricityRecords_Api,
  updateEmpAttendace_Api,
  updateEmployees_Api,
  updateLeadStatus_Api,
  updateMenu_Api,
  updatePaymentInForSales_Api,
  updateSalaryRecords_Api,
  updateSale_Api,
  updateSalesItem_Api,
  uploadDocumets_Api,
  verifiedHostelToken_Api,
  addNextDayMenu_Api,
  getProperty_Api,
} from '../../Utils/config';
import EditRoom from '../../Screen/OnlineBusiness/EditRoom';

//Property get

// export const getPropertyThunk = createAsyncThunk(
//   'property/getPropertyThunk',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getPropertyAPI(); 
//       return response; 
//     } catch (error) {
//       return rejectWithValue(error?.response?.data || error.message);
//     }
//   }
// );


export const getPropertyThunk = createAsyncThunk(
  'property/getPropertyByIdThunk',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPropertyAPI(4);
      return response; 
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updatePropertyThunk = createAsyncThunk(
  'property/updatePropertyThunk',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updatePropertyAPI(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);








export const getRoomsThunk = createAsyncThunk('rooms/getRooms',
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await getRoomsAPI(propertyId);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const getRoomByIdThunk = createAsyncThunk(
  'rooms/getRoomById',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await getRoomByIdAPI(roomId);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);



export const updateRoomThunk = createAsyncThunk(
  'rooms/updateRoom',
  async ({ roomId, formData }, { rejectWithValue }) => {
    try {
      const response = await updateRoomAPI(roomId, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);




 export const profileStatusCheckApi = createAsyncThunk(
  'tenant/profileStatusCheck',
  async ({ mobileNumber, token }, { getState }) => {
    const res = await fetchData(`checkProfileIsUnderReview/${mobileNumber}`, token);
    return res;
  },
);

/* Auth and bussiness Thunks START */
export const loginUserThunkAPI = createAsyncThunk(
  'auth/loginUserThunkAPI',
  async (data, { getState }) => {
    // const {token} = getState().root.auth.userData;
    console.log(' [LOGIN API] Request Data:', data);

    const response = await postData(`${login_Api}`, null, data);

    console.log(' [LOGIN API] Response:', response);
    return response;

  },
);

export const businessRegisterThunkAPI = createAsyncThunk(
  'auth/businessRegisterThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${businessRegister_Api}`, token, data);
  },
);

export const getBusinessImgAndBusinessNamesThunkAPI = createAsyncThunk(
  'auth/getBusinessImgAndBusinessNamesThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`getBusinessImgAndBusinessNames`, token);
  },
);

export const changeUserPasswordThunkAPI = createAsyncThunk(
  'auth/changeUserPasswordThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${changeUserPassword_Api}/${id}`, token, data);
  },
);

export const logoutUserSessionThunkAPI = createAsyncThunk(
  'auth/logoutUserSessionThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${logoutUserSession_Api}/${id}`);
  },
);

export const getSubscriptionDetailsThunkAPI = createAsyncThunk(
  'auth/getSubscriptionDetailsThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getSubscriptionDetails_Api}`, token);
  },
);

export const getBusinessProfileDataThunkAPI = createAsyncThunk(
  'bussiness/getBusinessProfileDataThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getBusinessProfileData_Api}`, token);
  },
);
export const updateBusinessProfileThunkAPI = createAsyncThunk(
  'bussiness/updateBusinessProfileThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateBusinessProfile_Api}/${id}`, token, values);
  },
);
export const updateBusinessProfileImgThunkAPI = createAsyncThunk(
  'bussiness/updateBusinessProfileImgThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateBusinessProfileImg_Api}`, token, data);
  },
);
export const getBusinessProfileDocumetsThunkAPI = createAsyncThunk(
  'bussiness/getBusinessProfileDocumetsThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getBusinessProfileDocumets_Api}`, token);
  },
);
export const uploadDocumetsThunkAPI = createAsyncThunk(
  'bussiness/uploadDocumetsThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${uploadDocumets_Api}/${id}`, token, data);
  },
);

/* Auth and bussiness Thunks END */

/* Terms and Conditions Thunks START */

export const getInvoiceTermsAndCondtionsThunkAPI = createAsyncThunk(
  'bussiness/getInvoiceTermsAndCondtionsThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getInvoiceTermsAndCondtions_Api}`, token);
  },
);
export const addTermsAndConditionsThunkAPI = createAsyncThunk(
  'bussiness/addTermsAndConditionsThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addTermsAndConditions_Api}`, token, data);
  },
);
export const deleteTermsAndConditionsThunkAPI = createAsyncThunk(
  'bussiness/deleteTermsAndConditionsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteTermsAndConditions_Api}/${id}`, token);
  },
);

/* Terms and Conditions Thunks END */

/* Expenses Thunks  */

// bussiness thunks
export const checkBusinessNameThunkApi = createAsyncThunk(
  'Business/checkBusinessNameThunkApi',
  async (name, { rejectWithValue }) => {
    try {
      const response = await fetchData(`checkBusinessName/${name}`);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);

export const checkBusinessEmailThunkApi = createAsyncThunk(
  'Business/checkBusinessEmailThunkApi',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetchData(`checkBusinessEmail/${email}`);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);

export const checkBusinessMobileThunkApi = createAsyncThunk(
  'Business/checkBusinessMobileThunkApi',
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await fetchData(`checkBusinessMobile/${mobile}`);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);
// bussiness thunks end

/*  Registeration Thunks  */

export const studentRegisterThunk = createAsyncThunk(
  'Registeration/studentRegister',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData('studentRegister', token, data);
  },
);

export const getStudentReviewsThunkAPI = createAsyncThunk(
  'Registeration/getStudentReviewsThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getStudentReviews_Api}/${params}`, token);
  },
);
export const adminVerifiedHostelTokenThunkAPI = createAsyncThunk(
  'Registeration/adminVerifiedHostelTokenThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${verifiedHostelToken_Api}/${params}`, token);
  },
);
export const avilabelSeatForBookingThunkAPI = createAsyncThunk(
  'Registeration/avilabelSeatForBookingThunkAPI',
  async ({ roomNo }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`avilabelSeatForBooking/${roomNo}`, token);
  },
);

export const shareRegistrationFormThunkAPI = createAsyncThunk(
  'Registeration/shareRegistrationForm',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${shareRegistrationForm_Api}`, token, data, true);
  },
);
export const switchRoomMainRegisterThunkAPI = createAsyncThunk(
  'Registeration/switchRoomMainRegisterThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`switchRoomMainRegister/${id}`, token, values);
  },
);
export const restoreOldToMainRegisterThunkAPI = createAsyncThunk(
  'Registeration/restoreOldToMainRegisterThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`restoreOldToMainRegister`, token, data);
  },
);

export const updateStudentRegisterThunkAPI = createAsyncThunk(
  'Registeration/updateStudentRegisterThunkAPI',
  async ({ id, formdata }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`updateStudentRegister/${id}`, token, formdata);
  },
);
export const uploadStudentAadharImgThunkAPI = createAsyncThunk(
  'Registeration/uploadStudentAadharImgThunkAPI',
  async ({ id, formdata }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`uploadStudentAadharImg/${id}`, token, formdata);
  },
);

export const uploadStudentAndParentSingImageThunkAPI = createAsyncThunk(
  'Registeration/uploadStudentAndParentSingImageThunkAPI',
  async ({ id, formdata }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(
      `uploadStudentAndParentSingImage/${id}`,
      token,
      formdata,
    );
  },
);

export const selfStudentToMainRegisterThunkAPI = createAsyncThunk(
  'Registeration/selfStudentToMainRegisterThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`selfStudentToMainRegister`, token, data);
  },
);

export const deleteOldStudentRecordsThunkAPI = createAsyncThunk(
  'Registeration/deleteOldStudentRecordsThunkAPI',
  async ({ id, regId }, { getState }) => {
    const { token } = getState().root.auth.userData;
    const response = await deleteData(`deleteOldStudentRecords/${id}`, token);
    response.registrationNumber = regId;
    return response;
  },
);

export const deleteMainRegisterThunkAPI = createAsyncThunk(
  'Registeration/deleteMainRegisterThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`deleteMainRegister/${id}`, token, values);
  },
);

// View Registration

export const termsAndConditionspdfThunkAPI = createAsyncThunk(
  'Registeration/termsAndConditionspdfThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`termsAndConditionspdf`, token);
  },
);
export const createStudentRegFormDownloadThunkAPI = createAsyncThunk(
  'Registeration/createStudentRegFormDownloadThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`createStudentRegFormDownload/${id}`, token);
  },
);

export const downloadStudentDocumentsThunkAPI = createAsyncThunk(
  'Registeration/downloadStudentDocumentsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`downloadStudentDocuments/${id}`, token);
  },
);

/*  Registeration Thunks END  */

/* Booking Thunks start */

export const addStudentBookingThunkAPI = createAsyncThunk(
  'Booking/addStudentBookingThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(addStudentBooking_Api, token, data);
  },
);

export const deleteStudentBookingThunkAPI = createAsyncThunk(
  'Booking/deleteStudentBookingThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(deleteStudentBooking_Api + `/${id}`, token);
  },
);

/* Booking Thunks END */

/* Sales Thunks START */

export const getLatestInvoiceNoThunkAPI = createAsyncThunk(
  'Sales/getLatestInvoiceNoThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    const response = await fetchData(getLatestInvoiceNo_Api, token);
    return response;
  },
);

// export const getSalesDataThunkAPI = createAsyncThunk(
//   'Sales/getSalesDataThunkAPI',
//   async ({filter}, {getState}) => {
//     const {token} = getState().root.auth.userData;
//     let url;
//     if (filter === 'All') {
//       url = 'getSalesData';
//     } else {
//       url = `getSalesData?filter=${filter}`;
//     }
//     return await fetchData(url, token);
//   },
// );
export const getSalesDataThunkAPI = createAsyncThunk(
  'Sales/getSalesDataThunkAPI',
  async ({ filter }, { getState }) => {
    const { token } = getState().root.auth.userData;

    let url = 'getSalesData';
    if (filter !== 'All') {
      const query = new URLSearchParams();
      if (filter.year) query.append('filter[year]', filter.year);
      if (filter.month) query.append('filter[month]', filter.month);
      url += `?${query.toString()}`;
    }

    return await fetchData(url, token);
  }
);

export const getCustomSaleDataThunkAPI = createAsyncThunk(
  'Sales/getCustomSaleDataThunkAPI',
  async ({ filter }, { getState }) => {
    const { token } = getState().root.auth.userData;
    let url = 'getCustomSaleData';

    const query = new URLSearchParams();
    query.append('filter[year]', filter?.year || 'all');
    query.append('filter[month]', filter?.month || 'all');
    url += `?${query.toString()}`;

    return await fetchData(url, token);
  }
);

// export const getSalesHeaderDataThunkAPI = createAsyncThunk(
//   'Sales/getSalesHeaderDataThunkAPI',
//   async (filter, { getState }) => {
//     const { token } = getState().root.auth.userData;
//     const response = await fetchData(
//       `getSaleDeshboardAndFilterDetails?filter=${filter}`,
//       token,
//     );
//     return response;
//   },
// );
export const getSalesHeaderDataThunkAPI = createAsyncThunk(
  'Sales/getSalesHeaderDataThunkAPI',
  async (filter, { getState }) => {
    const { token } = getState().root.auth.userData;

    const query = new URLSearchParams();
    query.append('filter[year]', filter?.year || 'all');
    query.append('filter[month]', filter?.month || 'all');

    const url = `getSaleDeshboardAndFilterDetails?${query.toString()}`;
    const response = await fetchData(url, token);
    return response;
  }
);


export const getCustomSalePartyDetailsThunkApi = createAsyncThunk(
  'Sales/getCustomSalePartyDetailsThunkApi',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData('getCustomSalePartyDetails', token);
  },
);



export const studentSalesDetailsThunkAPI = createAsyncThunk(
  'Sales/studentSalesDetailsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(studentSalesDetails_Api + `/${id}`, token);
  },
);

export const studentCustomSalesDetailsThunkAPI = createAsyncThunk(
  'Sales/studentCustomSalesDetailsThunkAPI',
  async ({ id }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(studentCustomSalesDetails_Api + `/${id}`, token);
  },
);

export const getStudentsNameByRoomNoThunkAPI = createAsyncThunk(
  'Sales/getStudentsNameByRoomNoThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(getStudentsNameByRoomNo_Api + `/${id}`, token);
  },
);

export const getStudentDetailsByIdThunkAPI = createAsyncThunk(
  'Sales/getStudentDetailsByIdThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(getStudentDetailsById_Api + `/${id}`, token);
  },
);
export const getSalesItemsThunkAPI = createAsyncThunk(
  'Sales/getSalesItemsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(getSalesItems_Api, token);
  },
);
export const getElectricityBillRecordsForStudentThunkAPI = createAsyncThunk(
  'Sales/getElectricityBillRecordsForStudentThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(
      `${getElectricityBillRecordsForStudent_Api_Api}/${id}`,
      token,
    );
  },
);

export const getSalesItemDetailsThunkAPI = createAsyncThunk(
  'Sales/getSalesItemDetailsThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(getSalesItemDetails_Api, token, data);
  },
);

export const getAllBillDetailsThunkAPI = createAsyncThunk(
  'Sales/getAllBillDetailsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getAllBillDetails_Api}/${id}`, token);
  },
);
export const createSaleThunkAPI = createAsyncThunk(
  'Sales/createSaleThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(createSale_Api, token, data);
  },
);
export const createCustomSalesThunkAPI = createAsyncThunk(
  'Sales/createCustomSalesThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(createCustomSales_Api, token, data);
  },
);
export const makePaymentInForSalesThunkAPI = createAsyncThunk(
  'Sales/makePaymentInForSalesThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(makePaymentInForSales_Api, token, data);
  },
);

export const createCustomSalePaymentInThunkAPI = createAsyncThunk(
  'Sales/createCustomSalePaymentInThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData('createCustomSalePaymentIn', token, data);
  },
);

export const updatePaymentInForSalesThunkAPI = createAsyncThunk(
  'Sales/updatePaymentInForSalesThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updatePaymentInForSales_Api}/${id}`, token, data);
  },
);

export const updateReceivedPaymentThunkAPI = createAsyncThunk(
  'Sales/updateReceivedPaymentThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`updateReceivedPayment/${id}`, token, data);
  },
);

export const updateSaleThunkAPI = createAsyncThunk(
  'Sales/updateSaleThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateSale_Api}`, token, data);
  },
);
export const updateCustomSalesThunkAPI = createAsyncThunk(
  'Sales/updateCustomSalesThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateCustomSales_Api}`, token, data);
  },
);
export const genrateCustomSaleInvoiceThunkAPI = createAsyncThunk(
  'Sales/genrateCustomSaleInvoiceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${genrateCustomSaleInvoice_Api}/${id}`, token);
  },
);
export const genrateSaleInvoiceThunkAPI = createAsyncThunk(
  'Sales/genrateSaleInvoiceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${genrateSaleInvoice_Api}/${id}`, token);
  },
);
export const createPaymentInInvoiceThunkAPI = createAsyncThunk(
  'Sales/createPaymentInInvoiceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${createPaymentInInvoice_Api}/${id}`, token);
  },
);
export const generateSalesReportThunkAPI = createAsyncThunk(
  'Sales/generateSalesReportThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    if (params) {
      return await fetchData(`${generateSalesReport_Api}${params}`, token);
    } else {
      return await fetchData(`${generateSalesReport_Api}`, token);
    }
  },
);
export const saleStatementThunkAPI = createAsyncThunk(
  'Sales/saleStatementThunkAPI',
  async ({ id, saleType }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(
      `${saleStatement_Api}/${id}?saleType=${saleType}`,
      token,
    );
  },
);
export const deleteMainSaleThunkAPI = createAsyncThunk(
  'Sales/deleteMainSaleThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteMainSale_Api}?invoiceNo=${id}`, token);
  },
);
export const deleteCustomeSaleThunkAPI = createAsyncThunk(
  'Sales/deleteCustomeSaleThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteCustomeSale_Api}?invoiceNo=${id}`, token);
  },
);

//for items that appears on sales section for selection
export const getSalesItemDataThunkAPI = createAsyncThunk(
  'Sales/getSalesItemDataThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getSalesItemData_Api}`, token);
  },
);
export const createNewSaleItemsThunkAPI = createAsyncThunk(
  'Sales/createNewSaleItemsThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createNewSaleItems_Api}`, token, data);
  },
);
export const updateSalesItemThunkAPI = createAsyncThunk(
  'Sales/updateSalesItemThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateSalesItem_Api}/${id}`, token, data);
  },
);
export const deleteSalesItmeThunkAPI = createAsyncThunk(
  'Sales/deleteSalesItmeThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteSalesItme_Api}/${id}`, token);
  },
);

export const deleteRegSalePaymentInThunkApi = createAsyncThunk(
  'Sales/deleteRegSalePaymentInThunkApi',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`deleteRegSalePaymentIn/${id}`, token);
  },
);
export const deleteCustomSalePaymentInThunkApi = createAsyncThunk(
  'Sales/deleteCustomSalePaymentInThunkApi',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`deleteCustomSalePaymentIn/${id}`, token);
  },
);

/* Sales Thunks END */

/* Electricity Thunks START */


/* Electricity Thunks END */

/* Dashboard Thunks START */

export const getDashboardBoxDataThunkAPI = createAsyncThunk(
  'Dashboard/getDashboardBoxDataThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getDashboardBoxData_Api}`, token);
  },
);

export const profitLossDetailsThunkAPI = createAsyncThunk(
  'Dashboard/profitLossDetails',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${profitLossDetails_Api}`, token);
  },
);
export const saleExpensesGraphThunkAPI = createAsyncThunk(
  'Dashboard/saleExpensesGraph',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${saleExpensesGraph_Api}${params}`, token);
  },
);
export const saleGraphDataThunkAPI = createAsyncThunk(
  'Dashboard/saleGraphData',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${saleGraphData_Api}`, token);
  },
);
export const expenseGraphDataThunkAPI = createAsyncThunk(
  'Dashboard/expenseGraphData',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${expenseGraphData_Api}`, token);
  },
);
export const expensesGraphWithCategoryNameThunkAPI = createAsyncThunk(
  'Dashboard/expensesGraphWithCategoryName',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(
      `${expensesGraphWithCategoryName_Api}${params}`,
      token,
    );
  },
);
export const complainBoardGraphDataThunkAPI = createAsyncThunk(
  'Dashboard/complainBoardGraphData',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${complainBoardGraphData_Api}`, token);
  },
);
export const compaintGraphCategoryDataThunkAPI = createAsyncThunk(
  'Dashboard/compaintGraphCategoryData',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${compaintGraphCategoryData_Api}`, token);
  },
);

/* Dashboard Thunks END */

/* Lead Thunks END */


export const addNewLeadThunkAPI = createAsyncThunk(
  'Lead/addNewLeadThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addNewLead_Api}`, token, data);
  },
);
export const deleteleadThunkAPI = createAsyncThunk(
  'Lead/deleteleadThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deletelead_Api}/${id}`, token);
  },
);
export const updateLeadStatusThunkAPI = createAsyncThunk(
  'Lead/updateLeadStatusThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await putData(`${updateLeadStatus_Api}/${id}`, token);
  },
);

/* Lead Thunks END */

/* Food Section Thunks START */

export const checkNextDayMenuThunkApi = createAsyncThunk(
  'food/checkNextDayMenuThunkApi',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${checkNextDayMenu_Api}`, token);
  },
);

export const addNextDayMenuThunkApi = createAsyncThunk(
  'food/addNextDayMenuThunkApi',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${addNextDayMenu_Api}`, token);
  },
);

export const menuByweekThunkAPI = createAsyncThunk(
  'food/menuByweekThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${menuByweek_Api}${params}`, token);
  },
);
export const menuItemsViewThunkAPI = createAsyncThunk(
  'food/menuItemsViewThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${menuItemsView_Api}`, token);
  },
);
export const getMealTypesThunkAPI = createAsyncThunk(
  'food/getMealTypesThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getMealTypes_Api}`, token);
  },
);
export const getMenuImagesDataThunkAPI = createAsyncThunk(
  'food/getMenuImagesDataThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getMenuImagesData_Api}`, token);
  },
);
export const getMenuTimerDataThunkAPI = createAsyncThunk(
  'food/getMenuTimerDataThunkAPI',
  async ({ params }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getMenuTimerData_Api}${params}`, token);
  },
);
export const getItemCodeThunkAPI = createAsyncThunk(
  'food/getItemCodeThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getItemCode_Api}/${id}`, token);
  },
);
export const getSelectMonthWeekNumberThunkAPI = createAsyncThunk(
  'food/getSelectMonthWeekNumberThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getSelectMonthWeekNumber_Api}${params}`, token);
  },
);
export const getCreatedMenuMonthDateThunkAPI = createAsyncThunk(
  'food/getCreatedMenuMonthDateThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getCreatedMenuMonthDate_Api}`, token);
  },
);
export const createMenuThunkAPI = createAsyncThunk(
  'food/createMenuThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createMenu_Api} `, token, data);
  },
);
export const updateMenuThunkAPI = createAsyncThunk(
  'food/updateMenuThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateMenu_Api}/${id}`, token, data);
  },
);
export const repeatMenuThunkAPI = createAsyncThunk(
  'food/repeatMenuThunkAPI',
  async ({ data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${repeatMenu_Api}`, token, data);
  },
);
export const createMenuItemsThunkAPI = createAsyncThunk(
  'food/createMenuItemsThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createMenuItems_Api} `, token, data);
  },
);
export const createOrUpdateMenuTimerThunkAPI = createAsyncThunk(
  'food/createOrUpdateMenuTimerThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createOrUpdateMenuTimer_Api} `, token, data);
  },
);
export const addMenuImageThunkAPI = createAsyncThunk(
  'food/addMenuImageThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addMenuImage_Api} `, token, data);
  },
);
export const deleteMenuImageThunkAPI = createAsyncThunk(
  'food/deleteMenuImageThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteMenuImage_Api}/${id}`, token);
  },
);
export const deleteMenuItemThunkAPI = createAsyncThunk(
  'food/deleteMenuItemThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteMenuItem_Api}/${id}`, token);
  },
);

/* Food Section Thunks END */

/* Complaint Thunks START */

export const getComplaintsThunkAPI = createAsyncThunk(
  'complaint/getComplaintsThunkAPI',
  async ({ params }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getComplaints_Api}${params}`, token);
  },
);
export const updateComplaintActionThunkAPI = createAsyncThunk(
  'complaint/updateComplaintActionThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateComplaintAction_Api}/${id}`, token, values);
  },
);
export const giveComplaintResponseThunkAPI = createAsyncThunk(
  'complaint/giveComplaintResponseThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${giveComplaintResponse_Api}/${id}`, token, values);
  },
);

export const updateNoticeActionThunkAPI = createAsyncThunk(
  'complaint/updateNoticeActionThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateNoticeAction_Api}/${id}`, token, values);
  },
);
export const giveNoticeResponseThunkAPI = createAsyncThunk(
  'complaint/giveNoticeResponseThunkAPI',
  async ({ id, values }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${giveNoticeResponse_Api}/${id}`, token, values);
  },
);

/* Complaint Thunks END */

/* Refer&Earn Admin Thunks START */

export const getReferEarnSetupDataThunkAPI = createAsyncThunk(
  'employee/getReferEarnSetupDataThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getReferEarnSetupData_Api}`, token);
  },
);

export const createReferAndEarnSetupThunkAPI = createAsyncThunk(
  'employee/createReferAndEarnSetupThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createReferAndEarnSetup_Api}`, token, data);
  },
);

/* Refer&Earn Admin Thunks END */

/* Employee Thunks END */

export const getAllPermissionThunkAPI = createAsyncThunk(
  'employee/getAllPermissionThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getAllPermission_Api}`, token);
  },
);
export const getEmployesThunkAPI = createAsyncThunk(
  'employee/getEmployesThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getEmployes_Api}`, token);
  },
);
export const addEmployeeThunkAPI = createAsyncThunk(
  'employee/addEmployeeThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addEmployee_Api}`, token, data);
  },
);
export const updateEmployeesThunkAPI = createAsyncThunk(
  'employee/updateEmployeesThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateEmployees_Api}/${id}`, token, data);
  },
);
export const addNewUserRollThunkAPI = createAsyncThunk(
  'employee/addNewUserRollThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addNewUserRoll_Api}`, token, data);
  },
);
export const generateUniqueEmpFormNoThunkAPI = createAsyncThunk(
  'employee/generateUniqueEmpFormNoThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${generateUniqueEmpFormNo_Api}`, token);
  },
);
export const updateAddUserRollThunkAPI = createAsyncThunk(
  'employee/updateAddUserRollThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateAddUserRoll_Api}/${id}`, token);
  },
);
export const deleteEmployesThunkAPI = createAsyncThunk(
  'employee/deleteEmployesThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${deleteEmployes_Api}/${id}`, token, data);
  },
);
export const getEmpSalaryByMonthThunkAPI = createAsyncThunk(
  'employee/getEmpSalaryByMonthThunkAPI',
  async ({ id, params }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getEmpSalaryByMonth_Api}/${id}${params}`, token);
  },
);
export const deleteEmpSalaryRecordsThunkAPI = createAsyncThunk(
  'employee/deleteEmpSalaryRecordsThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteEmpSalaryRecords_Api}/${id}`, token);
  },
);
export const createEmpSalaryRecordsThunkAPI = createAsyncThunk(
  'employee/createEmpSalaryRecordsThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createEmpSalaryRecords_Api}/${id}`, token, data);
  },
);
export const getSalaryRecordsByIdThunkAPI = createAsyncThunk(
  'employee/getSalaryRecordsByIdThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getSalaryRecordsById_Api}/${id}`, token);
  },
);
export const updateSalaryRecordsThunkAPI = createAsyncThunk(
  'employee/updateSalaryRecordsThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateSalaryRecords_Api}/${id}`, token, data);
  },
);
export const SalarySetupRecordThunkAPI = createAsyncThunk(
  'employee/SalarySetupRecordThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${SalarySetupRecord_Api}/${id}`, token);
  },
);
export const createPaymentSetupThunkAPI = createAsyncThunk(
  'employee/createPaymentSetupThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${createPaymentSetup_Api}/${id}`, token, data);
  },
);
export const getEmpTotalAttendaceThunkAPI = createAsyncThunk(
  'employee/getEmpTotalAttendaceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getEmpTotalAttendace_Api}/${id}`, token);
  },
);
export const getEmpAttendaceThunkAPI = createAsyncThunk(
  'employee/getEmpAttendaceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${getEmpAttendace_Api}/${id}`, token);
  },
);
export const empAttendacesRecordsThunkAPI = createAsyncThunk(
  'employee/empAttendacesRecordsThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${empAttendacesRecords_Api}${params}`, token);
  },
);
export const storeEmpAttendanceThunkAPI = createAsyncThunk(
  'employee/storeEmpAttendanceThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${storeEmpAttendance_Api}`, token, data);
  },
);
export const addAttendanceThunkAPI = createAsyncThunk(
  'employee/addAttendanceThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addAttendance_Api}/${id}`, token, data);
  },
);
export const updateEmpAttendaceThunkAPI = createAsyncThunk(
  'employee/updateEmpAttendaceThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${updateEmpAttendace_Api}/${id}`, token, data);
  },
);
export const deleteAttendanceThunkAPI = createAsyncThunk(
  'employee/deleteAttendanceThunkAPI',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await deleteData(`${deleteAttendance_Api}/${id}`, token);
  },
);
/* Employee Thunks END */

/* Subscription Thunks START */

export const filterSubscriptionDetailsThunkAPI = createAsyncThunk(
  'subscription/filterSubscriptionDetailsThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`${filterSubscriptionDetails_Api}`, token);
  },
);
export const subscriptionFeaturesDetailsByFilterThunkAPI = createAsyncThunk(
  'subscription/subscriptionFeaturesDetailsByFilterThunkAPI',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(
      `${subscriptionFeaturesDetailsByFilter_Api}${params}`,
      token,
    );
  },
);

export const getSubscriptionPage = createAsyncThunk(
  'subscription/getSubscriptionPage',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    const response = await postData(`openPageOnWeb`, token);
    return response;
  },
);
export const subscriptionFeatureAndPermissionCompareThunkAPI = createAsyncThunk(
  'subscription/subscriptionFeatureAndPermissionCompareThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(
      `${subscriptionFeatureAndPermissionCompare_Api}`,
      token,
    );
  },
);
export const addSubscriptionPlanThunkAPI = createAsyncThunk(
  'subscription/addSubscriptionPlanThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`${addSubscriptionPlan_Api}`, token, data);
  },
);
/* Subscription Thunks END */

/* Tenant Client Thunks Start */

export const studentLoginThunkAPI = createAsyncThunk(
  'clientAuth/studentLoginThunkAPI',
  async (data, { getState }) => {
    return await postData(`${studentLogin_Api}`, null, data);
  },
);
export const getRegisterHostelListThunkAPI = createAsyncThunk(
  'clientAuth/getRegisterHostelListThunkAPI',
  async (params, { getState }) => {
    // const {token} = getState().root.auth.userData;
    return await fetchData(`${getRegisterHostelList_Api}${params}`, null);
  },
);
export const studentSingUpThunkAPI = createAsyncThunk(
  'clientAuth/studentSingUpThunkAPI',
  async (data, { getState }) => {
    // const {token} = getState().root.auth.userData;
    return await postData(`${studentSingUp_Api}`, null, data);
  },
);
export const checkStudentPasswordIsCreatedOrNotThunkAPI = createAsyncThunk(
  'clientAuth/checkStudentPasswordIsCreatedOrNotThunkAPI',
  async (data, { getState }) => {
    // const {token} = getState().root.auth.userData;
    return await fetchData(
      `${checkStudentPasswordIsCreatedOrNot_Api}/${data}`,
      null,
    );
  },
);
export const createStudentPasswordThunkAPI = createAsyncThunk(
  'clientAuth/createStudentPasswordThunkAPI',
  async ({ id, data }, { getState }) => {
    // const {token} = getState().root.auth.userData;
    return await postData(`${createStudentPassword_Api}/${id}`, null, data);
  },
);
export const studentDetailsThunkAPI = createAsyncThunk(
  'clientAuth/studentDetailsThunkAPI',
  async (id, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${studentDetails_Api}/${studentID}`, token);
  },
);
export const tenantStudentSelfRegisterThunkAPI = createAsyncThunk(
  'clientAuth/tenantStudentSelfRegisterThunkAPI',
  async ({ _, data }, { getState }) => {
    const { token, id } = getState().root?.clientAuth?.clientSessionData;

    return await postData(
      `${tenantStudentSelfRegister_Api}/${id}`,
      token,
      data,
    );
  },
);
export const tenantforgetStudentPasswordThunkAPI = createAsyncThunk(
  'clientAuth/tenantforgetStudentPasswordThunkAPI',
  async (data, { getState }) => {
    const { token, id } = getState().root?.clientAuth?.clientSessionData;

    return await postData(`${tenantForgetStudentPassword_Api}`, token, data);
  },
);
export const tenantverifyForgetPasswordOtpThunkAPI = createAsyncThunk(
  'clientAuth/tenantverifyForgetPasswordOtpThunkAPI',
  async (data, { getState }) => {
    const { token } = getState().root?.clientAuth?.clientSessionData;

    return await postData(`${tenantVerifyForgetPasswordOtp_Api}`, token, data);
  },
);
export const tenantResetStudentPasswordThunkAPI = createAsyncThunk(
  'clientAuth/tenantResetStudentPasswordThunkAPI',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root?.clientAuth?.clientSessionData;

    return await postData(
      `${tenantResetStudentPassword_Api}/${id}`,
      token,
      data,
    );
  },
);
export const createComplaintThunkAPI = createAsyncThunk(
  'clientComplaint/createComplaintThunkAPI',
  async (data, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await postData(`${createComplaint_Api}/${studentID}`, token, data);
  },
);
export const getComplaintOfStudentThunkAPI = createAsyncThunk(
  'clientComplaint/getComplaintOfStudentThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getComplaintOfStudent_Api}/${studentID}`, token);
  },
);
export const getMenusThunkAPI = createAsyncThunk(
  'clientComplaint/getMenusThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getMenus_Api}`, token);
  },
);
export const studentSalesAccountDetailsThunkAPI = createAsyncThunk(
  'clientComplaint/studentSalesAccountDetailsThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(
      `${studentSalesAccountDetails_Api}/${studentID}`,
      token,
    );
  },
);
export const getNoticesOfStudentThunkAPI = createAsyncThunk(
  'clientComplaint/getNoticesOfStudentThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getNoticesOfStudent_Api}/${studentID}`, token);
  },
);
export const createNoticeRequestThunkAPI = createAsyncThunk(
  'clientComplaint/createNoticeRequestThunkAPI',
  async (data, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await postData(
      `${createNoticeRequest_Api}/${studentID}`,
      token,
      data,
    );
  },
);
export const deleteTenanatNoticeThunkAPI = createAsyncThunk(
  'clientComplaint/deleteTenanatNoticeThunkAPI',
  async (id, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;

    return await deleteData(`${deleteTenanatNotice_Api}/${id}`, token);
  },
);
export const createTenantStudentRegFormDownloadThunkAPI = createAsyncThunk(
  'clientProfile/createTenantStudentRegFormDownloadThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`createStudentRegFormDownload/${studentID}`, token);
  },
);

export const tenantTermsAndConditionspdfThunkAPI = createAsyncThunk(
  'clientProfile/tenantTermsAndConditionspdfThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`termsAndConditionspdf`, token);
  },
);

export const tenantStudentSalesDetailsThunkAPI = createAsyncThunk(
  'clientProfile/tenantStudentSalesDetailsThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(studentSalesDetails_Api + `/${studentID}`, token);
  },
);

export const tenantGenrateSaleInvoiceThunkAPI = createAsyncThunk(
  'clientProfile/tenantGenrateSaleInvoiceThunkAPI',
  async (id, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${genrateSaleInvoice_Api}/${id}`, token);
  },
);

export const tenantCreatePaymentInInvoiceThunkAPI = createAsyncThunk(
  'clientProfile/tenantCreatePaymentInInvoiceThunkAPI',
  async (id, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${createPaymentInInvoice_Api}/${id}`, token);
  },
);
export const getStudentRoommatesThunkAPI = createAsyncThunk(
  'clientProfile/getStudentRoommatesThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getStudentRoommates_Api}/${studentID}`, token);
  },
);

export const getStudentElectricityBillThunkAPI = createAsyncThunk(
  'clientComplaint/getStudentElectricityBillThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(
      `${getStudentElectricityBill_Api}/${studentID}`,
      token,
    );
  },
);
export const getHostelRefersThunkAPI = createAsyncThunk(
  'clientRefer/getHostelRefersThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getHostelRefers_Api}/${studentID}`, token);
  },
);
export const referEarnSetupThunkAPI = createAsyncThunk(
  'clientRefer/referEarnSetupThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${referEarnSetup_Api}`, token);
  },
);
export const referhostelThunkAPI = createAsyncThunk(
  'clientRefer/referhostelThunkAPI',
  async (data, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await postData(`${referhostel_Api}/${studentID}`, token, data);
  },
);
export const referAppThunkAPI = createAsyncThunk(
  'clientRefer/referAppThunkAPI',
  async (data, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await postData(`${referApp_Api}/${studentID}`, token, data);
  },
);
export const referEarnAdminSetupThunkAPI = createAsyncThunk(
  'clientRefer/referEarnAdminSetupThunkAPI',
  async (_, { getState }) => {
    const { token } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${referEarnAdminSetup_Api}`, token);
  },
);
export const getAppRefersThunkAPI = createAsyncThunk(
  'clientRefer/getAppRefersThunkAPI',
  async (_, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${getAppRefers_Api}/${studentID}`, token);
  },
);
export const tenantVerifiedHostelTokenThunkAPI = createAsyncThunk(
  'clientRefer/tenantVerifiedHostelTokenThunkAPI',
  async (params, { getState }) => {
    const { token, studentID } = getState().root?.clientAuth?.clientSessionData;
    return await fetchData(`${verifiedHostelToken_Api}/${params}`, token);
  },
);
/* Tenant Client Thunks END */

// stock Mangement api

// stock management category api
export const StockManagementCategoryThunkApi = createAsyncThunk(
  'StockManagement/StockManagementCategoryThunkApi',
  async (_, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`stockManagement/categorys`, token);
  },
);

// stock management categories With Items And Details
export const StockManagementCategoryDataThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementCategoryDataThunkApi',
  async (params, { getState }) => {
    const { token } = getState().root.auth.userData;
    if (params) {
      return await fetchData(`stockManagement${params}`, token);
    } else {
      return await fetchData(`stockManagement`, token);
    }
  },
);
// stock management categories With Items And Details
export const StockManagementReportThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementReportThunkApi',
  async (date, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await fetchData(`stockManagement/reports?date=${date}`, token);
  },
);

// stock management add item and categories

// stock management add item and categories
export const StockManagementDeleteItemsThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementDeleteItemsThunkApi',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`deleteStockItem`, token, data);
  },
);

// stock management add estimation
export const StockManagementAddEstimationThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementAddEstimationThunkApi',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`stockManagement/addEstimation`, token, data);
  },
);
// stock management add order
export const StockManagementAddOrderThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementAddOrderThunkApi',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`stockManagement/addOrder`, token, data);
  },
);
// stock management add order
export const StockManagementAddUserStockThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementAddUserStockThunkApi',
  async (data, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`stockManagement/addUserStock`, token, data);
  },
);
// stock management add order
export const StockManagementDeleteStockThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementDeleteStockThunkApi',
  async ({ id, data }, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`stockManagement/update/${id}`, token, data);
  },
);
// stock management add order
export const StockManagementDeleteStockIdThunkApi = createAsyncThunk(
  'StockManagementApi/StockManagementDeleteStockIdThunkApi',
  async (id, { getState }) => {
    const { token } = getState().root.auth.userData;
    return await postData(`stockManagement/delete?stockId=${id}`, token, data);
  },
);
