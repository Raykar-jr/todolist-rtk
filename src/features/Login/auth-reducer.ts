import {authAPI, FieldErrorType, LoginParamsType} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginTC.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logoutTC.fulfilled, state => {
                state.isLoggedIn = false
            })
    }
})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: string[], fieldsErrors: FieldErrorType[] } }>('auth/login', async (data, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        // @ts-ignore
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})