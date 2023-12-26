import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; // Import your other reducers
import invoiceUpdateReducer from "./invoiceUpdateSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  invoiceBulk: invoiceUpdateReducer,
});

export default rootReducer;
