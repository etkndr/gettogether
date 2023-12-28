<h1 align="center">[getTogether](https://get-together-3yf3.onrender.com) - Meetup clone</h1>

## Technologies Used

getTogether was built using the following technologies:

- JavaScript
- Express.js
- Sequelize
- React
- Redux

### 🏠 [Homepage](https://get-together-3yf3.onrender.com)

## Installation

### Initial Configuration
#### Backend

1. Clone repository
    ```bash
    https://github.com/etkndr/gettogether.git
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Create a **.env** file in `/backend` with the following environmental variables:
   ```
   PORT=8000
   DB_FILE=db/dev.db
   JWT_SECRET=1234abcd (generate a random secret)
   JWT_EXPIRES_IN=604800
   SCHEMA=gettogether
   ```

4. Migrate and seed your database and start the server

   ```bash
   cd backend/ &&
   npx dotenv sequelize db:migrate &&
   npx dotenv sequelize db:seed:all &&
   npm start
   ```

#### Frontend

5. In a new terminal, navigate to the frontend directory and start the React application

    ```bash
    cd frontend/ &&
    npm install &&
    npm start
    ```

At this point, the application should be up and running, and will be available in your web browser at http://localhost:3000/

<br/>
<br/>

![image](https://github.com/etkndr/gettogether/assets/103692901/be3cdd98-0f1e-4dc1-8806-9eca17ba0542)



