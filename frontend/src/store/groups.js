const initState = {}

const LOAD_GROUPS = "groups/loadGroups"

const load = groups => ({
    type: LOAD_GROUPS,
    groups
})

export const getGroups = () => async dispatch => {
    const res = await fetch("/api/groups")

    if (res.ok) {
        const groups = await res.json()
        dispatch(load(groups))
    }
}

export default function groupReducer(state = initState, action) {
    const newState = {...state}
switch(action.type) {
    case LOAD_GROUPS:
        const allGroups = {}
        action.groups.forEach(group => {
            allGroups[group.id] = group
        })
        return {
            ...allGroups,
            ...state
        }
    default:
        return state
}
}