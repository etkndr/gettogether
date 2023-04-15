const LOAD_DETAILS = "details/loadDetails"

const loadDetails = (group) => ({
    type: LOAD_DETAILS,
    group
})

export const getDetails = (id) => async dispatch => {
    const res = await fetch(`/api/groups/${id}`)

    if (res.ok) {
        const data = await res.json()
        dispatch(loadDetails(data))
        return data
    }
}

const initialState = {}

export default function detailReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_DETAILS:
            let newState = {}
            action.group.forEach((group) => {
                newState[group.id] = group
            })
            return newState
        default:
            return state
    }
}