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
            !!privacy &&
            type.length &&
            !errors.length
            ) {
                setDisabled(false)
            } else {
                setDisabled(true)
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
            const split = input.split("T")
            const joined = `${split[0]} ${split[1]}:00`
            return joined
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
        <div className="content">
            <h2 className="start-heading">Create a new event for {group?.name}</h2>
            <form onSubmit={onSubmit} className="start-form">
            <ul>
                        {errors?.map((error, idx) => <li className='errors' key={idx}>{error}</li>)}
                    </ul>
            <div className="form-section">
                <h3 className="form-heading">
                    What is the name of your event?
                </h3>
                <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event name"></input>
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
            </div>

            <div className="form-section">
            <h3 className="form-heading">
                    Is this event private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value="" selected disabled>(select one)</option>
                    <option value={true}>Private</option>
                    <option value="">Public</option>
                </select>
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
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Please describe your event
                </h3>
                <input 
                    type="text"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters"></input>
            </div>
            <button type="submit" disabled={disabled} className="dtl-btn">Create event</button>
            </form>
        </div>
    )
}