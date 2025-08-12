import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import BASE_URL from '../../Utils/config';
import {
  fetchData,
  postData,
  putData,
  deleteData,
  deleteImage,
} from '../api/apis';
import {
  adminVerifiedHostelTokenThunkAPI,
  avilabelSeatForBookingThunkAPI,
  createStudentRegFormDownloadThunkAPI,
  deleteMainRegisterThunkAPI,
  deleteOldStudentRecordsThunkAPI,
  deleteStudentBookingThunkAPI,
  downloadStudentDocumentsThunkAPI,
  getStudentReviewsThunkAPI,
  restoreOldToMainRegisterThunkAPI,
  selfStudentToMainRegisterThunkAPI,
  shareRegistrationFormThunkAPI,
  switchRoomMainRegisterThunkAPI,
  termsAndConditionspdfThunkAPI,
  updateStudentRegisterThunkAPI,
  uploadStudentAadharImgThunkAPI,
  uploadStudentAndParentSingImageThunkAPI,
} from '../api/thunks';

const INITIAL_STATE = {
  registerListResponse: {
    response: [],
    loading: false,
  },
  registerBasicDataResponse: {
    response: [],
    loading: false,
  },
  getSelfRegisterStudentsResponse: {
    response: [],
    loading: false,
  },
  deleteSelfStudentResponse: {
    response: [],
    loading: false,
  },
  deleteMainRegisterResponse: {
    response: [],
    loading: false,
  },
  deleteStudentBookingResponse: {
    response: [],
    loading: false,
  },
  getOldStudentRegisterResponse: {
    response: [],
    loading: false,
  },
  restoreOldToMainRegisterResponse: {
    response: [],
    loading: false,
  },
  deleteOldStudentRecordsResponse: {
    response: [],
    loading: false,
  },
  roomsListResponse: {
    response: [],
    loading: false,
  },
  seatsListResponse: {
    response: [],
    loading: false,
  },
  avilabelSeatForBookingResponse: {
    response: [],
    loading: false,
  },
  formNumberResponse: {
    response: [],
    loading: false,
  },
  studentRegisterationResponse: {
    response: [],
    loading: false,
  },
  adminVerifiedHostelTokenResponse: {
    response: [],
    loading: false,
  },
  getStudentReviewsResponse: {
    response: [],
    loading: false,
  },
  uploadStudentAadharImgResponse: {
    response: [],
    loading: false,
  },
  uploadStudentAndParentSingImageResponse: {
    response: [],
    loading: false,
  },
  switchRoomMainRegisterResponse: {
    response: [],
    loading: false,
  },
  selfStudentToMainRegisterResponse: {
    response: [],
    loading: false,
  },
  updateStudentRegisterResponse: {
    response: [],
    loading: false,
  },
  createStudentRegFormDownloadResponse: {
    response: [],
    loading: false,
  },
  downloadStudentDocumentsResponse: {
    response: [],
    loading: false,
  },
  termsAndConditionspdfResponse: {
    response: [],
    loading: false,
  },
  shareRegistrationFormResponse: {
    response: [],
    loading: false,
  },
  imageUploadResponse: {
    response: [],
    loading: false,
    error: null,
  },
  imageDeleteResponse: {
    response: [],
    loading: false,
    error: null,
  },
  candidateData: {
    response: [],
    loading: false,
    error: null,
  },
  genrateRegisterStudentReport:{
    response: [],
    loading: false,
  },
  genrateOldStudentReport:{
    response: [],
    loading: false,
  }

};

export const createImageUploadThunkApi = createAsyncThunk(
  'registration/createImageUploadThunk',
  async ({data, token}, {getState}) => {
    return await postData('store-image', token, data);
  },
);

export const deleteImageThunkApi = createAsyncThunk(
  'registration/deleteImageThunkApi',
  async ({data, name, token}, {getState}) => {
    return await deleteImage('delete-image', token, data, name);
  },
);

export const handleRegistrationListAPI = createAsyncThunk(
  'Registeration/handleRegistrationListAPI',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getRegistrationData', token);
  },
);

export const handleBasicRegisterDetails = createAsyncThunk(
  'Registeration/handleBasicRegisterDetails',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getBasicRegisterDetails', token);
  },
);

export const getSelfRegisterStudentsThunkAPI = createAsyncThunk(
  'Registeration/getSelfRegisterStudentsThunkAPI',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getSelfRegisterStudents', token);
  },
);

