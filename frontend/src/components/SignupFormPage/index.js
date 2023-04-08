import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupForm.css"

export default function SignupFormPage ({ clearData }) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        if (username.length > 3 &&
            firstName.length &&
            lastName.length &&
            email.length &&
            password.length > 5 &&
            confirmPassword.length &&
            confirmPassword === password) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }
        }, [username,
            firstName,
            lastName,
            email,
            password,
            confirmPassword]
    )

    useEffect(() => {
        setUsername('')
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setErrors([])
        setDisabled(true)
    }, [clearData])
    
    if (sessionUser) {
        return <Redirect to="/" />
    }
    
    const onSubmit = (e) => {
        e.preventDefault()
        setErrors([])

        const user = {
            username,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }
        
        if (confirmPassword !== password) {
            return setErrors(["Password confirmation must match password"])
        }
        
        return dispatch(sessionActions.signup(user)).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                setErrors(data.errors)
            }
        })
    }

    let signup;
    if (disabled) {
        signup = "login-disabled"
    } else {
        signup = "login"
    }
    
    return (
        <form onSubmit={onSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
                Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                First name
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </label>
            <label>
                Last name
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <label>
                Email
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>
                <button type="submit" className={signup} disabled={disabled}>Sign up</button>
        </form>
    )
}