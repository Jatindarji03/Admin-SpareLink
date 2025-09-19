import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./Slice/SidebarSlice.js"
import sparePartsReducer from "./Slice/SparePartsSlice.js";
const store=configureStore(
    {
        reducer:{
            sidebar:sidebarReducer,
            spareParts:sparePartsReducer
        }


    }
)
export default store;