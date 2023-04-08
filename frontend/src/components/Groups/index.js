import * as groupActions from "../../store/groups"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Groups() {
    const dispatch = useDispatch()
    let groups
    
    useEffect(() => {
        groups = dispatch(groupActions.allGroups())
    }, [dispatch])

    console.log(groups)

    return (
        <>
        </>
    )
}