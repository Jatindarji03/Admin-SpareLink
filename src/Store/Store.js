import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./Slice/SidebarSlice.js"
const store=configureStore(
    {
        reducer:{
            sidebar:sidebarReducer
        }


    }
)
export default store;