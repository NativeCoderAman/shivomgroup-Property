import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers/Reducer';
import networkReducer from './slices/networkSlice';
import adminReferReducer from './slices/adminReferSlice';
import profileDataReducer from './slices/profileDataSlice';
import tenantReferVerifyReducer from './slices/tenant/tenantReferVerifySlice';
import versionReducer from './slices/versionSlice';
import MessageTemplate from "./slices/messageTemplate"
import FIlterdItem from "./slices/filterItems"
import DocumentaionTemplate from "./slices/documentationSection"
import propertyReducer  from './slices/BusinessProfile/propertySlice';
import roomReducer from './slices/BusinessProfile/roomSlice';

const store = configureStore({
  reducer: {
    network: networkReducer,
    root: rootReducer,
    adminRefer: adminReferReducer,
    profileData: profileDataReducer,
    tenantReferVerify: tenantReferVerifyReducer, 
    version: versionReducer,
    MessageTemplateManager:MessageTemplate,
    allFilteredItems:FIlterdItem,
    allDocumentaionTemplates:DocumentaionTemplate,
    property:propertyReducer,
    rooms:roomReducer,

    
  },
});

export default store;