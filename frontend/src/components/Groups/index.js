import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom"
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"
import "./Groups.css"

export default function Groups() {
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.allGroups)
    const events = useSelector(state => state.events.allEvents)
    
    useEffect(() => {
        dispatch(groupActions.getGroups())
        dispatch(eventActions.getEvents())
      }, [dispatch]);
        
        
    const numEvents = {}
    groups?.forEach((group) => {
        events?.forEach((event) => {
            if (event.groupId === group.id) {
                if (numEvents[group.id]) {
                    numEvents[group.id]++
                } else {
                    numEvents[group.id] = 1
                }
            }
        })
    })

    let eventPlural
    if (numEvents > 1) {
        eventPlural = "events"
    } else {
        eventPlural = "event"
    }

    return (
        <div className="content">
        <div className="caption">
        <h2>Groups in getTogether</h2>
        </div>
        <div className="select">
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/groups">Groups</NavLink>
        </div>
        <hr></hr>
            {groups?.map((group, idx) => {
                return (
                    <NavLink to={`/group/${group?.id}`} className="group-detail-link">
                    <div key={idx} className="group">
                        <div key={`${idx}-img`} className="grp-img"><img src={group?.previewImage} alt="group img" /></div>
                        <div key={`${idx}-info`} className="grp-info">
                        <li key={`${idx}-name`} className="grp-name">{group?.name}</li>
                        <li key={`${idx}-city`} className="grp-location">{group?.city}, {group?.state}</li>
                        <li key={`${idx}-about`} className="grp-about">{group?.about}</li>
                        <li key={`${idx}-events`} className="grp-about">
                        {numEvents[group?.id] || 0} {eventPlural} ·
                        {group?.private && " Private"}
                        {!group?.private && " Public"}
                        </li>
                        </div>
                    </div>
                        <hr></hr>
                    </NavLink>
                )
            })}
        </div>
    )
}