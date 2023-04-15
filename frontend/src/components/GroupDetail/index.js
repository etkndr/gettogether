import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as groupActions from "../../store/groups"
import getDetails from "../../store/details"

export default function GroupDetail() {
    const dispatch = useDispatch()
    const [loaded, setLoaded] = useState(false)
    const sessionUser = useSelector(state => state.session.user)
    const group = useSelector(state => state.details)
    const {id} = useParams()
    
    useEffect(() => {
        dispatch(getDetails(id))
        setLoaded(true)
    }, [dispatch])
    
    // console.log(group)
    
    function popup() {
        alert("Feature coming soon")
    }
    
    function createEvent() {
        
    }
    
    function updateGroup() {
        
    }
    
    function dltGroup() {
        
    }
    
    
    if (loaded) {
    return (
        <div>
            {/* <p><NavLink to="/groups">Groups</NavLink> > {group.name} </p>
            <img src={group?.previewImage}></img>
            {group?.name}
            {" " + group?.city + ", "}
            {group?.state}
            <div>
            Organized by:
            {" " + group?.organizerId}
            </div>

            {sessionUser && sessionUser.id !== group.organizerId &&
            <button onClick={popup}>Join this group</button>
            }

            {sessionUser && sessionUser.id === group.organizerId && 
            <button onClick={createEvent}>Create event</button>}

            {sessionUser && sessionUser.id === group.organizerId &&
            <button onClick={updateGroup}>Update</button>}

            {sessionUser && sessionUser.id === group.organizerId &&
            <button onClick={dltGroup}>Delete</button>}

            <h2>What we're about</h2>
            {group?.about} */}
        </div>
    )
    }
}