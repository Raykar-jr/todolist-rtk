import {setAppError} from 'app/app-reducer'
import {ResponseType} from 'api/todolists-api'
import {Dispatch} from 'redux'
import {AxiosError} from "axios";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppError({ error: data.messages[0] }))
    } else {
        dispatch(setAppError({ error: 'Some error occurred' }))
    }
}

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ message: string }>
    dispatch(setAppError(err.message ? {error: err.message} : { error: 'Some error occurred' }))
}

