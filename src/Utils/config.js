// const BASE_URL = 'https://web.mysmartpg.com/public/api/';
// export const BASE_URL_WEB = 'https://web.mysmartpg.com/';

const BASE_URL = 'https://devops.shivomgroup.com/public/api/';
export const BASE_URL_WEB = 'https://devops.shivomgroup.com/public/';


export const LOCAL_BASE_URL = 'http://192.168.225.143:8000/api';



export default BASE_URL;

/* Auth section */
export const login_Api = 'login'; 

console.log("Tokern", login_Api)


export const getProperty_Api="property";

export const getAllNotifications_Api = 'all-notifications';

export const businessRegister_Api = 'businessRegister'; //Done..
export const logoutUserSession_Api = 'logoutUserSession'; //Done..
export const changeUserPassword_Api = 'changeUserPassword'; //Done..

/* Profile section */
export const getBusinessProfileData_Api = 'getBusinessProfileData'; //Done..
export const updateBusinessProfile_Api = 'updateBusinessProfile'; //Done..
export const updateBusinessProfileImg_Api = 'updateBusinessProfileImg'; //Done..
export const uploadDocumets_Api = 'uploadDocumets';
export const getBusinessProfileDocumets_Api = 'getBusinessProfileDocumets';
export const addTermsAndConditions_Api = 'addTermsAndConditions';
export const deleteTermsAndConditions_Api = 'deleteTermsAndConditions';
export const getInvoiceTermsAndCondtions_Api = 'getInvoiceTermsAndCondtions';

/* Register section */
export const shareRegistrationForm_Api = 'shareRegistrationForm'; //Done..
export const getStudentReviews_Api = 'getStudentReviews'; //Done..vys

/* Expenses section */
export const genrateExpenseReport_Api = 'genrateExpenseReport'; //Done..

/* Electricity section */
export const electricityView_Api = 'electricityView'; //Done..
export const getElectricityForStoreBill_Api = 'getElectricityForStoreBl'; //Done..
export const storeElectricityRecords_Api = 'storeElectricityRecord'; //Done..
export const updateElectricityRecords_Api = 'updateElectricityRecord'; //Done..
export const downloadElectricityReport_Api = 'downloadElectricityReports'; //Done..

/* Booking section */
export const addStudentBooking_Api = 'Booking'; //Done..
export const deleteStudentBooking_Api = 'deleteStudentBooking'; //Done..

/* Sales section */
export const getLatestInvoiceNo_Api = 'getLatestInvoiceNo'; // Done
export const getSalesData_Api = 'sales'; // Done
export const getStudentsNameByRoomNo_Api = 'RoomNo'; //Done
export const getStudentDetailsById_Api = 'StudentDetails'; //Done
export const getCustomSaleData_Api = 'CustomSale'; //Done
export const getSalesItems_Api = 'Items'; //Done
export const getElectricityBillRecordsForStudent_Api_Api =
  'getElectricityBillRecordsForStudent'; //Done
export const getSalesItemDetails_Api = 'ItemDetails'; //Done
export const getAllBillDetails_Api = 'BillDetails'; //Done
export const studentSalesDetails_Api = 'studentSalesDetails'; //Done
export const createSale_Api = 'createSale'; //Done
export const createCustomSales_Api = 'createCustomSales';
export const studentCustomSalesDetails_Api = 'studentCustomSalesDetails'; //Done
export const makePaymentInForSales_Api = 'makePaymentInForSales';
export const updatePaymentInForSales_Api = 'InForSales';
export const updateSale_Api = 'updateSale'; //Done
export const updateCustomSales_Api = 'updateCustomSales';
export const genrateSaleInvoice_Api = 'genrateSaleInvoice';
export const createPaymentInInvoice_Api = 'createPaymentInInvoice';
export const genrateCustomSaleInvoice_Api = 'genrateCustomSaleInvoice';
export const generateSalesReport_Api = 'generateSalesReport';
export const saleStatement_Api = 'saleStatement';
export const deleteMainSale_Api = 'deleteMainSale';
export const deleteCustomeSale_Api = 'deleteCustomeSale';
//for items that appears on sales section for selection
export const getSalesItemData_Api = 'getSalesItemData';
export const createNewSaleItems_Api = 'createNewSaleItems';
export const updateSalesItem_Api = 'updateSalesItem';
export const deleteSalesItme_Api = 'deleteSalesItme';

/* Dashboard section */
export const getDashboardBoxData_Api = 'getDashboardBoxData'; //Done..
export const profitLossDetails_Api = 'profitLossDetails'; //Done..
export const saleExpensesGraph_Api = 'saleExpensesGraph'; //Done..
export const saleGraphData_Api = 'saleGraphData'; //Done..
export const expenseGraphData_Api = 'expenseGraphData'; //Done..
export const expensesGraphWithCategoryName_Api =
  'expensesGraphWithCategoryName'; //Done..
export const complainBoardGraphData_Api = 'complainBoardGraphData'; //Done..
export const compaintGraphCategoryData_Api = 'compaintGraphCategoryData'; //Done..

/* Subscription section */
export const getSubscriptionDetails_Api = 'getSubscriptionDetails'; //Done..

/* Lead Manager section */
export const getLeadData_Api = 'getLeadData'; //Done..
export const deletelead_Api = 'deletelead'; //Done..
export const addNewLead_Api = 'addNewLead'; //Done..
export const updateLeadStatus_Api = 'updateLeadStatus';

