import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {login} from "./auth-reducer";
import {useAppDispatch, useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import s from './Login.module.css'
import {selectIsLoggedIn} from "features/Login/loginSelectors";

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}
type FormikErrorType = Partial<FormValuesType>

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(selectIsLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required field'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required field'
            } else if (values.password.length < 3) {
                errors.password = 'Min length of the password must be 3 symbols'
            }
            return errors
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(login(values))
            if (login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        },
    })
    if (isLoggedIn) {
        return <Navigate to='/'/>
    }
    return <Grid container justifyContent={'center'} className={s.loginWrapper}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit} className={s.form}>
                <FormControl>
                    <FormLabel sx={{fontFamily: 'Montserrat'}}>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email" margin="normal" {...formik.getFieldProps('email')}/>
                        {formik.touched.email && formik.errors.email &&
                            <div className={s.errorText}> {formik.errors.email} </div>}

                        <TextField type="password" label="Password"
                                   margin="normal" {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div className={s.errorText}> {formik.errors.password} </div>}

                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox {...formik.getFieldProps('rememberMe')}
                                                             checked={formik.values.rememberMe}/>}
                        />

                        <Button sx={{mt: 2}} type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}