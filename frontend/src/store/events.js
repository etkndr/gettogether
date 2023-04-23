const initState = {}

const LOAD_EVENTS = "events/loadEvents"
const GROUP_EVENTS = "events/groupEvents"
const CLEAR_DATA = "events/clear"

const load = events => ({
    type: LOAD_EVENTS,
    events
})

const groupEvents = events => ({
    type: GROUP_EVENTS,
    events
})

export const clear = () => {
    return {
        type: CLEAR_DATA
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

export default function eventReducer(state = initState, action) {
    let groupEvents = []
switch(action.type) {
    case CLEAR_DATA:
        groupEvents = null
        return {
            ...state,
            groupEvents
        }
    case LOAD_EVENTS:
        const allEvents = {}
        action.events.forEach((event) => {
            allEvents[event.id] = event
        })
        return {
            ...allEvents,
            ...state
        }
    case GROUP_EVENTS:
        const newState = {...state}
        newState.groupEvents = action.events
        return newState
    default:
        return state
}
}