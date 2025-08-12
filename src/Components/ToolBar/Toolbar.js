import React from 'react';
import Main_Header from '../headers/Main_Header';
import {useNavigationState} from '@react-navigation/native';
import {useBackHandler} from '../../Utils/utils';

const Toolbar = props => {
  // Get the current navigation state
  const state = useNavigationState(state => state);

  // Handle back button press based on the current route name
  useBackHandler(state.routes[state.index].name);

  // Function to get the title based on the current route
  const getCurrentRouteName = state => {
    const route = state.routes[state.index];
    let name;

    // Map route names to user-friendly titles
    switch (route.name) {
      case 'Food_Menu_Screen':
        name = 'Food Menu';
        break;
      case 'dashboard':
        name = 'Home';
        break;
      case 'rooms_seats':
        name = 'Room Seats';
        break;
      case 'UpgradePlanScreen':
        name = 'Subscription';
        break;
      case 'LeadManagerScreen':
        name = 'Lead Manager';
        break;
      case 'Profile_Screen':
        name = 'Profile';
        break;
      case 'Employee_List_Screen':
        name = 'Employee';
        break;
      case 'EmployeeReg_Screen':
        name = 'Employee Registration';
        break;
      case 'Electricity_Screen':
        name = 'Electricity';
        break;
      case 'Create_Electricity_Screen':
        name = 'Add Electricity';
        break;
      case 'Complaint_Board':
        name = 'Tenant Complaint';
        break;
      case 'Notice_Board_Screen':
        name = 'Tenant Notice';
        break;
      case 'AdminNotice_Screen':
        name = 'Admin Notice';
        break;
      case 'ReferEarn_Screen':
        name = 'Refer & Earn';
        break;
      case 'Settings_Screen':
        name = 'Settings';
        break;
      case 'PermissionMaster_Screen':
        name = 'Permission Master';
        break;
      case 'Register_Candidate':
      case 'Add_Registration':
        name = 'Registration';
        break;
      case 'Sale_Tenant':
        name = 'Sales';
        break;
      case 'Add_Sale_Form':
        name = 'Add Sales';
        break;
      case 'UserRoleList':
        name = 'User Role';
        break;
      case 'Take_Payment_Form':
        name = 'Payment Form';
        break;
      case 'CustomSales_Screen':
        name = 'Custom Sales form';
        break;
      case 'view_CustomSales':
        name = 'Custom Sales list';
        break;
      case 'DocumentUploadScreen':
        name = 'Upload Document';
        break;
      case 'view_sale':
        name = 'View Sale';
        break;
      case 'Add_Item':
        name = 'Add Item';
        break;
      case 'sales':
        name = 'Sales';
        break;
      case 'sales_form':
        name = 'Sales Form';
        break;
      case 'Registarion_View':
        name = 'Registration View';
        break;
      case 'OrderSummaryScreen':
        name = 'Review Subscription';
        break;
      case 'AdminRefer_Screen':
        name = 'Admin Refer';
        break;
      case 'ReferSetup_Screen':
        name = 'Refer Setup';
        break;
      case 'ComparePlanScreen':
        name = 'Compare Plan';
        break;
      case 'Permissions_Screen':
        name = 'Permissions';
        break;
      case 'AdminPolicies':
        name = 'Policies';
        break;
      case 'AttendanceView_Screen':
        name = 'Attendance';
        break;
      case 'UpdateEmpReg_Screen':
        name = 'Update Employee';
        break;
      case 'AddUserRole_Screen':
        name = 'Add user';
        break;
      case 'Category_Expenses':
        name = 'Category Expenses';
        break;
      case 'BussinessLogin':
        name = 'Business Login';
        break;
      case 'BackupScreen':
        name = 'Backup & Restore';
        break;
      case 'ProfitLoss_Screen':
        name = 'Profilt & Loss';
        break;

      case 'UpdateTakePayment':
        name = 'Update Payment';
        break;
      case 'Update_Sale':
        name = 'Update Sale';
        break;
        case 'UpdateCustomSales':
          name = 'Update Sale';
          break;
      default:
        name = props.customeTitle ? props.customeTitle : route.name;
        break;
    }

    return name;
  };

  // Get the current route's title
  const currentRouteName = getCurrentRouteName(state);

  return (
    <Main_Header
      title={currentRouteName ? currentRouteName : ''}
      openDrawer={() => props.navigation.openDrawer()}
    />
  );
};

export default Toolbar;
