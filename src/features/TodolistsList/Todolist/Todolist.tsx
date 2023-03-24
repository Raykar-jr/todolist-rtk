import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from '../todolists-reducer'
import {addTaskTC, fetchTasksTC} from '../tasks-reducer'
import {useAppDispatch, useAppSelector} from "app/store";

type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = React.memo(function ({todolist}: PropsType) {
    let tasks = useAppSelector<TaskType[]>(state => state.tasks[todolist.id])

    const dispatch = useAppDispatch()
    useEffect(() => {
        const thunk = fetchTasksTC(todolist.id)
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string) {
        const thunk = addTaskTC(title, todolist.id)
        dispatch(thunk)
    }, [])

    const removeTodolist = useCallback(function () {
        const thunk = removeTodolistTC(todolist.id)
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (title: string) {
        const thunk = changeTodolistTitleTC(todolist.id, title)
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType) {
        const action = changeTodolistFilterAC({ id: todolist.id, filter: value })
        dispatch(action)
    }, [])

    const onAllClickHandler = useCallback(() => changeFilter('all'), [changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter('active'), [changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed'), [changeFilter])


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


