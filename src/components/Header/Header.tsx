import React from 'react';
import Toolbar from "@mui/material/Toolbar";
import s from "app/App.module.css";
import Typography from "@mui/material/Typography";
import logo from "assets/icons/logo.jpg";
import Button from "@mui/material/Button";
import AppBar from '@mui/material/AppBar';
import LinearProgress from "@mui/material/LinearProgress";
import {logout} from "features/Login/auth-reducer";
import {useAppDispatch, useAppSelector} from "app/store";
import {RequestStatusType} from "app/app-reducer";

export const Header = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)

    const logOutHandler = () => dispatch(logout())
    return (
        <AppBar position="static">
            <Toolbar className={s.toolbar}>
                <Typography sx={{display: 'flex', alignItems: 'center', gap: '10px'}} variant="h6">
                    <img className={s.logo} src={logo} alt=""/>
                    Task Manager
                </Typography>
                {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Log out</Button>}
            </Toolbar>
            {status === 'loading' && <LinearProgress/>}
        </AppBar>
    );
};

