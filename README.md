# Instagram Clone

A Simple Instagram Page made with MERN stack

# Open here
https://instaclone05.herokuapp.com/signin

## Installation 
```
# Installation for Server

  npm init 	 	//install package.json() file
  npm install experss	//install node_modules

# Installation for client
Introducing React in Client	

npx-create-react-app dirname

# nodmeon installation

npm install nodemon

```
## Create DataBase in MongoDB
#### Atlas Cluster Link is below
#### https://account.mongodb.com/account/login?n=%2Fv2%2F5f031bd8699a9d770ba34a12&nextHash=%23clusters

## Create an API in SendGrid
#### Here's the Link https://app.sendgrid.com/login?redirect_to=%2Fsettings%2Fsender_auth%2Fsenders%2Fnew
#### Verify a user in Settings<Sender Authentication




## Usage
#### Create a dev.js file in **config folder** with these **MONGOURI JWT_SECRET SENDGRID_API EMAIL**\

```
module.exports = {		
	MONGOURI : 			
	JWT_SECRET  : 		
	SENDGRID_API :		
	EMAIL : 			
}			
```
	
- You should change the value of MOGOURI with your MONGODB connection Link in <config/dev.js file 
- You should change the value of JWT_SECRET with your SOMETHING in <config/dev.js file 
- You should change the value of SENDGRID_API with the API you created in SendGrid
- You should change the value of EMAIL with the *LOCALHOST* and after deploying change this with the *deployment LINK*

# Proxy 
#### Add this in client **package.json** file

Our server sending request in port 5000 but our client is running on port 3000 .So,we added proxy in package.json so that it will sends internal request to 5000 and pretending like both are running on the same PORT
> {
> "proxy": "http://localhost:5000",
> }

# To Run

#### Run both client and Server
> npm run dev

#### Run the server 
> nodemon appname

#### Run the client 
> npm start

##### # Server runs on http://localhost:5000 and client on http://localhost:3000


## CSS
In this project I used *_materialize css_* for icons and for other stylings
Link is here https://materializecss.com/


## Support and 🌟 the project
