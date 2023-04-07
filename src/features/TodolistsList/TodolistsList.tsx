import React, {useCallback, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from 'app/store'
import {addTodolist, fetchTodolists, TodolistDomainType} from './todolists-reducer'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from "react-router-dom";
import s from './styles.module.css'

export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)

    const dispatch = useAppDispatch()

    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodolists())
    }, [])

    const addTodolistHandler = useCallback((title: string) => {
        dispatch(addTodolist(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to='/login'/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistHandler} placeholder='Enter list name'/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {

                    return <Grid className={s.todoWrapper} item key={tl.id}>
                        <Paper sx={{ p: '0px 3px 20px 20px' }}>
                            <Todolist
                                todolist={tl}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
