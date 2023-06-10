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
    const [type, setType] = useState()
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [privacy, setPrivacy] = useState()
    const [image, setImage] = useState("")
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        dispatch(groupActions.getOneGroup(id))
    }, [dispatch])

    
    useEffect(() => {
        if (description?.length && description?.length < 30) {
            setErrors(prevErrors => ({
                ...prevErrors,
                description: `${30 - description.length} more characters required`
            }))
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                description: ""
            }))
        }

        if (image?.length && ["png", "jpg", "jpeg"].indexOf(image?.split(".")[image?.split(".").length - 1]) < 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: "Image URL must end in '.png', '.jpg', or '.jpeg'"
            }))
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: ""
            }))
        }

        if (name?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                name: ""
            }))
        }

        if (price?.length && price >= 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                price: ""
            }))
        }

        if (start?.length && start < end) {
            setErrors(prevErrors => ({
                ...prevErrors,
                start: ""
            }))
        }

        if (end?.length && start < end) {
            setErrors(prevErrors => ({
                ...prevErrors,
                end: ""
            }))
        }

        if (type?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                type: ""
            }))
        }

        if (privacy?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                privacy: ""
            }))
        }
    }, [name, description, price, start, end, image, type, privacy])
        
        const newEvent = (event) => {
            dispatch(eventActions.createEvent(id, event)).then((res) => {
                dispatch(eventActions.addImg(res.id, image))
                .then(() => 
                history.push(`/event/${res.id}`)
                )
            })
        }
        
        const convertTime = (input) => {
            const split = input.split("T")
            const joined = `${split[0]} ${split[1]}:00`
            return joined
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()

        const event = {
            name,
            description,
            price,
            private: !!privacy,
            startDate: convertTime(start),
            endDate: convertTime(end),
            type,
            image
        }

        if (!name?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                name: "Event name required"
            }))
        }

        if (!price?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                price: "Event price required"
            }))
        }

        if (!type) {
            setErrors(prevErrors => ({
                ...prevErrors,
                type: "Select event type"
            }))
        }

        if (!privacy) {
            setErrors(prevErrors => ({
                ...prevErrors,
                privacy: "Select public or private"
            }))
        }

        if (!description?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                description: "Event description required"
            }))
        }

        if (!image?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: "Event image required"
            }))
        }

        if (!start?.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                start: "Please select a start date and time"
            }))
        }

        if (!end?.length || end < start) {
            setErrors(prevErrors => ({
                ...prevErrors,
                end: "Please select an end date and time that is after the start date and time"
            }))
        }
        
        if (
            !errors.name?.length, 
            !errors.description?.length, 
            !errors.price?.length, 
            !errors.start?.length, 
            !errors.end?.length, 
            !errors.image?.length, 
            !errors.type?.length, 
            !errors.privacy?.length
        ) {
        return newEvent(event)
        }
    }


    return (
        <div className="content">
            <h2 className="start-heading">Create a new event for {group?.name}</h2>
            <form onSubmit={onSubmit} className="start-form">

            <div className="form-section">
                <h3 className="form-heading">
                    What is the name of your event?
                </h3>
                <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event name"></input>
                    <p className="errors">{errors?.name}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Is this an in-person or online event?  
                </h3>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="" selected disabled>(select one)</option>
                    <option value="In person">In-person</option>
                    <option value="Online">Online</option>
                </select>
                <p className="errors">{errors?.type}</p>
            </div>

            <div className="form-section">
            <h3 className="form-heading">
                    Is this event private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value="" selected disabled>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <p className="errors">{errors?.privacy}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    What is the price of your event?
                </h3>
                <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></input>
                    <p className="errors">{errors?.price}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    When does your event start?
                </h3>
                <input 
                    type="datetime-local"
                    value={start} 
                    onChange={(e) => setStart(e.target.value)}
                    placeholder="MM-DD-YYYY, HH:mm AM"></input>
                    <p className="errors">{errors?.start}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    When does your event end?
                </h3>
                <input 
                    type="datetime-local"
                    value={end} 
                    onChange={(e) => setEnd(e.target.value)}
                    placeholder="MM-DD-YYYY, HH:mm PM"></input>
                    <p className="errors">{errors?.end}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Please add an image url for your event below:
                </h3>
                <input 
                    type="text"
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image url"></input>
                    <p className="errors">{errors?.image}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Please describe your event
                </h3>
                <textarea
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters"></textarea>
                    <p className="errors">{errors?.description}</p>
            </div>
            <button type="submit" disabled={disabled} className="dtl-btn">Create event</button>
            </form>
        </div>
    )
}