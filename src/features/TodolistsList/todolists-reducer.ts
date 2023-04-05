import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {RequestStatusType, setAppStatusAC} from 'app/app-reducer'
import {handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(addTodolistTC.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                state[index].title = action.payload.title
            })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
} = slice.actions

// thunks
export const fetchTodolistsTC = createAsyncThunk('todos/fetchTodos', async (arg, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.getTodolists()
        return {todolists: res.data}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const removeTodolistTC = createAsyncThunk('todos/removeTodo', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        // изменим статус конкретного тудулиста, чтобы он мог задизеблить свой UI во время удаления
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistId)
        return {todolistId}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const addTodolistTC = createAsyncThunk('todos/addTodo', async (title: string, {dispatch, rejectWithValue}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(title)
        return {todolist: res.data.data.item}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todos/changeTodo', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        await todolistsAPI.updateTodolist(param.id, param.title)
        return {id: param.id, title: param.title}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}