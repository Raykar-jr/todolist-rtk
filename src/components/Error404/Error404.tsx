import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import {useNavigate} from 'react-router-dom'

import s from './Error404.module.css'

import image404 from 'assets/images/404.svg'

export const Error404 = () => {
    const navigate = useNavigate()

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} style={{marginTop: '200px'}}>
            <Grid display="flex" justifyContent="center" alignItems="center" gap={'62px'}>
                <Box>
                    <Box sx={{marginBottom: '36px'}}>
                        <span className={s.header}>Ooops!</span>
                        <p className={s.description}>Sorry! Page not found!</p>
                    </Box>
                    <Button
                        className={s.button}
                        variant="contained"
                        sx={{borderRadius: '30px'}}
                        onClick={() => navigate('/')}
                    >
                        Back to home page
                    </Button>
                </Box>
                <div>
                    <img src={image404} alt="image-error404"/>
                </div>
            </Grid>
        </Grid>
    )
}
