import * as groupActions from "../../store/groups"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import "./Groups.css"

export default function Groups() {
    // const dispatch = useDispatch()
    // const groups = useSelector(state => state.groups.groups)
    
    // useEffect(() => {
    //     dispatch(groupActions.allGroups())
    // }, [dispatch])

    const [groups, setGroups] = useState([])
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    function fetchGroups() {
        fetch("/api/groups")
        .then(res => {
            return res.json()
        })
        .then(data => {
            setGroups(data)
        })
    }

    useEffect(() => {
        fetchGroups()

        const groupEvents = async () => {
            groups?.forEach(async (group) => {
                await fetch(`/api/groups/${group.id}/events`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    setEvents(data)
                })
            })
        }
        groupEvents()
        setLoading(false)
    }, [])

    groups.forEach((group) => {
        console.log(group.private)
    })

    return (
        <>
        <div className="select">
            <a href="">Events</a>
            <a href="">Groups</a>
        </div>
        <div className="caption">
            Groups in getTogether
        </div>
            {!loading && groups?.map((group, idx) => {
                return (
                    <li key={idx} className="group">
                        <li key={`${idx}-img`}><img src={group.previewImage} alt="group img" /></li>
                        <li key={`${idx}-name`}>{group.name}</li>
                        <li key={`${idx}-city`}>{group.city}, {group.state}</li>
                        <li key={`${idx}-about`}>{group.about}</li>
                        <li key={`${idx}-events`}>{events.length} events ·
                        {group.private && <div>Private</div>}
                        {!group.private && <div>Public</div>}
                        </li>
                        <hr></hr>
                    </li>
                )
            })}
        </>
    )
}