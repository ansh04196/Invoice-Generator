import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    updateAllInvoice: (state, action) => {
      for (let ele of action.payload) {
        for (let idx = 0; idx < state.length; idx++) {
          if (ele.id === state[idx].id) {
            state[idx] = ele;
          }
        }
      }
    },
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  updateAllInvoice,
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
