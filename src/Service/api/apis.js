import axios from 'axios';
import BASE_URL, { BASE_URL_WEB } from '../../Utils/config';
import { Alert } from 'react-native';
import { logoutClient, logOutUser } from '../../Hooks/useAuth';
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { LOCAL_BASE_URL, getAllNotifications_Api, getProperty_Api } from '../../Utils/config';

const navigationRef = createNavigationContainerRef();

const api = axios.create({
  baseURL: BASE_URL,
});

let logoutInitiated = false;
let networkInitiated = false;
let sessionError = false;





export const getPropertyAPI = async (id) => {
  try {
    const response = await axios.get(`${LOCAL_BASE_URL}/${getProperty_Api}/${id}`);
    console.log(`GetPropertyById API Response (ID: ${id}):`, response.data);
    return response.data;
  } catch (error) {
    console.log('GetPropertyById API Error:', error?.response?.data || error.message);
    throw error;
  }
};

export const updatePropertyAPI = async (id, formData) => {
  try {
    const response = await axios.post(`${LOCAL_BASE_URL}/property/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(`UpdateProperty API Response (ID: ${id}):`, response.data);
    return response.data;
  } catch (error) {
    console.log('UpdateProperty API Error:', error?.response?.data || error.message);
    throw error;
  }
};




export const getRoomsAPI = async (propertyId) => {
  try {
    const response = await axios.get(`${LOCAL_BASE_URL}/property-rooms/${propertyId}`);
    console.log("Rooms API Response:", response.data);
    return response.data;
  } catch (error) {
    console.log("Rooms API Error:", error.message);
    throw error;
  }
};



export const getRoomByIdAPI = async (roomId) => {
  try {
    const response = await axios.get(`${LOCAL_BASE_URL}/rooms/${roomId}`);
    console.log("Room By ID API Response:", response.data);
    return response.data;
  } catch (error) {
    console.log('Room By ID API Error:', error.message);
    throw error;
  }
};



export const updateRoomAPI = async (roomId, formData) => {
  try {
    const response = await axios.post(`${LOCAL_BASE_URL}/room/update/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(`UpdateRoom API Response (ID: ${roomId}):`, response.data);
    return response.data;
  } catch (error) {
    console.log('UpdateRoom API Error:', error?.response?.data || error.message);
    throw error;
  }
};



 



export const fetchData = async (endpoint, token) => {
  try {
    const response = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const apiResponse = response.data;
      console.log(apiResponse);
      if (apiResponse) {
        if (apiResponse.status) {
          return apiResponse;
        } else {
          throw new Error(apiResponse.message);
        }
      }
    } else {
      throw new Error(response.message);
      // throw new Error(`Request failed with status code aman ${response.status}`);
    }
  } catch (err) {
    console.log(`axios fetch error ${endpoint}:`, err.response.data);
    logoutInitiated = true;
    if (
      err.response.data.error === 'User session not found' &&
      logoutInitiated && !sessionError
    ) {
      sessionError = true; // Prevent multiple alerts

      Alert.alert('Session Error', err?.response?.data?.message, [
        {
          text: 'Logout',
          onPress: async () => {
            dispatch(logoutClient());
            if (navigationRef.isReady()) {
              navigationRef.dispatch(StackActions.replace('SwitchRole'));
            }
            logoutInitiated = false;
            sessionError = false;
          },
        },
      ]);

    } else {
      throw err.response.data;
    }
    throw err; // Ensure the error is still thrown for further handling
  }
};

export const postData = async (endpoint, token, data, multipartForm) => {
  try {
    let formData = new FormData();
    if (multipartForm) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
    } else {
      formData = data;
    }
    console.log('requetedUrl', BASE_URL_WEB + endpoint);
    const response = await axios.post((endpoint == "openPageOnWeb" ? BASE_URL_WEB : BASE_URL) + endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('axios response: ', response?.data);
    return response?.data;
  } catch (error) {
    console.log('axios error message: ', error?.message);
    console.log('axios error response: ', error?.response?.data);

    if (error.response) {
      return error?.response?.data; // You can return the error response data
    } else if (error?.request) {
      console.log('servere request error:', error?.request?._response);
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error; // Re-throw the error if you need it to be handled elsewhere
  }
};

export const putData = async (endpoint, token, data) => {
  try {
    const response = await axios.put(BASE_URL + endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        // Other headers...
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint, token) => {
  try {
    const response = await axios.delete(BASE_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (endpoint, token, data, name) => {
  try {
    const response = await axios.delete(BASE_URL + endpoint, {
      params: {
        imageName: data,
        inputName: name,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
