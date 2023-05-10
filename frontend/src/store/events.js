import { csrfFetch } from "./csrf"

const initState = {}

const LOAD_EVENTS = "events/loadEvents"
const GROUP_EVENTS = "events/groupEvents"
const ONE_EVENT = "events/oneEvent"
const NEW_EVENT = "events/newEvent"
const DELETE_EVENT = "events/delete"

const load = events => ({
    type: LOAD_EVENTS,
    events
})

const groupEvents = events => ({
    type: GROUP_EVENTS,
    events
})

const oneEvent = event => ({
    type: ONE_EVENT,
    event
})

const newEvent = event => {
    return {
        type: NEW_EVENT,
        event
    }
}

const dlt = event => {
    return {
        type: DELETE_EVENT,
        event
    }
}

export const getEvents = () => async dispatch => {
    const res = await fetch("/api/events")

    if (res.ok) {
        const events = await res.json()
        dispatch(load(events))
    }
}

export const getGroupEvents = (id) => async dispatch => {
    const res = await fetch(`/api/groups/${id}/events`)

    if (res.ok) {
        const events = await res.json()
        dispatch(groupEvents(events))
    }
}

export const getOneEvent = (id) => async dispatch => {
    const res = await fetch(`/api/events/${id}`)

    if (res.ok) {
        const event = await res.json()
        dispatch(oneEvent(event))
    }
}

export const createEvent = (event) => async dispatch => {
    const {name, about, price, start, end, type, privacy, image} = event
    const res = await csrfFetch("/api/events", {
        method: "POST",
        body: {
            name,
            about,
            price,
            start,
            end,
            type,
            privacy,
            image
        }
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(newEvent(data))
        return data
    }
}

export const dltEvent = (id) => async dispatch => {
    const res = await csrfFetch(`events/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dlt(data))
        return data
    }
}

export default function eventReducer(state = initState, action) {
    const newState = {...state}
switch(action.type) {
    case LOAD_EVENTS:
        newState.allEvents = action.events
        return newState
    case ONE_EVENT:
        newState.currEvent = action.event
        return newState
    case GROUP_EVENTS:
        newState.groupEvents = action.events
        return newState
    case NEW_EVENT:
        newState.allEvents[action.event.id] = action.event
        return newState
    case DELETE_EVENT:
        delete newState.allEvents[action.event.id]
        return newState
    default:
        return state
}
}