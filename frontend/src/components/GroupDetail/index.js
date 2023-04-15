import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

export default function GroupDetail() {
    const [group, setGroup] = useState({})
    const [loaded, setLoaded] = useState(false)
    const sessionUser = useSelector(state => state.session.user)
    const {id} = useParams()

    function currGroup() {
        fetch(`/api/groups/${id}`)
        .then(res => res.json())
        .then(data => setGroup(data))
        .then(() => setLoaded(true))
    }

    function popup() {
        alert("Feature coming soon")
    }

    function createEvent() {

    }

    function updateGroup() {

    }

    function dltGroup() {

    }

    useEffect(() => {
        currGroup()
    }, [])


    if (loaded) {
    return (
        <div>
            <img src={group?.GroupImages[0]?.url}></img>
            {group?.name}
            {group?.city + ", "}
            {group?.state}
            <div>
            Organized by:
            {" " + group?.Organizer?.firstName + " "}
            {group?.Organizer?.lastName}
            </div>

            {sessionUser && sessionUser.id !== group.Organizer.id &&
            <button onClick={popup}>Join this group</button>
            }

            {sessionUser && sessionUser.id === group.Organizer.id && 
            <button onClick={createEvent}>Create event</button>}

            {sessionUser && sessionUser.id === group.Organizer.id &&
            <button onClick={updateGroup}>Update</button>}

            {sessionUser && sessionUser.id === group.Organizer.id &&
            <button onClick={dltGroup}>Delete</button>}

            <h2>What we're about</h2>
            {group?.about}
        </div>
    )
    }
}