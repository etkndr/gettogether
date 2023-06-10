import { csrfFetch } from "./csrf"

const initState = {}

const LOAD_GROUPS = "groups/loadGroups"
const ONE_GROUP = "groups/oneGroup"
const NEW_GROUP = "groups/newGroup"
const DELETE_GROUP = "groups/deleteGroup"
const EDIT_GROUP = "groups/editGroup"
const ADD_IMG = "groups/image"
const EDIT_IMG = "groups/editImage"

const load = groups => {
    return {
    type: LOAD_GROUPS,
    groups
    }
}

const getGroup = group => {
    return {
        type: ONE_GROUP,
        group
    }
}

const newGroup = group => {
    return {
        type: NEW_GROUP,
        group
    }
}

const dlt = group => {
    return {
        type: DELETE_GROUP,
        group
    }
}

const edit = group => {
    return {
        type: EDIT_GROUP,
        group
    }
}

const image = (id, image) => {
    return {
        type: ADD_IMG,
        id,
        image
    }
}

const editImg = (id, img) => {
    return {
        type: EDIT_IMG,
        id,
        img
    }
}

export const getGroups = () => async dispatch => {
    const res = await fetch("/api/groups")

    if (res.ok) {
        const groups = await res.json()
        dispatch(load(groups))
    }
}

export const getOneGroup = (id) => async dispatch => {
    const res = await fetch(`/api/groups/${id}`)

    if (res.ok) {
        const group = await res.json()
        dispatch(getGroup(group))
        return group
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
            private: privacy,
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

export const dltGroup = (id) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dlt(data))
        return data
    }
}

export const editGroup = (group, id) => async dispatch => {
    const {name, about, type, privacy, city, state} = group
    const res = await csrfFetch(`/api/groups/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            name,
            about,
            type,
            private: privacy,
            city, 
            state
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(edit(data))
        return data
    }
}

export const addImg = (id, img) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${id}/images`, {
        method: "POST",
        body: JSON.stringify({
            url: img,
            preview: true
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(image(id, data))
        return data
    }
}

export const updateImg = (id, img) => async dispatch => {
    const dlt = await csrfFetch(`/api/group-images/${id}`, {
        method: "DELETE"
    })
    const res = await csrfFetch(`/api/groups/${id}/images`, {
        method: "POST",
        body: JSON.stringify({
            url: img,
            preview: true
        })
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(editImg(id, data))
        return data
    }
}

export default function groupReducer(state = initState, action) {
    const newState = {...state}
switch(action.type) {
    case LOAD_GROUPS:
        newState.allGroups = action.groups
        return newState
    case ONE_GROUP:
        newState.currGroup = action.group
        return newState
    case NEW_GROUP:
        newState.allGroups = [newState.allGroups, action.group]
        return newState
    case DELETE_GROUP:
        delete newState.allGroups[action.group.id]
        return newState
    case EDIT_GROUP:
        newState.currGroup = action.group
        return newState
    case ADD_IMG:
        newState.allGroups[action.id].previewImage = action.image
    case EDIT_IMG:
        delete newState.allGroups[action.id].previewImage
        newState.allGroups[action.id].previewImage = action.image
        return newState
    default:
        return state
}
}