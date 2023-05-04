import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import * as groupActions from "../../store/groups"

export default function StartGroup() {
    const dispatch = useDispatch()
    const [location, setLocation] = useState("")
    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [type, setType] = useState("In person")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [privacy, setPrivacy] = useState(true)
    const [image, setImage] = useState("")
    const [errors, setErrors] = useState([])
    
    const onSubmit = async (e) => {
        e.preventDefault()
        console.log(city, state)

        const group = {
            name,
            about,
            type,
            private: !!privacy,
            city,
            state,
            previewImage: image
        }

        dispatch(groupActions.createNewGroup(group)).catch(async (res) => {
            const data = await res.json()
            if (data && data.errors) {
                setErrors(data.errors)
            }
        })
        return group
    }


    return (
        <div>
            <h2>Start a new group</h2>
            <form onClick={onSubmit}>
            <div>
                <h3>
                    Set your group's location
                </h3>
                <p>getTogether groups meet locally, in person, and online. We'll connect you with people in your area.</p>
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

            <div>
                <h3>
                    What will your group's name be?
                </h3>
                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <input 
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What is your group name?"
                    name="name"></input>
            </div>

            <div>
                <h3>
                    Describe the purpose of your group
                </h3>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <input 
                    type="text"
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Please write at least 50 characters">
                </input>
            </div>

            <div>
                <h3>
                    Is this an in-person group or online?
                </h3>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="In person">In-person</option>
                    <option value="Online">Online</option>
                </select>

                <h3>
                    Is this group private or public?
                </h3>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value={true}>Private</option>
                    <option value="">Public</option>
                </select>

                <h3>
                    Please add an image URL for your group below:
                </h3>
                <input 
                    type="text"
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL">
                </input>
            </div>

            <button type="submit">Create group</button>
            </form>
        </div>
    )
}