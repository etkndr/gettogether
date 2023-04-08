const GET_GROUPS = "groups/getGroups"

const setGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

export const allGroups = () => async dispatch => {
    const res = await fetch("/api/groups")
    const data = await res.json()
    await dispatch(setGroups(data))
    return res
}

const initState = {}
export default function groupReducer(state = initState, action) {
let newState;
switch(action.type) {
    case GET_GROUPS:
        newState = Object.assign({}, state)
        newState.groups = action.groups
        return newState
    default:
        return state
}
}