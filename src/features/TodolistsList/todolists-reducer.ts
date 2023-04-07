import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {RequestStatusType, setAppStatus} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                state[index].title = action.payload.title
            })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilter,
    changeTodolistEntityStatus,
} = slice.actions

// thunks
export const fetchTodolists = createAsyncThunk('todos/fetchTodos', async (arg, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTodolists()
        return {todolists: res.data}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
})
export const removeTodolist = createAsyncThunk('todos/removeTodo', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        // изменим статус конкретного тудулиста, чтобы он мог задизеблить свой UI во время удаления
        dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistId)
        return {todolistId}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
})
export const addTodolist = createAsyncThunk('todos/addTodo', async (title: string, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            return {todolist: res.data.data.item}
        }
        else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
})
export const changeTodolistTitle = createAsyncThunk('todos/changeTodo', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        await todolistsAPI.updateTodolist(param.id, param.title)
        return {id: param.id, title: param.title}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
})

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}