import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import * as groupActions from "../../store/groups"
import * as eventActions from "../../store/events"

export default function StartEvent() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const group = useSelector(state => state.groups.currGroup)
    const [price, setPrice] = useState()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("In person")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [privacy, setPrivacy] = useState(true)
    const [image, setImage] = useState("")
    const [errors, setErrors] = useState([])
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        dispatch(groupActions.getOneGroup(id))
    }, [dispatch])

    useEffect(() => {
        if (
            name.length &&
            description.length &&
            price &&
            price >= 0 &&
            start.length &&
            end.length &&
            image.length &&
            !errors.length
        ) {
            setDisabled(false)
        }
    }, [name, description, price, start, end, image, errors])

    const newEvent = (event) => {
        dispatch(eventActions.createEvent(id, event)).then((res) => {
            dispatch(eventActions.addImg(res.id, image))
            .then(() => 
            history.push(`/event/${res.id}`)
            )
        }).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) setErrors(data.errors)
        })
    }

    const convertTime = (input) => {
        const split = input.split(", ")
        const formatDate = split[0].slice(6).concat("-", split[0].slice(0, 5))
        const amPm = split[1].slice(6).toUpperCase()
        let formatTime
        if (amPm === "PM") {
            formatTime = (Number(split[1].slice(0,2)) + 12)
            .toString().concat(split[1].slice(2,5), ":00")
        } else {
            formatTime = split[1].slice(0,5).concat(":00")
        }
        
        const date = formatDate.concat(" ", formatTime)
        return date
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()
        let err = []

        const event = {
            name,
            description,
            price,
            private: privacy,
            startDate: convertTime(start),
            endDate: convertTime(end),
            type,
            image
        }
        
        return newEvent(event)
    }


    return (
        <div>
            <h2>Create a new event for {group?.name}</h2>
            <form onSubmit={onSubmit}>
            <ul>
                        {errors?.map((error, idx) => <li className='errors' key={idx}>{error}</li>)}
                    </ul>
            <div>
                <h3>
                    What is the name of your event?
                </h3>
                <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event name"></input>
            </div>

            <div>
                <h3>
                    Is this an in-person or online event?  
                </h3>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In-person</option>
                    <option value="Online">Online</option>
                </select>
            </div>

            <div>
            <h3>
                    Is this event private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value="">Public</option>
                </select>
            </div>

            <div>
                <h3>
                    What is the price of your event?
                </h3>
                <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></input>
            </div>

            <div>
                <h3>
                    When does your event start?
                </h3>
                <input 
                    type="text"
                    value={start} 
                    onChange={(e) => setStart(e.target.value)}
                    placeholder="MM-DD-YYYY, HH:mm AM"></input>
            </div>

            <div>
                <h3>
                    When does your event end?
                </h3>
                <input 
                    type="text"
                    value={end} 
                    onChange={(e) => setEnd(e.target.value)}
                    placeholder="MM-DD-YYYY, HH:mm PM"></input>
            </div>

            <div>
                <h3>
                    Please add an image url for your event below:
                </h3>
                <input 
                    type="text"
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image url"></input>
            </div>

            <div>
                <h3>
                    Please describe your event
                </h3>
                <input 
                    type="text"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters"></input>
            </div>
            <button type="submit" disabled={disabled}>Create event</button>
            </form>
        </div>
    )
}