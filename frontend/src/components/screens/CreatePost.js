import React,{ useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    
    //whever we change the pic useEffect will modifies the url and update setUrl(data.url)
    useEffect  (()=> {
        if (url) {
         //requesting to server database
         fetch ("/createpost", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem('jwt') //getting token 
            },
            body : JSON.stringify({
                title,
                body,
                //pic from backend(post route) url from createpost frontend
                pic:url
            })
        }).then(res=> res.json())
        .then(data=>{
            if (data.error){
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }else {
                M.toast({html:"posted Sucessfully", classes : "#43a047 green darken-1"})
                history.push('/')
            }
        }).catch(err => {
            console.log (err)
        })
    }
    },[url])

    
    const postDetails  = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Instaclone")
        data.append("cloud_name","dpfugowzy")


        //requesting to cloud
        fetch("https://api.cloudinary.com/v1_1/dpfugowzy/image/upload",{
            method : "post",
            body:data
        }).then(res => res.json())
        .then(data=>{
            // console.log (data)
            setUrl(data.url)    //asynchronous operation
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <div className = "card input-field"
            style = {{
                margin :  "10px auto",
                maxWidth : "500px",
                padding:"20px",
                textAlign : "center"
            }}
        >
            <input type = "text" 
            placeholder = "title"
            value = {title}
            onChange = {(e) => {setTitle(e.target.value)}}
            />


            <input type = "text" 
            placeholder = "body"
            value = {body}
            onChange = {(e) => {setBody(e.target.value)}}/>

            <div className = "file-field input-field">
                <div className = "btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type = "file" onChange = {(e) => setImage(e.target.files[0])} />
                </div>
                <div class="file-path-wrapper">
                  <input className = "file-path validate"  type = "text" />
                </div>  
            </div>

            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
            onClick = {() => postDetails()}
            >
                    Submit Post
            </button>

        </div>
    )
}

export default CreatePost