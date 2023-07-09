# Backend

This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM.

## Project setup
```
npm install
```

### Before startup 
Setup a .env file with the following variables, e.g.:

```
MONGO_URL = mongodb+srv://sa:XpawUFHULlQXmD3B@cluster0.hn0jxup.mongodb.net/test
ORGANIZATION_NAME = Test Organization Name
ORGANIZATION_ACCESS = 7de45d00-3ad0-11ed-a9a4-05c1168e4d66

Organization access variable will have to change for each organization for them to access their user and event data.
It will also be used to link the organization to the user that sign up to their website and their events.
(old: MONGO_URL = mongodb+srv://<username>:<password>@cluster0.abcdc.mongodb.net/dbname)
```

### Compiles and hot-reloads for development
```
npm start
```
### NOTE
Database connection is down, use for code analysis