import React, {useEffect} from 'react'
import s from './App.module.css'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {initializeApp} from './app-reducer'
import Container from '@mui/material/Container';
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/Login/Login";
import CircularProgress from "@mui/material/CircularProgress";
import {Header} from "components/Header/Header";
import {Error404} from "components/Error404/Error404";
import {selectAppIsInitialized} from "app/appSelectors";

export const App = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeApp())
    }, [])

    const isInitialized = useAppSelector<boolean>(selectAppIsInitialized)

    if (!isInitialized) {
        return <div className={s.loading}>
            <CircularProgress/>
        </div>
    }

    return (
        <HashRouter>
            <div className="App">
                <ErrorSnackbar/>
                <Header />
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistsList/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/404' element={<Error404 />}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Container>
            </div>
        </HashRouter>
    )
}

