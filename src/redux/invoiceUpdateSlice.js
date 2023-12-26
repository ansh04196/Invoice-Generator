import { createSlice } from "@reduxjs/toolkit";

const invoiceUpdateSlice = createSlice({
    name: "invoiceBulk",
    initialState: [],
    reducers: {
        invoiceUpdateBulk: (state, action) => {
            state.push(...action.payload);
        },
        invoiceClearBulk: (state, action) => {
            return [];
        },
    },
});

export const {
    invoiceUpdateBulk, invoiceClearBulk
} = invoiceUpdateSlice.actions;

export const InvoiceListBulk = (state) => state.invoiceBulk;

export default invoiceUpdateSlice.reducer;