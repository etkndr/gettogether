import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import * as groupActions from "../../store/groups"
import * as sessionActions from "../../store/session"
import { useHistory, useParams } from "react-router-dom"
import "./EditGroup.css"

export default function EditGroup() {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const group = useSelector(state => state.groups.currGroup)
    const sessionUser = useSelector(state => state.session.user)

    const [loaded, setLoaded] = useState(false)
    const [location, setLocation] = useState(`${group?.city}, ${group?.state}`)
    const [name, setName] = useState(group?.name)
    const [about, setAbout] = useState(group?.about)
    const [type, setType] = useState(group?.type)
    const [city, setCity] = useState(group?.city)
    const [state, setState] = useState(group?.state)
    const [privacy, setPrivacy] = useState(group?.private)
    const [image, setImage] = useState("image URL")
    const [errors, setErrors] = useState([])
    const [imgId, setImgId] = useState(0)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        dispatch(groupActions.getOneGroup(id))
        .then(() => setLoaded(true))
    }, [dispatch, id])

    useEffect(() => {
        if (loaded) {
            setLocation(`${group?.city}, ${group?.state}`)
            setName(group?.name)
            setAbout(group?.about)
            setType(group?.type)
            setCity(group?.city)
            setState(group?.state)
            setPrivacy(group?.private)
            setImage(group?.GroupImages[0]?.url)
            setImgId(group?.GroupImages[0]?.id)
        }
    }, [loaded, id])

    useEffect(() => {
        
        if (about?.length && about?.length < 30) {
            setErrors(prevErrors => ({
                ...prevErrors,
                about: `${30 - about.length} more characters required`
            }))
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                about: ""
            }))
        }

        if (location?.length && state?.length !== 2) {
            setErrors(prevErrors => ({
                ...prevErrors,
                location: `Please enter a city and state (two characters) separated by comma`
            }))
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                location: ""
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
    }, [name, location, city, about, state, image, privacy, type])
       
    const updateGroup = (group, imgId) => {
        dispatch(groupActions.editGroup(group, id))
        .then((res) => {
            dispatch(groupActions.updateImg(id, image, imgId))
            history.push(`/group/${res.id}`)
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const group = {
            name,
            about,
            type,
            privacy: !!privacy,
            city,
            state: state?.toUpperCase(),
            previewImage: image
        }

        if (!location.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                location: "City and state required"
            }))
        }

        if (!name.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                name: "Group name required"
            }))
        }

        if (!type) {
            setErrors(prevErrors => ({
                ...prevErrors,
                type: "Select group type"
            }))
        }

        if (!privacy) {
            setErrors(prevErrors => ({
                ...prevErrors,
                privacy: "Select public or private"
            }))
        }

        if (!about.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                about: "Group description required"
            }))
        }

        if (!image.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                image: "Group image required"
            }))
        }

        if (
            !errors.name?.length, 
            !errors.location?.length, 
            !errors.about?.length, 
            !errors.image?.length, 
            !errors.privacy?.length,
            !errors.type?.length
        ) {
        return updateGroup(group, imgId)
        }
    }
    
    if (!sessionUser) {
        history.push("/")
    }

    if (loaded) {
    
    return (
        <div className="content">
            <h2>Update your group</h2>
            <form onSubmit={onSubmit} className="start-form">
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
                    <p className="errors">{errors?.location}</p>
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
                    <p className="errors">{errors?.name}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Describe the purpose of your group
                </h3>
                <p className="form-caption">People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <textarea
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Please write at least 50 characters">
                </textarea>
                <p className="errors">{errors?.about}</p>
            </div>

            <div className="form-section">
                <h3 className="form-heading">
                    Is this an in-person group or online?
                </h3>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In-person</option>
                    <option value="Online">Online</option>
                </select>
                <p className="errors">{errors?.type}</p>

                <h3 className="form-heading">
                    Is this group private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
                <p className="errors">{errors?.privacy}</p>

                <h3 className="form-heading">
                    Please add an image URL for your group below:
                </h3>
                <input 
                    type="text"
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL">
                </input>
                <p className="errors">{errors?.image}</p>
            </div>

            <button type="submit" disabled={disabled} className="dtl-btn">Update group</button>
            </form>
        </div>
    )
}
}