import React,{useState, useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = () => {
    const {state, dispatch} = useContext (UserContext)
    const history = useHistory()
    const [password, setPassword] = useState ("")
    const [email, setEmail] = useState ("")
    const PostData = ()  => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "email Invalid", classes : "#c62828 red darken-3"})
            return 
        }


        //our server sending request in port 5000 but out frntend is running on port 3000
        //we added proxy server in package.json so that it is sending the internal reqest to 
        //and fooling react that our frontend is working on port 3000 but it is internally working on 
        //5000
        fetch ("/signin", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                password,
                email
            })
        }).then(res=> res.json())
        .then(data=>{
            if (data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else {
                localStorage.setItem("jwt",data.token) 
                localStorage.setItem("user",JSON.stringify(data.user)) 
                dispatch ({type : "USER",payload:data.user}) //this will go to userReducer and returns
                M.toast({html:"signedIn Sucessfull", classes : "#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err => {
            console.log (err)
        })
    }

    return (
        <div className = "mycard">
            <div className = "card auth-card input-field"> 
                <h2> Instagram </h2>
                <input  type = "text" 
                placeholder = "email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}/>
                <input  type = "password" 
                placeholder = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}/>
                
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick = {() => PostData()}
                >
                    Signin
                </button>
                <h5>
                    <Link to = "/signup" >Don't have an account?</Link>
                </h5>
                <h6><Link to = "/resetpassword">Forgot password?</Link></h6>

            </div>
        
        </div>
    )
}

export default Signin