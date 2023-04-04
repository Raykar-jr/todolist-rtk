import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from 'api/todolists-api'
import {setAppStatusAC} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "features/TodolistsList/todolists-reducer";
import {AppStateType} from "app/store";


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                index > -1 && tasks.splice(index, 1)
            })
            .addCase(addTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks[index] = {...tasks[index], ...action.payload.model}
            })


    }
})
export const tasksReducer = slice.reducer

// thunks
export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items

        return {tasks, todolistId}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        await todolistsAPI.deleteTask(param.todolistId, param.taskId)
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            return {task}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: ParamUpdateTaskType, thunkAPI) => {
    try {
        const state = thunkAPI.getState() as AppStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return thunkAPI.rejectWithValue('task not found in the state')
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.domainModel
        }
        const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === 0) {
            return {taskId: param.taskId, model: param.domainModel, todolistId: param.todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null)
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
    }
})


// types
export type ParamUpdateTaskType = {
    taskId: string
    domainModel: UpdateDomainTaskModelType
    todolistId: string
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}