/* Food Menu section */
export const menuItemsView_Api = 'menuItemsView';
export const menuByweek_Api = 'menuByweek';
export const getMealTypes_Api = 'getMealTypes';
export const getMenuImagesData_Api = 'getMenuImagesData';
export const getMenuTimerData_Api = 'getMenuTimerData';
export const getItemCode_Api = 'getItemCode';
export const createOrUpdateMenuTimer_Api = 'createOrUpdateMenuTimer';
export const createMenu_Api = 'createMenu';
export const updateMenu_Api = 'updateMenu';
export const repeatMenu_Api = 'repeatMenu';
export const createMenuItems_Api = 'createMenuItems';
export const deleteMenuItem_Api = 'deleteMenuItem';
export const addMenuImage_Api = 'addMenuImage';
export const deleteMenuImage_Api = 'deleteMenuImage';
export const addNextDayMenu_Api = 'addNextDayMenu';
export const checkNextDayMenu_Api = 'checkNextDayMenu';
export const getCreatedMenuMonthDate_Api = 'getCreatedMenuMonthDate';
export const getSelectMonthWeekNumber_Api = 'getSelectMonthWeekNumber';

/* Complaint Board section */
export const getComplaints_Api = 'getComplaints';
export const updateComplaintAction_Api = 'updateComplaintAction';
export const giveComplaintResponse_Api = 'giveComplaintResponse';
export const giveNoticeResponse_Api = 'giveNoticeResponse';

/* Refer&Earn Admin section */
export const getReferEarnSetupData_Api = 'getReferEarnSetupData';
export const createReferAndEarnSetup_Api = 'createReferAndEarnSetup';

/* Employee section */
export const getAllPermission_Api = 'getAllPermission';
export const getEmployes_Api = 'getEmployes';
export const addEmployee_Api = 'addEmployee';
export const updateEmployees_Api = 'updateEmployees';
export const addNewUserRoll_Api = 'addNewUserRoll';
export const generateUniqueEmpFormNo_Api = 'generateUniqueEmpFormNo';
export const updateAddUserRoll_Api = 'updateAddUserRoll';
export const deleteEmployes_Api = 'deleteEmployes';
export const getEmpSalaryByMonth_Api = 'getEmpSalaryByMonth';
export const deleteEmpSalaryRecords_Api = 'EmpSalaryRecordsdelete';
export const createEmpSalaryRecords_Api = 'EmpSalaryRecordscreate';
export const getSalaryRecordsById_Api = 'getSalaryRecordsByIdupdate';
export const updateSalaryRecords_Api = 'SalaryRecordsupdate';
export const SalarySetupRecord_Api = 'SetupRecordSalary';
export const createPaymentSetup_Api = 'PaymentSetupcreate';
export const getEmpTotalAttendace_Api = 'getEmpTotalAttendace';
export const getEmpAttendace_Api = 'getEmpAttendace';
export const empAttendacesRecords_Api = 'empAttendacesRecords';
export const storeEmpAttendance_Api = 'storeEmpAttendanceall';
export const addAttendance_Api = 'addAttendanceall';
export const updateEmpAttendace_Api = 'updateEmpAttendaceall';
export const deleteAttendance_Api = 'deleteAttendanceall';

//Subscription
export const subscriptionFeaturesDetailsByFilter_Api =
  'subscriptionFeaturesDetailsByFilter';
export const filterSubscriptionDetails_Api = 'SubscriptionDetailsfilter';
export const subscriptionFeatureAndPermissionCompare_Api =
  'FeatureAndPermissionComparesubscription';
export const addSubscriptionPlan_Api = 'SubscriptionPlanadd';

/* Client section START */

export const studentLogin_Api = 'studentLogin';
export const getRegisterHostelList_Api = 'RegisterHostelList';
export const studentSingUp_Api = 'studentsingup';
export const checkStudentPasswordIsCreatedOrNot_Api =
  'PasswordIsCreatedOrNotcheckStudent';
export const createStudentPassword_Api = 'StudentPasswordcreate';
export const studentDetails_Api = 'stDetails';
export const getStudentRoommates_Api = 'Roommates';
export const tenantStudentSelfRegister_Api = 'SelfRegistertenantStudent';
// export const studentSelfRegister_Api = 'studentSelfRegister';
export const tenantForgetStudentPassword_Api = 'StudentPasswordforget';
export const tenantVerifyForgetPasswordOtp_Api = 'ForgetPasswordOtpverify';
export const tenantResetStudentPassword_Api = 'StudentPasswordreset';
export const createComplaint_Api = 'Complaint';
export const getComplaintOfStudent_Api = 'OfStudent';
export const getMenus_Api = 'Menus';
export const studentSalesAccountDetails_Api = 'AccountDetails';
export const createNoticeRequest_Api = 'NoticeRequest';
export const deleteTenanatNotice_Api = 'TenanatNotice';
export const getNoticesOfStudent_Api = 'OfStudent';
export const getStudentElectricityBill_Api = 'ElectricityBill';
export const getHostelRefers_Api = 'getHostelRefers';
export const referEarnSetup_Api = 'EarnSetup';
export const referhostel_Api = 'refer-hostel';
export const referApp_Api = 'referApp';
export const getAppRefers_Api = 'getAppRefers';
export const referEarnAdminSetup_Api = 'AdminSetup';
export const verifiedHostelToken_Api = 'verifiedHostelToken';

/* Client section END */
