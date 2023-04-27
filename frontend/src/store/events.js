const initState = {}

const LOAD_EVENTS = "events/loadEvents"
const GROUP_EVENTS = "events/groupEvents"
const ONE_EVENT = "events/oneEvent"

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

export default function eventReducer(state = initState, action) {
    const newState = {...state}
switch(action.type) {
    case LOAD_EVENTS:
        const allEvents = {}
        action.events.forEach((event) => {
            allEvents[event.id] = event
        })
        return {
            ...allEvents,
            ...state
        }
    case ONE_EVENT:
        newState.currEvent = action.event
        return newState
    case GROUP_EVENTS:
        newState.groupEvents = action.events
        return newState
    default:
        return state
}
}