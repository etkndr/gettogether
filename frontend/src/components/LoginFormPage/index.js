import React, { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import "./LoginForm.css"
import { useHistory } from 'react-router-dom';


export default function LoginFormPage ({ clearData }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [disabled, setDisabled] = useState(true)
    const history = useHistory()


    useEffect(() => {
        if (credential.length > 3 &&
            password.length > 5) {
            setDisabled(false)
            } else {
                setDisabled(true)
            }
        }, [credential,
            password]
    )

    useEffect(() => {
        setCredential('')
        setPassword('')
        setErrors([])
        setDisabled(true)
    }, [clearData])

    if (sessionUser) {
        return <Redirect to="/" />
    }

    const demoUser = (e) => {
        const user = {
            credential: "Demo-lition",
            password: "password"
        }

        history.push("/")
        return dispatch(sessionActions.login(user))
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
        <div>
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
                    <button className={login} type="submit" disabled={disabled}>Log in</button>
                </form>
                <button className="demo-btn" onClick={demoUser}>Log in as demo user</button>
                    </div>
    )
}