import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import * as groupActions from "../../store/groups"
import { useHistory } from "react-router-dom"
import "./StartGroup.css"

export default function StartGroup() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [location, setLocation] = useState("")
    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [type, setType] = useState("In person")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [privacy, setPrivacy] = useState(true)
    const [image, setImage] = useState("")
    const [errors, setErrors] = useState([])
    const [disabled, setDisabled] = useState(true)

    console.log(errors)

    useEffect(() => {
        if (
            name.length &&
            about.length &&
            city.length &&
            state.length &&
            image.length
        ) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [name, about, city, state, image, errors])

    const newGroup = (group) => {
        dispatch(groupActions.createNewGroup(group)).then((res) => {
            dispatch(groupActions.addImg(res.id, image))
            history.push(`/group/${res.id}`)
        }).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) setErrors(data.errors)
        })
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()
        let err = []

        const group = {
            name,
            about,
            type,
            privacy: !!privacy,
            city,
            state: state.toUpperCase(),
            previewImage: image
        }

        return newGroup(group)
    }


    return (
        <div className="content">
            <div className="organizer">
                Become an organizer
            </div>
            <h2 className="start-heading">We'll walk you through a few steps to build your local community</h2>
            <hr></hr>
            <form onSubmit={onSubmit} className="start-form">
            <ul>
                        {errors?.map((error, idx) => <li className='errors' key={idx}>{error}</li>)}
                    </ul>
            <div className="form-section">
                <h3 className="form-heading">
                    Set your group's location
                </h3>
                <p className="form-caption">getTogether groups meet locally, in person, and online. We'll connect you with people in your area.</p>
                <input 
                    type="text"
                    value={location} 
                    onChange={(e) => {
                        setLocation(e.target.value)
                        if (e.target.value.includes(", ")) {
                            const split = e.target.value.split(", ")
                            setCity(split[0])
                            setState(split[1])
                        }
                    }}
                    placeholder="City, STATE"></input>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    What will your group's name be?
                </h3>
                <p className="form-caption">Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What is your group name?"
                    name="name"></input>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Describe the purpose of your group
                </h3>
                <p className="form-caption">People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <input 
                    type="text"
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Please write at least 30 characters">
                </input>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Is this an in-person group or online?
                </h3>
                <select placeholder="Select one" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In-person</option>
                    <option value="Online">Online</option>
                </select>

                <h3 className="form-heading">
                    Is this group private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value="">Public</option>
                </select>

                <h3 className="form-heading">
                    Please add an image URL for your group below:
                </h3>
                <input 
                    type="text"
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL">
                </input>
            </div>

            <button type="submit" disabled={disabled} className="dtl-btn">Create group</button>
            </form>
        </div>
    )
}