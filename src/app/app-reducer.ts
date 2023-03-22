import {Dispatch} from "redux";
import {authAPI} from "api/todolists-api";
import { setIsLoggedInAC } from "features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";



const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})
export const appReducer = slice.reducer
export const setAppErrorAC = slice.actions.setAppErrorAC
export const setAppStatusAC = slice.actions.setAppStatusAC
export const setIsInitializedAC = slice.actions.setIsInitializedAC



// thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({ value: true }));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setIsInitializedAC({ isInitialized: true}))
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

