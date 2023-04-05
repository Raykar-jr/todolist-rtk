import {authAPI} from "api/todolists-api";
import {setIsLoggedInAC} from "features/Login/auth-reducer";
import {handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as Nullable<string>,
        isInitialized: false
    },
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: Nullable<string> }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
    },
    extraReducers: builder => {
        builder
            .addCase(initializeAppTC.fulfilled, state => {
                state.isInitialized = true
            })
    }
})
export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC} = slice.actions

// thunks
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, thunkAPI) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type Nullable<T> = T | null;