export const deleteSelfStudentThunkAPI = createAsyncThunk(
  'Registeration/deleteSelfStudentThunkAPI',
  async (id, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await deleteData('deleteSelfStudent/' + id, token);
  },
);

export const getOldStudentRegisterThunkAPI = createAsyncThunk(
  'Registeration/getOldStudentRegisterThunkAPI',
  async ({page, perPage}, {getState}) => {
    const {token} = getState().root.auth.userData;
    const response = await fetchData(
      `getOldStudentRegister?page=${page}&per_page=${perPage}`,
      token,
    );
    // Assuming the response includes an array of data
    return response;
  },
);

export const GetRoomsListApi = createAsyncThunk(
  'Registeration/GetRoomsListApi',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getRoomNo', token);
  },
);

export const getCnadidateThunkApi = createAsyncThunk(
  'Registeration/getCnadidateThunkApi',
  async ({token, room}) => {
    return await fetchData(`getCandidateNameAndId?roomNumber=${room}`, token);
  },
);

export const GetSeatsListApi = createAsyncThunk(
  'Registeration/GetSeatsListApi',
  async (params, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData(`getSeatNo/${params.roomNo}`, token);
  },
);

export const GetFormNo = createAsyncThunk(
  'Registeration/GetFormNo',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getFormNo', token);
  },
);

export const studentRegisterApi = createAsyncThunk(
  'Registeration/studentRegisterApi',
  async (data, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await postData('studentRegister', token, data);
  },
);

// genrateRegisterStudentReport
export const genrateRegisterStudentReportThunkApi = createAsyncThunk(
  'Registeration/genrateRegisterStudentReportThunkApi',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('genrateRegisterStudentReport', token);
  },
);

// genrateOldStudentReport
export const genrateOldStudentReportThunkApi = createAsyncThunk(
  'Registeration/genrateOldStudentReportThunkApi',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('genrateOldStudentReport', token);
  },
);

