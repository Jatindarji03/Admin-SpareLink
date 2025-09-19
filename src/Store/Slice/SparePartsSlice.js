import { createSlice } from "@reduxjs/toolkit";

const sparePartsSlice = createSlice({
  name: "spareParts",
  initialState: {
    items: [],   // all spare parts
    selected: null, // optional: currently selected part
  },
  reducers: {
    setSpareParts: (state, action) => {
      state.items = action.payload;
    },
    selectPart: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setSpareParts, selectPart } = sparePartsSlice.actions;
export default sparePartsSlice.reducer;
