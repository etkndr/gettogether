const initState = {}

const LOAD_GROUPS = "groups/loadGroups"
const LOAD_MEMBERS = "groups/loadMembers"

const load = groups => ({
    type: LOAD_GROUPS,
    groups
})

const loadMembers = members => ({
    type: LOAD_MEMBERS,
    members
})

export const getGroups = () => async dispatch => {
    const res = await fetch("/api/groups")

    if (res.ok) {
        const groups = await res.json()
        dispatch(load(groups))
    }
}



export const getMembers = (id) => async dispatch => {
    const res = await fetch(`/api/groups/${id}/members`)

    if (res.ok) {
        const members = await res.json()
        dispatch(loadMembers(members))
    }
}

export default function groupReducer(state = initState, action) {
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
    case LOAD_MEMBERS:
        const allMembers = {}
        action.members.forEach(member => {
            allMembers[member.id] = member
        })
        return {
            ...allMembers,
            ...state
        }
    default:
        return state
}
}