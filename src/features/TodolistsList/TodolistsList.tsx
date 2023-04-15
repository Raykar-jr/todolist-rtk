import React, {useCallback, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from 'app/store'
import {addTodolist, fetchTodolists, TodolistDomainType} from './todolists-reducer'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from "react-router-dom";
import s from './styles.module.css'
import {selectIsLoggedIn} from "features/Login/loginSelectors";
import {selectTodolists} from "features/TodolistsList/todoSelectors";

export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<TodolistDomainType[]>(selectTodolists)

    const dispatch = useAppDispatch()

    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)

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
