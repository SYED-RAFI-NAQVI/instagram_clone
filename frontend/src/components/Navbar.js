
import React ,{ useContext, useRef, useEffect, useState} from 'react'
//{Link} for to not to refesh and to get instant results
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from "materialize-css"

const NavBar = ()  => {
    const {state, dispatch} = useContext (UserContext)
    const [search,setSearch] = useState("") 
    const  [userDetails,setUserDetails] = useState([])
    const history  = useHistory()
    const searchModal = useRef()
    useEffect(() => {
        M.Modal.init (searchModal.current)
    },[])
    const renderList  = () => {
        if (state) {
            return [
                <li key = "1"><i data-target="modal1" className = "large material-icons modal-trigger" style = {{color :"black"}}>search</i></li>,
                <li key = "2"><Link to ="/profile">Profile</Link></li>,
                <li key = "3"><Link to ="/create">Create Post</Link></li>,
                <li key = "4"><Link to ="/myfollowingpost">Following Posts</Link></li>,
                <li key = "5">
                    <button className="btn #c62828 red darken-3" 
                    onClick = {() => {
                        localStorage.clear()
                        dispatch({type : "CLEAR"})
                        history.push('/signin')
                    }}
                    >
                        Signout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key = "6"><Link to ="/signup">Signup</Link></li>,
                <li key = "7"><Link to ="/signin">Signin</Link></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query) 
        fetch('/searchusers', {
            method :"post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                query
            })
        }).then (res=>res.json())
            .then(result => {
                setUserDetails(result.user)
            })
    }
    return (
        <nav>
            <div className="nav-wrapper white" >
            <Link to ={state ? "/" : "/signin" } className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>

            <div id="modal1" className="modal"  ref = {searchModal} style = {{color: "black"}}>
                <div className="modal-content">
                    <input  type = "text" 
                    placeholder = "search profile"
                    value = {search}
                    onChange = {(e) => fetchUsers(e.target.value)}/>
                    <ul class="collection"> 
                        {userDetails.map(item => {
                            return <Link to = {item._id !== state._id ? "/profile/"+item._id : "/profile"} onClick = {()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li class="collection-item">{item.email}</li></Link>
                            
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button  className="modal-close waves-effect waves-green btn-flat" onClick = {()=>setSearch('')}> close </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar