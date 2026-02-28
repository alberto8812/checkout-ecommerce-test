import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UiState = {
    isLoading: boolean;
};

const initialState: UiState = {
    isLoading: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
    },
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;
