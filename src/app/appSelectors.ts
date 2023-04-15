import {AppStateType} from "app/store";

export const selectAppStatus = (state: AppStateType) => state.app.status
export const selectAppIsInitialized = (state: AppStateType) => state.app.isInitialized
export const selectAppError = (state: AppStateType) => state.app.error