const registerSlice = createSlice({
  name: 'Registeration',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(handleRegistrationListAPI.pending, state => {
        state.registerListResponse.loading = true;
        state.registerListResponse.error = null;
      })
      .addCase(handleRegistrationListAPI.fulfilled, (state, action) => {
        state.registerListResponse.loading = false;
        state.registerListResponse.response = action?.payload?.data;
      })
      .addCase(handleRegistrationListAPI.rejected, (state, action) => {
        state.registerListResponse.loading = false;
        state.registerListResponse.error = action?.error?.message;
      })
      .addCase(handleBasicRegisterDetails.pending, state => {
        state.registerBasicDataResponse.loading = true;
      })
      .addCase(handleBasicRegisterDetails.fulfilled, (state, action) => {
        state.registerBasicDataResponse.loading = false;
        state.registerBasicDataResponse.response = action?.payload?.data;
      })
      .addCase(handleBasicRegisterDetails.rejected, (state, action) => {
        state.registerBasicDataResponse.loading = false;
        state.registerBasicDataResponse.response = action?.payload?.message;
        state = {
          ...state,
          registerBasicDataResponse: INITIAL_STATE.registerBasicDataResponse,
        };
      })
      .addCase(getSelfRegisterStudentsThunkAPI.pending, state => {
        state.getSelfRegisterStudentsResponse.loading = true;
      })
      .addCase(getSelfRegisterStudentsThunkAPI.fulfilled, (state, action) => {
        state.getSelfRegisterStudentsResponse.loading = false;
        state.getSelfRegisterStudentsResponse.response = action?.payload?.data;
      })
      .addCase(getSelfRegisterStudentsThunkAPI.rejected, (state, action) => {
        state.getSelfRegisterStudentsResponse.error = action?.error?.message;
        state = {
          ...state,
          getSelfRegisterStudentsResponse:
            INITIAL_STATE.getSelfRegisterStudentsResponse,
        };
      })
      .addCase(selfStudentToMainRegisterThunkAPI.pending, state => {
        state.selfStudentToMainRegisterResponse.loading = true;
      })
      .addCase(selfStudentToMainRegisterThunkAPI.fulfilled, (state, action) => {
        state.selfStudentToMainRegisterResponse.loading = false;
        state.selfStudentToMainRegisterResponse.response =
          action?.payload?.data;
      })
      .addCase(selfStudentToMainRegisterThunkAPI.rejected, (state, action) => {
        state.selfStudentToMainRegisterResponse.error = action?.error?.message;
        state = {
          ...state,
          selfStudentToMainRegisterResponse:
            INITIAL_STATE.selfStudentToMainRegisterResponse,
        };
      })
      .addCase(deleteSelfStudentThunkAPI.pending, state => {
        state.deleteSelfStudentResponse.loading = true;
      })
      .addCase(deleteSelfStudentThunkAPI.fulfilled, (state, action) => {
        state.deleteSelfStudentResponse.loading = false;
        state.deleteSelfStudentResponse.response = action?.payload?.data;
      })
      .addCase(deleteSelfStudentThunkAPI.rejected, (state, action) => {
        state.deleteSelfStudentResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteSelfStudentResponse: INITIAL_STATE.deleteSelfStudentResponse,
        };
      })
      .addCase(deleteStudentBookingThunkAPI.pending, state => {
        state.deleteStudentBookingResponse.loading = true;
      })
      .addCase(deleteStudentBookingThunkAPI.fulfilled, (state, action) => {
        state.deleteStudentBookingResponse.loading = false;
        state.deleteStudentBookingResponse.response = action?.payload?.data;
      })
      .addCase(deleteStudentBookingThunkAPI.rejected, (state, action) => {
        state.deleteStudentBookingResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteStudentBookingResponse:
            INITIAL_STATE.deleteStudentBookingResponse,
        };
      })
      .addCase(deleteMainRegisterThunkAPI.pending, state => {
        state.deleteMainRegisterResponse.loading = true;
      })
      .addCase(deleteMainRegisterThunkAPI.fulfilled, (state, action) => {
        state.deleteMainRegisterResponse.loading = false;
        state.deleteMainRegisterResponse.response = action?.payload?.data;
      })
      .addCase(deleteMainRegisterThunkAPI.rejected, (state, action) => {
        state.deleteMainRegisterResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteMainRegisterResponse: INITIAL_STATE.deleteMainRegisterResponse,
        };
      })
      .addCase(switchRoomMainRegisterThunkAPI.pending, state => {
        state.switchRoomMainRegisterResponse.loading = true;
      })
      .addCase(switchRoomMainRegisterThunkAPI.fulfilled, (state, action) => {
        state.switchRoomMainRegisterResponse.loading = false;
        state.switchRoomMainRegisterResponse.response = action?.payload?.data;
      })
      .addCase(switchRoomMainRegisterThunkAPI.rejected, (state, action) => {
        state.switchRoomMainRegisterResponse.error = action?.error?.message;
        state = {
          ...state,
          switchRoomMainRegisterResponse:
            INITIAL_STATE.switchRoomMainRegisterResponse,
        };
      })
      .addCase(restoreOldToMainRegisterThunkAPI.pending, state => {
        state.restoreOldToMainRegisterResponse.loading = true;
      })
      .addCase(restoreOldToMainRegisterThunkAPI.fulfilled, (state, action) => {
        state.restoreOldToMainRegisterResponse.loading = false;
        state.restoreOldToMainRegisterResponse.response = action?.payload?.data;
      })
      .addCase(restoreOldToMainRegisterThunkAPI.rejected, (state, action) => {
        state.restoreOldToMainRegisterResponse.error = action?.error?.message;
        state = {
          ...state,
          restoreOldToMainRegisterResponse:
            INITIAL_STATE.restoreOldToMainRegisterResponse,
        };
      })
      .addCase(getOldStudentRegisterThunkAPI.pending, state => {
        state.getOldStudentRegisterResponse.loading = true;
      })
      .addCase(getOldStudentRegisterThunkAPI.fulfilled, (state, action) => {
        state.getOldStudentRegisterResponse.loading = false;

        // Append new data to existing data
        if (state.getOldStudentRegisterResponse.response) {
          state.getOldStudentRegisterResponse.response = [
            ...state.getOldStudentRegisterResponse.response,
            ...action.payload.data,
          ];
        } else {
          state.getOldStudentRegisterResponse.response = action.payload.data;
        }

        // Store hasNextPage in the state
        state.getOldStudentRegisterResponse.hasNextPage =
          action.payload.pagination.last_page;
      })
      .addCase(getOldStudentRegisterThunkAPI.rejected, (state, action) => {
        state.getOldStudentRegisterResponse.error = action?.error?.message;
        state.getOldStudentRegisterResponse.loading = false;
        state = {
          ...state,
          getOldStudentRegisterResponse:
            INITIAL_STATE.getOldStudentRegisterResponse,
        };
      })
      .addCase(deleteOldStudentRecordsThunkAPI.pending, state => {
        state.deleteOldStudentRecordsResponse.loading = true;
      })
      .addCase(deleteOldStudentRecordsThunkAPI.fulfilled, (state, action) => {
        state.deleteOldStudentRecordsResponse.loading = false;
        state.deleteOldStudentRecordsResponse.response = action?.payload?.data;
        if (action?.payload?.registrationNumber) {
          state.getOldStudentRegisterResponse.response =
            state.getOldStudentRegisterResponse.response.filter(
              item =>
                item.registrationNumber !== action?.payload?.registrationNumber,
            );
        }
      })
      .addCase(deleteOldStudentRecordsThunkAPI.rejected, (state, action) => {
        state.deleteOldStudentRecordsResponse.loading = false;
        state.deleteOldStudentRecordsResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteOldStudentRecordsResponse:
            INITIAL_STATE.deleteOldStudentRecordsResponse,
        };
      })
      .addCase(GetRoomsListApi.pending, state => {
        state.roomsListResponse.loading = true;
      })
      .addCase(GetRoomsListApi.fulfilled, (state, action) => {
        state.roomsListResponse.loading = false;
        state.roomsListResponse.response = action?.payload;
      })
      .addCase(GetRoomsListApi.rejected, (state, action) => {
        state.roomsListResponse.loading = false;
        state.roomsListResponse.error = action?.error?.message;
        state = {
          ...state,
          roomsListResponse: INITIAL_STATE.roomsListResponse,
        };
      })
      .addCase(GetSeatsListApi.pending, state => {
        state.seatsListResponse.loading = true;
      })
      .addCase(GetSeatsListApi.fulfilled, (state, action) => {
        state.seatsListResponse.loading = false;
        state.seatsListResponse.response = action?.payload;
      })
      .addCase(GetSeatsListApi.rejected, (state, action) => {
        state.seatsListResponse.loading = false;
        state.seatsListResponse.error = action?.error?.message;
        state = {
          ...state,
          seatsListResponse: INITIAL_STATE.seatsListResponse,
        };
      })
      .addCase(avilabelSeatForBookingThunkAPI.pending, state => {
        state.avilabelSeatForBookingResponse.loading = true;
      })
      .addCase(avilabelSeatForBookingThunkAPI.fulfilled, (state, action) => {
        state.avilabelSeatForBookingResponse.loading = false;
        state.avilabelSeatForBookingResponse.response = action?.payload;
      })
      .addCase(avilabelSeatForBookingThunkAPI.rejected, (state, action) => {
        //
        state.avilabelSeatForBookingResponse.error = action?.error?.message;
        state = {
          ...state,
          avilabelSeatForBookingResponse:
            INITIAL_STATE.avilabelSeatForBookingResponse,
        };
      })
      .addCase(GetFormNo.pending, state => {
        state.formNumberResponse.loading = true;
        state.imageUploadResponse.response = [];
      })
      .addCase(GetFormNo.fulfilled, (state, action) => {
        state.formNumberResponse.loading = false;
        state.formNumberResponse.response = action?.payload;
      })
      .addCase(GetFormNo.rejected, (state, action) => {
        state.formNumberResponse.loading = false;
        state.formNumberResponse.error = action?.error?.message;
        state = {
          ...state,
          formNumberResponse: INITIAL_STATE.formNumberResponse,
        };
      })
      .addCase(studentRegisterApi.pending, state => {
        state.studentRegisterationResponse.loading = true;
      })
      .addCase(studentRegisterApi.fulfilled, (state, action) => {
        state.studentRegisterationResponse.loading = false;
        state.studentRegisterationResponse.response = action?.payload;
      })
      .addCase(studentRegisterApi.rejected, (state, action) => {
        //

        state.studentRegisterationResponse.loading = false;
        state.studentRegisterationResponse.error = action?.error?.message;
        state = {
          ...state,
          studentRegisterationResponse:
            INITIAL_STATE.studentRegisterationResponse,
        };
      })
      .addCase(adminVerifiedHostelTokenThunkAPI.pending, state => {
        state.adminVerifiedHostelTokenResponse.loading = true;
      })
      .addCase(adminVerifiedHostelTokenThunkAPI.fulfilled, (state, action) => {
        state.adminVerifiedHostelTokenResponse.loading = false;
        state.adminVerifiedHostelTokenResponse.response = action?.payload;
      })
      .addCase(adminVerifiedHostelTokenThunkAPI.rejected, (state, action) => {
        //

        state.adminVerifiedHostelTokenResponse.loading = false;
        state.adminVerifiedHostelTokenResponse.error = action?.error?.message;
        state = {
          ...state,
          adminVerifiedHostelTokenResponse:
            INITIAL_STATE.adminVerifiedHostelTokenResponse,
        };
      })
      .addCase(getStudentReviewsThunkAPI.pending, state => {
        state.getStudentReviewsResponse.loading = true;
      })
      .addCase(getStudentReviewsThunkAPI.fulfilled, (state, action) => {
        state.getStudentReviewsResponse.loading = false;
        state.getStudentReviewsResponse.response = action?.payload;
      })
      .addCase(getStudentReviewsThunkAPI.rejected, (state, action) => {
        //

        state.getStudentReviewsResponse.loading = false;
        state.getStudentReviewsResponse.error = action?.error?.message;
        state = {
          ...state,
          getStudentReviewsResponse: INITIAL_STATE.getStudentReviewsResponse,
        };
      })
      .addCase(uploadStudentAadharImgThunkAPI.pending, state => {
        state.uploadStudentAadharImgResponse.loading = true;
      })
      .addCase(uploadStudentAadharImgThunkAPI.fulfilled, (state, action) => {
        state.uploadStudentAadharImgResponse.loading = false;
        state.uploadStudentAadharImgResponse.response = action?.payload;
      })
      .addCase(uploadStudentAadharImgThunkAPI.rejected, (state, action) => {
        //

        state.uploadStudentAadharImgResponse.loading = false;
        state.uploadStudentAadharImgResponse.error = action?.error?.message;
        state = {
          ...state,
          uploadStudentAadharImgResponse:
            INITIAL_STATE.uploadStudentAadharImgResponse,
        };
      })
      .addCase(uploadStudentAndParentSingImageThunkAPI.pending, state => {
        state.uploadStudentAndParentSingImageResponse.loading = true;
      })
      .addCase(
        uploadStudentAndParentSingImageThunkAPI.fulfilled,
        (state, action) => {
          state.uploadStudentAndParentSingImageResponse.loading = false;
          state.uploadStudentAndParentSingImageResponse.response =
            action?.payload;
        },
      )
      .addCase(
        uploadStudentAndParentSingImageThunkAPI.rejected,
        (state, action) => {
          //

          state.uploadStudentAndParentSingImageResponse.loading = false;
          state.uploadStudentAndParentSingImageResponse.error =
            action?.error?.message;
          state = {
            ...state,
            uploadStudentAndParentSingImageResponse:
              INITIAL_STATE.uploadStudentAndParentSingImageResponse,
          };
        },
      )
      .addCase(updateStudentRegisterThunkAPI.pending, state => {
        state.updateStudentRegisterResponse.loading = true;
      })
      .addCase(updateStudentRegisterThunkAPI.fulfilled, (state, action) => {
        state.updateStudentRegisterResponse.loading = false;
        state.updateStudentRegisterResponse.response = action?.payload;
      })
      .addCase(updateStudentRegisterThunkAPI.rejected, (state, action) => {
        //

        state.updateStudentRegisterResponse.loading = false;
        state.updateStudentRegisterResponse.error = action?.error?.message;
        state = {
          ...state,
          updateStudentRegisterResponse:
            INITIAL_STATE.updateStudentRegisterResponse,
        };
      })
      .addCase(createStudentRegFormDownloadThunkAPI.pending, state => {
        state.createStudentRegFormDownloadResponse.loading = true;
      })
      .addCase(
        createStudentRegFormDownloadThunkAPI.fulfilled,
        (state, action) => {
          state.createStudentRegFormDownloadResponse.loading = false;
          state.createStudentRegFormDownloadResponse.response = action?.payload;
        },
      )
      .addCase(
        createStudentRegFormDownloadThunkAPI.rejected,
        (state, action) => {
          //

          state.createStudentRegFormDownloadResponse.loading = false;
          state.createStudentRegFormDownloadResponse.error =
            action?.error?.message;
          state = {
            ...state,
            createStudentRegFormDownloadResponse:
              INITIAL_STATE.createStudentRegFormDownloadResponse,
          };
        },
      )
      .addCase(downloadStudentDocumentsThunkAPI.pending, state => {
        state.downloadStudentDocumentsResponse.loading = true;
      })
      .addCase(downloadStudentDocumentsThunkAPI.fulfilled, (state, action) => {
        state.downloadStudentDocumentsResponse.loading = false;
        state.downloadStudentDocumentsResponse.response = action?.payload;
      })
      .addCase(downloadStudentDocumentsThunkAPI.rejected, (state, action) => {
        //

        state.downloadStudentDocumentsResponse.loading = false;
        state.downloadStudentDocumentsResponse.error = action?.error?.message;
        state = {
          ...state,
          downloadStudentDocumentsResponse:
            INITIAL_STATE.downloadStudentDocumentsResponse,
        };
      })
      .addCase(termsAndConditionspdfThunkAPI.pending, state => {
        state.termsAndConditionspdfResponse.loading = true;
      })
      .addCase(termsAndConditionspdfThunkAPI.fulfilled, (state, action) => {
        state.termsAndConditionspdfResponse.loading = false;
        state.termsAndConditionspdfResponse.response = action?.payload;
      })
      .addCase(termsAndConditionspdfThunkAPI.rejected, (state, action) => {
        //

        state.termsAndConditionspdfResponse.loading = false;
        state.termsAndConditionspdfResponse.error = action?.error?.message;
        state = {
          ...state,
          termsAndConditionspdfResponse:
            INITIAL_STATE.termsAndConditionspdfResponse,
        };
      })
      .addCase(shareRegistrationFormThunkAPI.pending, state => {
        state.shareRegistrationFormResponse.loading = true;
      })
      .addCase(shareRegistrationFormThunkAPI.fulfilled, (state, action) => {
        state.shareRegistrationFormResponse.loading = false;
        state.shareRegistrationFormResponse.response = action?.payload;
      })
      .addCase(shareRegistrationFormThunkAPI.rejected, (state, action) => {
        //

        state.shareRegistrationFormResponse.loading = false;
        state.shareRegistrationFormResponse.error = action?.error?.message;
        state = {
          ...state,
          shareRegistrationFormResponse:
            INITIAL_STATE.shareRegistrationFormResponse,
        };
      })
      .addCase(createImageUploadThunkApi.pending, state => {
        state.imageUploadResponse.loading = true;
        state.imageUploadResponse.error = null;
      })
      .addCase(createImageUploadThunkApi.fulfilled, (state, action) => {
        state.imageUploadResponse.loading = false;
        state.imageUploadResponse.response = action?.payload?.data?.fileName;
      })
      .addCase(createImageUploadThunkApi.rejected, (state, action) => {
        state.imageUploadResponse.loading = false;
        state.imageUploadResponse.error = action?.payload?.message;
      })
      .addCase(deleteImageThunkApi.pending, state => {
        state.imageDeleteResponse.loading = true;
        state.imageDeleteResponse.error = null;

        // Do not clear the entire `imageUploadResponse.response`
      })
      .addCase(deleteImageThunkApi.fulfilled, (state, action) => {
        state.imageDeleteResponse.loading = false;
        state.imageDeleteResponse.response = action?.payload?.data?.inputName;
      })
      .addCase(deleteImageThunkApi.rejected, (state, action) => {
        state.imageDeleteResponse.loading = false;
        state.imageDeleteResponse.error = action?.payload?.message;
      })
      .addCase(getCnadidateThunkApi.pending, state => {
        state.candidateData.loading = true;
        state.candidateData.error = null;
      })
      .addCase(getCnadidateThunkApi.fulfilled, (state, action) => {
        state.candidateData.loading = false;
        state.candidateData.response = action?.payload.data;
      })
      .addCase(getCnadidateThunkApi.rejected, (state, action) => {
        state.candidateData.loading = false;
        state.candidateData.error = action?.payload?.message;
      })
      .addCase(genrateRegisterStudentReportThunkApi.pending, state => {
        state.genrateRegisterStudentReport.loading = true;
      })
      .addCase(genrateRegisterStudentReportThunkApi.fulfilled, (state, action) => {
        state.genrateRegisterStudentReport.loading = false;
        state.genrateRegisterStudentReport.response = action?.payload;
      })
      .addCase(genrateRegisterStudentReportThunkApi.rejected, (state, action) => {
        state.genrateRegisterStudentReport.loading = false;
        state.genrateRegisterStudentReport.error = action?.error?.message;
      })
      .addCase(genrateOldStudentReportThunkApi.pending, (state, action) => {
        state.genrateOldStudentReport.loading = true;
      })
      .addCase(genrateOldStudentReportThunkApi.fulfilled, (state, action) => {
        state.genrateOldStudentReport.loading = false;
        state.genrateOldStudentReport.response = action?.payload;
      })
      .addCase(genrateOldStudentReportThunkApi.rejected, (state, action) => {
        state.genrateOldStudentReport.loading = false;
        state.genrateOldStudentReport.error = action?.error?.message;
      })
      ;
  },
});

export default registerSlice.reducer;
