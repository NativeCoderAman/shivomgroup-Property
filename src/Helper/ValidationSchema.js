import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({

  roomNumber: Yup.string().required('Room Number is required'),
  seatNumber: Yup.string().required('Seat Number is required'),
  registrationDate: Yup.date().required('Registration date is required'),
  candidateName: Yup.string().required('Candidate Name is required'),
  birthDate: Yup.date().required('Birth date is required'),
  idProof: Yup.string().required('ID Proof is required'),
  candidatePhone: Yup.string()
    .min(10, 'Minimum length should be 10')
    .required('Candidate phone is required'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
  blood_Group: Yup.string().required('Blood Group is required'),
  courseName: Yup.string().required('Course Name is required'),
  // courseDescription: Yup.string().when('courseName', {
  //   is: (courseName) => courseName === 'coursetype',
  //   then: Yup.string().required('Course Description is required'),
  //   otherwise: Yup.string().nullable().required('Job Description is required'),
  // }),
  // jobDescription: Yup.string().when('courseName', {
  //   is: (courseName) => courseName !== 'coursetype',
  //   then: Yup.string().required('Job Description is required'),
  //   otherwise: Yup.string().nullable(), // Allow null if not required
  // }),

  instituteName: Yup.string().required('Institute Name is required'),
  stayDuration: Yup.string().required('Stay Duration is required'),
  healthIssue: Yup.string().required('Health info is required'),
  vehicleNumber: Yup.string().required('Vehicle Number is required'),

  fatherName: Yup.string().required('Father Name is required'),
  fatherOccupation: Yup.string().required('Father Occupation is required'),
  motherName: Yup.string().required('Mother Name is required'),
  motherOccupation: Yup.string().required('Mother Occupation is required'),
  parentsPhone1: Yup.string().required('Father mobile is required').min(10,'Mobile should be 10 digit'),
  parentsPhone2: Yup.string().required('Nother mobile is required').min(10,'Mobile should be 10 digit'),
  parentsAddress: Yup.string().required('Parent address is required'),
  pincode: Yup.string().required('Pincode is required').min(6,'Pincode should be 6 digit'),
  parentAddressDistrict: Yup.string().required('Parent district is required'),
  state: Yup.string().required('Parent state is required'),
  parentAddressCountry: Yup.string().required('Parent country is required'),

  guardianName: Yup.string().required('Guardian Name is required'),
  guardianNumber: Yup.string().min(10, 'Minimum length should be 10').required('Guardian Number is required'),
  guardianAddress: Yup.string().required('Guardian address is required'),
  guardianAddressPincode: Yup.string().required('Guardian pincode is required').min(6,'Pincode should be 6 digit'),
  guardianAddressDistrict: Yup.string().required('Guardian district is required'),
  guardianAddressState: Yup.string().required('Guardian state is required'),
  guardianAddressCountry: Yup.string().required('Guardian country is required'),

  candidateImg: Yup.object().required('Candidate image is required'),
  aadhareFront: Yup.object().required('Aadhar front is required'),
  aadhareBack: Yup.object().required('Aadhar back is required'),
});
