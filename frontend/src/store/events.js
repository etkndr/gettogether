const initState = {}

const LOAD_EVENTS = "events/loadEvents"

const load = events => ({
    type: LOAD_EVENTS,
    events
})

export const getEvents = () => async dispatch => {
    const res = await fetch("/api/events")

    if (res.ok) {
        const events = await res.json()
        dispatch(load(events))
    }
}

export default function eventReducer(state = initState, action) {
switch(action.type) {
    case LOAD_EVENTS:
        const allEvents = {}
        action.events.forEach(event => {
            allEvents[event.id] = event
        })
        return {
            ...allEvents,
            ...state
        }
    default:
        return state
}
}