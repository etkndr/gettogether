import { csrfFetch } from "./csrf"

const initState = {}

const LOAD_GROUPS = "groups/loadGroups"
const NEW_GROUP = "groups/newGroup"

const load = groups => ({
    type: LOAD_GROUPS,
    groups
})

const newGroup = group => {
    return {
        type: NEW_GROUP,
        group
    }
}

export const getGroups = () => async dispatch => {
    const res = await fetch("/api/groups")

    if (res.ok) {
        const groups = await res.json()
        dispatch(load(groups))
    }
}

export const createNewGroup = (group) => async dispatch => {
    const {name, about, type, privacy, city, state} = group
    const res = await csrfFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({
            name,
            about,
            type,
            privacy,
            city, 
            state
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(newGroup(data))
        return data
    }
}

export default function groupReducer(state = initState, action) {
    const newState = {...state}
switch(action.type) {
    case LOAD_GROUPS:
        newState.allGroups = action.groups
        return newState
    case NEW_GROUP:
        newState.allGroups = [newState.allGroups, action.group]
        return newState
    default:
        return state
}
}