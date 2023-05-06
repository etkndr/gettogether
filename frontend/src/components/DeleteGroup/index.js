import * as groupActions from "../../store/groups"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import "./DeleteGroup.css"


export default function DeleteGroup({name, id}) {
    const history = useHistory()
    const dispatch = useDispatch()

    return (
        <>
            <h3>Confirm delete</h3>
            <p>Are you sure you want to remove group {name}?</p>
        </>
    )
}