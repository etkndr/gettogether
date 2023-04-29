export default function StartGroup() {
    return (
        <div>
            <h2>Start a new group</h2>
            <form>
            <div>
                <h3>
                    Set your group's location
                </h3>
                <p>Meetup groups meet locally, in person, and online. We'll connect you with people in your area.</p>
                <input placeholder="City, STATE"></input>
            </div>

            <div>
                <h3>
                    What will your group's name be?
                </h3>
                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <input placeholder="What is your group name?"></input>
            </div>

            <div>
                <h3>
                    Describe the purpose of your group
                </h3>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <input placeholder="Please write at least 30 characters"></input>
            </div>

            <div>
                <h3>
                    Is this an in-person group or online?
                </h3>
                <p>In Person" and "Online", a select input with a label of "Is this group private or public?</p>
                <select>
                    <option value="in-person">In-person</option>
                    <option value="online">Online</option>
                </select>
            </div>

            <button type="submit" onClick="">Create group</button>
            </form>
        </div>
    )
}