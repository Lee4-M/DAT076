![](client/public/budgie.svg) 
# Budgie
Welcome to README for Budgie, a budget planner and expense tracker for the everyday user, all in one application.

Note: This is part of the coursework for DAT076 "Web Applications".

## Project Report & Repo structure

The project report can be found in the folder named project-report. 

The frontend is located in the client directory, where we have our setup and config files and src. In src, we have our typescript files including React components, routes, api and main.tsx. The backend is located in the server directory, where we have config files and a src folder. The src folder contains the service layer, the router layer, model, as well as database implementation. This folder also has index.ts and start.ts.

## Environment Variables

To run a local instance of the database and project, you will need to add the following environment variables to your .env file in the server directory.

SECRET_SESSION = `KEY`

To run an instance of the online database and project, you will need to add the following environment variables to your .env file in the server directory.

```
SESSION_SECRET = `KEY`
DB_NAME = `NAME`
DB_HOST = `HOST`
DB_USER = `USER`
DB_PASSWORD = `PASSWORD`
DB_SSL_CA = `ca.pem`
DB_PORT = `PORT`
NODE_ENV = `TEST`
```

You will also need a certification file ca.pem from the database platform.

## Install & Run Locally

### Step 1: Clone the project

```
git clone https://github.com/Lee4-M/DAT076
```

### Step 2: Enter each directory in separate terminals

```bash
cd client
cd server
```

### Step 3: Install dependencies in both directories

```
npm install
```

### Step 4: Run the server in both directories

```
npm run dev
```

### Step 4 (Alternative): Run the server with an online database
```
npm run dev-online
```

---
## Contributors (Group 7)
Kevin Collins

Annelie Waithira Hansson

Liam Mayor

Philip Öhman

## License

This code is free to use under the terms of the MIT license. See [LICENSE](https://choosealicense.com/licenses/mit/)


