import {colors} from './Colors';
import {
  POSTER01_IC,
  POSTER02_IC,
  POSTER03_IC,
  POSTER04_IC,
  POSTER05_IC,
  POSTER06_IC,
  POSTER07_IC,
  POSTER08_IC,
} from './Icons';

export const rooma_list = [
  {
    roomNo: '101',
    roomType: 'Standard',
    noOfSeats: 2,
    rent: 1000.0,
  },
  {
    roomNo: '102',
    roomType: 'Deluxe',
    noOfSeats: 3,
    rent: 1500.0,
  },
  {
    roomNo: '103',
    roomType: 'Suite',
    noOfSeats: 4,
    rent: 2000.0,
  },
  {
    roomNo: '104',
    roomType: 'Standard',
    noOfSeats: 2,
    rent: 1000.0,
  },
  {
    roomNo: '105',
    roomType: 'Deluxe',
    noOfSeats: 3,
    rent: 1500.0,
  },
  {
    roomNo: '106',
    roomType: 'Suite',
    noOfSeats: 4,
    rent: 2000.0,
  },
  {
    roomNo: '107',
    roomType: 'Standard',
    noOfSeats: 2,
    rent: 1000.0,
  },
  {
    roomNo: '108',
    roomType: 'Deluxe',
    noOfSeats: 3,
    rent: 1500.0,
  },
  {
    roomNo: '109',
    roomType: 'Suite',
    noOfSeats: 4,
    rent: 2000.0,
  },
  {
    roomNo: '110',
    roomType: 'Standard',
    noOfSeats: 2,
    rent: 1000.0,
  },
  {
    roomNo: '111',
    roomType: 'Deluxe',
    noOfSeats: 3,
    rent: 1500.0,
  },
  {
    roomNo: '112',
    roomType: 'Suite',
    noOfSeats: 4,
    rent: 2000.0,
  },
  {
    roomNo: '113',
    roomType: 'Standard',
    noOfSeats: 2,
    rent: 1000.0,
  },
  {
    roomNo: '114',
    roomType: 'Deluxe',
    noOfSeats: 3,
    rent: 1500.0,
  },
  {
    roomNo: '115',
    roomType: 'Suite',
    noOfSeats: 4,
    rent: 2000.0,
  },
];

export const registration = [
  {
    name: 'John Doe',
    roomNo: '101',
    roomType: 'Single',
    roomRent: 800,
    seatNo: 'A001',
  },
  {
    name: 'Jane Smith',
    roomNo: '102',
    roomType: 'Double',
    roomRent: 1200,
    seatNo: 'A002',
  },
  {
    name: 'Bob Johnson',
    roomNo: '103',
    roomType: 'Single',
    roomRent: 800,
    seatNo: 'A003',
  },
  {
    name: 'Alice Williams',
    roomNo: '104',
    roomType: 'Double',
    roomRent: 1200,
    seatNo: 'A004',
  },
  {
    name: 'Charlie Brown',
    roomNo: '105',
    roomType: 'Single',
    roomRent: 800,
    seatNo: 'A005',
  },
];

export const registrationStats = [
  {
    type: 'totla_reg',
    title: 'Total Reg ',
    value: 15,
  },
  {
    type: 'running_reg',
    title: 'Running Reg',
    value: 4,
  },
  {
    type: 'old_reg',
    title: 'Old Reg',
    value: 1,
  },
  {
    type: 'vacant_reg',
    title: 'Vacant Reg',
    value: 11,
  },
  {
    type: 'queue_reg',
    title: 'Register Queue',
    value: 11,
  },
];

export const Complaint_stats = [
  {
    title: 'Total Complaint ',
    value: 15,
  },
  {
    title: 'Active Complaint',
    value: 4,
  },
  {
    title: 'Closed Complaint',
    value: 1,
  },
  {
    title: 'Unseen Complaint',
    value: 11,
  },
];
export const featureData = [
  {
    title: 'One App',
    desc: 'To manage all your bussiness',
    color: colors.brown,
    icon: 'mobile-screen',
  },
  {
    title: 'Record',
    desc: 'Digital manager for tenant records',
    color: colors.purple,
    icon: 'file',
  },
  {
    title: 'Admission',
    desc: 'Online & digital tenant registration',
    color: colors.navy,
    icon: 'clipboard-user',
  },
  {
    title: 'Collection',
    desc: 'Hassel free rent collection',
    color: colors.green,
    icon: 'money-check',
  },
  {
    title: 'Accountant',
    desc: 'Digital and smart account accountant',
    color: colors.lightygrey,
    icon: 'mobile-screen',
  },
  {
    title: 'Manager',
    desc: 'Rooms, lead & complaint manager',
    color: colors.navy,
    icon: 'mobile-screen',
  },
  {
    title: 'Tenant App',
    desc: 'For transparent & easy records',
    color: colors.brown,
    icon: 'chalkboard-user',
  },
  {
    title: 'Roles',
    desc: 'Manage employee attandance,records & roles',
    color: colors.red,
    icon: 'user-gear',
  },
  {
    title: 'Audit',
    desc: 'Smart Audit system - profit/loss records',
    color: colors.lightygrey,
    icon: 'chart-simple',
  },
  {
    title: 'Calculate',
    desc: 'Calculate and manage electricity bill',
    color: colors.navy,
    icon: 'calculator',
  },
  {
    title: 'Back-up',
    desc: 'Google cloud backup & restore',
    color: colors.green,
    icon: 'file-shield',
  },
  {
    title: 'Reminder',
    desc: 'Billing updates and billing reminder',
    color: colors.AppDefaultColor,
    icon: 'bell',
  },
  {
    title: 'Reports',
    desc: 'Create expense & sale reports',
    color: colors.purple,
    icon: 'file-invoice',
  },
];
export const promotionData = [
  {
    title: 'poster',
    url: POSTER01_IC,
  },
  {
    title: 'poster',
    url: POSTER02_IC,
  },
  {
    title: 'poster',
    url: POSTER03_IC,
  },
  {
    title: 'poster',
    url: POSTER04_IC,
  },
  {
    title: 'poster',
    url: POSTER05_IC,
  },
  {
    title: 'poster',
    url: POSTER06_IC,
  },
  {
    title: 'poster',
    url: POSTER07_IC,
  },
  {
    title: 'poster',
    url: POSTER08_IC,
  },
];
