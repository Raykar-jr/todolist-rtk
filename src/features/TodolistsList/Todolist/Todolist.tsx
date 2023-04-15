import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {EditableSpan} from 'components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {
    changeTodolistFilter,
    changeTodolistTitle,
    FilterValuesType,
    removeTodolist,
    TodolistDomainType
} from '../todolists-reducer'
import {addTask, fetchTasks} from '../tasks-reducer'
import {useAppDispatch, useAppSelector} from "app/store";
import s from '../styles.module.css'

type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = React.memo(({todolist}: PropsType) => {
    let tasks = useAppSelector<TaskType[]>(state => state.tasks[todolist.id])

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasks(todolist.id))
    }, [])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(addTask({title, todolistId: todolist.id}))
    }, [])

    const removeTodolistHandler = useCallback(() => {
        dispatch(removeTodolist(todolist.id))
    }, [])

    const changeTodolistTitleHandler = useCallback((title: string) => {
        dispatch(changeTodolistTitle({id: todolist.id, title}))
    }, [])

    const changeFilter = useCallback((value: FilterValuesType) => {
        dispatch(changeTodolistFilter({id: todolist.id, filter: value}))
    }, [])

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3 className={s.todoTitle}>
            <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm placeholder='Enter task name' addItem={addTaskHandler}
                     disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
            {!tasks.length && <div className={s.emptyTasks}> No tasks found 😕</div>}
        </div>
        <div className={s.buttonGroup}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={() => changeFilter('all')}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={() => changeFilter('active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilter('completed')}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


