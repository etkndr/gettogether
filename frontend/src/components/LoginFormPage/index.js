import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import "./LoginForm.css"
import { useHistory } from 'react-router-dom';

export default function LoginFormPage () {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [disabled, setDisabled] = useState(true)
    const [hideModal, setHideModal] = useState(false)
    const history = useHistory()


    useEffect(() => {
        if (credential.length > 3 &&
            password.length > 5) {
            setDisabled(false)
            }
        }, [credential,
            password]
    )

    if (sessionUser) {
        return <Redirect to="/" />
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        return dispatch(sessionActions.login({credential, password}))
        .catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) setErrors(data.errors)
        })
    }

    let login;
    if (disabled) {
        login = "login-disabled"
    } else {
        login = "login"
    }

    return (
                <form onSubmit={onSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li className='errors' key={idx}>{error}</li>)}
                    </ul>
                    <label>
                        Email
                        <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        />
                    </label>
                    <label>
                        Password
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </label>
                    <button className={login} type="submit" disabled={disabled}>Log In</button>
                </form>
    )
}