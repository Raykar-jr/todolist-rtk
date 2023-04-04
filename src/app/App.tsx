import React, {useEffect} from 'react'
import s from './App.module.css'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import { HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/Login/Login";
import CircularProgress from "@mui/material/CircularProgress";
import {logoutTC} from "features/Login/auth-reducer";


function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    const logOutHandler = () => {
        dispatch(logoutTC())
    }
    return (
        <HashRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar className={s.toolbar}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            Todolist
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistsList/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/404' element={<h1>Page not found</h1>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Container>
            </div>
        </HashRouter>
    )
}

export default App

