import React, { useEffect, useRef, useState } from 'react'
import './WebTicket.scss'
import NavFilm from '../../../components/NavFilm/NavFilm'
import NavNotice from '../../../components/NavNotice/NavNotice'
import instance from '../../../utils/axios/axiosPublic'
import privateAxios from '../../../utils/axios/privateAxios'
import { Alert, Space } from 'antd';
import Item from 'antd/es/list/Item'
import axios from 'axios'
import moment from 'moment'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { io } from "socket.io-client";
const socket = io("http://localhost:8000");
const token = localStorage.getItem("token") || ""
type user = {
    nameUser?: string
    avatar?: string
    passwords?: string
    email?: string
    phoneNumber?: number
    role?: number
    idUser?: number
}
export default function WebTicket() {
//     const [socket, setSocket] = useState<any>()
//   useEffect(() => {
//     setSocket(io("http://localhost:8000"));
//   }, [])
    const [posts, setPosts] = useState([])
    const [currentUser, setCurrentUser] = useState<any>({})
    const [notification, setNotification] = useState<any>([])
    const [friends, setFriends] = useState<any>([])
    const [userOnline, setUserOnline] = useState<any>([])
    const [openChata, setOpenChata] = useState<string>("0")
    const [userChat, setUserChat] = useState<any>({})
    const [message, setMessage] = useState<string>("")
    const [messageChat, setMessageChat] = useState<any>([])
    const token = localStorage.getItem("token") || ""
    const [onlineWeb, setOnlineWeb] = useState<any>([])
    const scrollRef = useRef<any>(null);
    const [openPost, setOpenPost] = useState<string>("5vw")
    // const [newPost, setNewPost] = useState<any>({})
    const [post, setPost] = useState<string>("")
    const [selectedMedia, setSelectedMedia] = useState<any>();
    const [imageView, setImageView] = useState<string>("");
    const [noticed,setNoticed] = useState<any>([])
    const [likePost, setLikePost] = useState<any>([])
    const [allMessage, setAllMessage] = useState<any>([])
    const [openEmoji, setOpenEmoji] = useState<boolean>(false)
    useEffect(() => {

        if (token != "") {
            const result = privateAxios.get("account")
                .then(res => {
                    console.log(res.data.data)
                    socket.emit("newUser", res.data.data.idUser)
                    socket.emit("sendNotification", res.data.data.idUser)
                    socket.emit("getFriend", res.data.data.idUser)
                    socket.emit("Post")
                    socket.emit("noticePost",res.data.data.idUser)
                    socket.emit("getLikePost")
                    socket.emit("getAllMessage")
                    // socket.emit("getOnlineUser", res.data.data.idUser)
                    setCurrentUser(res.data.data)
                }
                )
        } else {
            setCurrentUser({})
        }
    }, [])
    useEffect(() => {
        socket.on("getNotification", (data: any) => {
            console.log(data)
            setNotification(data)
        })
        socket.on("likePost", (data: any) => {
            console.log(data)
            setLikePost(data)
        })
        socket.on("sendPosts", (data: any) => {
            console.log(data)
            console.log(moment(data[0].timePost).fromNow())
            const arr = data.map((item: any) => {
                item.timePost = moment(item.timePost).fromNow()
                return item
            })
            console.log(arr)
            setPosts(data)
        })
        socket.on("Friends", (data: any) => {
            console.log(data.data)
            setFriends(data.data)

        })
        socket.on("online", (data: any) => {
            setOnlineWeb(data)
        })
        socket.on("notice",(data:any)=>{
            console.log(data)
            setNoticed(data)
        })
        socket.on("allMessage",(data:any)=>{
            console.log(data)
            setAllMessage(data)
            // setMessageChat(data)
        })

    }, [socket])
    useEffect(() => {
        const result = instance.get(`onlineUser/${currentUser.idUser}`).then((res) => {
            const result1 = res.data.data
            console.log(onlineWeb)
            console.log(result1)
            const arr = onlineWeb.filter((Item: any) => Item.name != currentUser.idUser)
            console.log(arr)
            const arr2: any = []
            arr.forEach((Item: any) => {
                result1.forEach((Item1: any) => {
                    if (Item.name == Item1.idGive.idUser) {
                        arr2.push(Item1)
                    }
                })
            })
            console.log(arr2)
            setUserOnline(arr2)
        })
    }, [onlineWeb])
    useEffect(() => {
        socket.on("message", (data: any) => {
            console.log(data)
            const result = instance.get(`getMessageChat/${data.room}`)
                .then((res) => {
                    const arr = res.data.data.map((item:any)=>{
                        item.timeSend = moment(item.timeSend).fromNow()
                        return item
                    })
                    console.log(arr)
                    setMessageChat(arr)
                })
        })
    }, [socket])


    const addFriends = (idUser: number, index: number,idPost:any) => {
        console.log(idUser)
        console.log(currentUser.idUser)
        const result: any = document.getElementsByClassName("sended")[index]
        result.style.display = "none"
        // console.log(socket)

        const addFriend = instance.post("addFriends", { idSend: currentUser.idUser, idGive: idUser, status: 0, room: 0 })
        socket.emit("addFriend", { idSend: currentUser.idUser, idGive: idUser,idPost:idPost })


    }
    const openChat = (idSend: number, nameUser: string, room: any,avatar:any) => {
        setOpenChata("30vw")

        const result = instance.get(`getMessageChat/${room}`).then((res) => {
            socket.emit("readedMessage",room)

            const arr = res.data.data.map((item:any)=>{
                item.timeSend = moment(item.timeSend).fromNow()
                return item
            })
            setMessageChat(arr)
        })
        const status: any = userOnline?.findIndex((online: any) => online.idGive.idUser == idSend)
        console.log(idSend, currentUser.idUser, nameUser, status)
        setUserChat({
            avatar: avatar,
            room: room,
            idGive: idSend,
            name: nameUser,
            status: status
        })
        socket.emit("join-room", { idSend: currentUser.idUser, room: room })
        // socket.emit("readedMessage",room)
    }
    const closeChat = (room: any) => {
        // socket.emit("ourRoom")
        const result = instance.get(`getMessageChat/${room}`).then((res) => {
            socket.emit("readedMessage",room)

            const arr = res.data.data.map((item:any)=>{
                item.timeSend = moment(item.timeSend).fromNow()
                return item
            })
            setMessageChat(arr)
        })
        setOpenChata("0vw")
        setUserChat({})
    }
    const sendMess = () => {
        // console.log(currentUser.idUserUser,userChat.idGive,message)
        const data: any = {
            room: userChat.room,
            idSend: currentUser.idUser,
            idGive: userChat.idGive,
            message: message
        }
        const result = instance.post("sendMess", data)
            .then((res) => {
                socket.emit("send_mess", data)
                socket.emit("getAllMessage")
            })
        setMessage("")
    }
    const toggel = (e:any)=>{
        const a:any = document.getElementsByClassName("input-post")
        const b:any = document.getElementsByClassName("input-bar")
        const c:any = document.getElementsByClassName("input-text")
        const d:any = document.getElementsByClassName("close")
        console.log(e.target.checked)
        if(e.target.checked){
            console.log("1111")
            a[0].style.backgroundColor = "wheat"
            b[0].style.backgroundColor = "white"
            c[0].style.color = "black"
            d[0].style.color = "brown"
        }else{
            a[0].style.backgroundColor = ""
            b[0].style.backgroundColor = ""
            c[0].style.color = "white"
            d[0].style.color = "white"

        }
    }
   
    const openPosta = ( )=>{
        setOpenPost("35vw")
    }
    const closePost = ()=>{
        setOpenPost("5vw")
    }
    const sendPost = async()=>{
        console.log(post,currentUser.idUser)
        const formData:any = new FormData();
        formData.append("file", selectedMedia);
        formData.append("upload_preset", "project3");
        const [uploadMedia] = await Promise.all([
          axios.post(
            "https://api.cloudinary.com/v1_1/dcmrlgyyd/image/upload",
            formData
          ),
        ]);
        const media = uploadMedia.data.secure_url;
        console.log(media);
        const data:any = {
            idUser: currentUser.idUser,
            content: post,
            imagePost: media
        }
        if( data.idUser !=  "" && data.content != "" && data.imagePost != ""){
            const result = await instance.post("addPost", data)
            .then((res)=>{
                socket.emit("Post")
                setPost("")
                setImageView("")
            })
        }
    }
    const changeImage = (event:any) => {
        console.log(event.target.files[0])  
        setSelectedMedia(event.target.files[0]);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event:any) {
          console.log(event.target.result);
          setImageView(event.target.result);

        };
        reader.readAsDataURL(file);
      };
    const addLike = (id:any,index:any,idPost:any)=>{
        console.log(index,id,currentUser.idUser)
        const a:any = document.getElementsByClassName("like")[index]
        if(a.style.color == "red"  ){
            a.style.color = "" 
        }else{
            a.style.color = "red" 
        }
        socket.emit("addLike",{idSend:currentUser.idUser,idGive:id,idPost:idPost})
        
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageChat]);
    return (
        <>
            <NavFilm />
            <NavNotice arrNotice={notification} idSend={currentUser.idUser} socket={socket} />
            {
                token == "" ?<div className="web-ticket">
                    <div className="body-web">
                        <h1 style={{color:"white"}}>Please Login ...</h1>
                    </div>
                </div>:<div className="web-ticket">
                <div className="body-web">

                    <div className='input-post' style={{height: openPost}}>
                        <div className='input-bar' onClick={openPosta}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "silver", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginRight: "0.5rem" }}>
                                <img src={currentUser.avatar} width={"35px"} height={"35px"} alt="" />
                            </div>
                            <input type="text" name="" id="" placeholder='New Post ' className='input-text' onChange={(e) => setPost(e.target.value)} value={post}/>
                            <label htmlFor="input-file">
                                <i className="fa-solid fa-image" ></i>
                            </label>
                            <input type="file" onChange={changeImage} id='input-file' style={{ display: "none"}}/>
                            <button className='btn-post' onClick={sendPost}>Post</button>
                        </div>
                        <div className='add-photo'>
                            <img src={imageView ? imageView : "../../../../public/images/add-photo.png"} alt="" width={300}  height={300}/>
                        </div>
                        <div className='toggle'>
                                <input type="checkbox" id="toggle_checkbox" onClick={toggel} />
                                <label htmlFor="toggle_checkbox">
                                    <div id="star">
                                        <div className="star" id="star-1">
                                            ★
                                        </div>
                                        <div className="star" id="star-2">
                                            ★
                                        </div>
                                    </div>
                                    <div id="moon" />
                                </label>
                        </div>
                        <h3  className='close' onClick={closePost} style={{ cursor: "pointer",color:"white"}}>Close</h3>
                    </div>

                    <div className='render-post'>
                        {
                            posts.map((item: any, index: number) => {
                                return <div className='post'>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "silver", display: "flex", justifyContent: "center", alignItems: "center",overflow: "hidden", marginRight: "0.5rem" }}>
                                            <img src={item.avatar} width={"40px"} alt="" />
                                        </div>
                                        <div>
                                            <h5>{item.nameUser}</h5>
                                            <p style={{ fontSize: "0.6rem" }}> {item.timePost.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div style={{ margin: "0.5rem 0" }}>
                                        <p> {item.content}</p>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
                                        <img src={item.imagePost} height={"250px"} alt="" />
                                    </div>
                                    <div>
                                        <span>{
                                           likePost?.findIndex((notice: any) => (notice.idPost == item.idPost))!= -1 ? <span> {likePost?.filter((notice: any) => (notice.idPost == item.idPost && notice.status == 0))?.length} like   </span>  : ""
                                        }</span>
                                        <i className="fa-solid fa-heart like" 
                                        style={{color: noticed?.findIndex((notice: any) => (
                                             notice.idPost == item.idPost  && notice.status == 0
                                        )) != -1 ? "red" : "" }} onClick={() => addLike(item.idUser,index,item.idPost)}></i>
                                        <i className="fa-solid fa-message"></i>
                                        {
                                            (friends?.findIndex((friend: any) => (friend.idGive == item.idUser)) != -1 || (item.idUser == currentUser.idUser)) ? null : <i className="fa-solid fa-user-plus sended" onClick={() => addFriends(item.idUser, index, item.idPost)}></i>
                                        }
                                        {/* <i className="fa-solid fa-user-plus" onClick={() => addFriends(item.idUser)}></i> */}
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className='chat-bar'>
                    <div className='friends-chat'>
                        {
                            friends.map((item: any) => {
                                return <div style={{ position: "relative", marginTop: "1rem" }}>
                                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(14, 13, 13, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                                        <img src={item.avatar} width={"65px"} alt="" />
                                    </div>
                                    <div className='status-friend' style={{ backgroundColor: userOnline?.findIndex((online: any) => online.idGive.idUser == item.idGive) != -1 ? "green" : "red" }}></div>
                                </div>

                            })
                        }
                    </div>
                    <div className='friends-boxchat'>
                        {
                            friends.map((item: any) => {
                                return <div style={{ position: "relative", margin: "1rem", marginLeft: "1rem", backgroundColor: "black", height: "70px", padding: "5px", borderRadius: "35px" }} onClick={() => { openChat(item.idGive, item.nameUser, item.room,item.avatar) }} >
                                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(14, 13, 13, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                                        <img src={item.avatar} width={"65px"} alt="" />
                                    </div>
                                    <h3 style={{ color: "white", position: "absolute", top: "0", left: "5rem" }}>{item.nameUser}</h3>
                                    <h5 style={{ color: userOnline?.findIndex((online: any) => online.idGive.idUser == item.idGive) != -1 ? "green" : "silver", position: "absolute", top: "2rem", left: "5rem" }}>
                                        {userOnline?.findIndex((online: any) => online.idGive.idUser == item.idGive) != -1 ? "online" : "offline" }
                                    </h5>
                                    {
                                    allMessage?.filter((message: any) => message.idGive == item.idSend && message.readed == 0 && message.room == item.room ).length != 0? 
                                    <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem",backgroundColor:"red",padding:"0.2rem",borderRadius:"10px",display:"flex",justifyContent:"center",alignItems:"center",width:"20px",height:"20px"  }}>
                                        <p style={{ color: "white", top: "4rem", left: "5rem" }}>
                                        {allMessage?.filter((message: any) => message.idGive == item.idSend && message.readed == 0 && message.room == item.room).length}
                                        </p>
                                    </div> : ""
                                    }

                                    
                                    <div className='status-friend' style={{ backgroundColor: userOnline?.findIndex((online: any) => online.idGive.idUser == item.idGive) != -1 ? "green" : "red" }}></div>
                                </div>

                            })
                        }
                    </div>
                </div>

                <div className='chat-box' style={{ width: openChata }}>
                    <div>
                        <i className="fa-solid fa-xmark" style={{ color: "red", position: "absolute", top: "2.5rem", fontSize: "1.5rem", fontWeight: "bold", right: "1rem", zIndex: "100" }} onClick={() => closeChat(userChat.room)}></i>
                    </div>
                    <div className='render-chat'>
                        <h3 style={{ color: "brown" }}>
                            {userChat?.name}
                        </h3>
                        <p style={{ color: "silver", fontSize: "0.8rem" }}>{userChat.status != -1 ? "online" : "offline"} <span style={{ backgroundColor: userChat.status != -1 ? "green" : "red", display: "inline-block", width: "8px", height: "8px", borderRadius: "50%" }}></span></p>
                        {/* <p style={{color: "silver" , fontSize:"0.8rem"}}>offline <span style={{backgroundColor: "red",display:"inline-block",width:"8px",height:"8px",borderRadius:"50%"}}></span></p> */}
                        <div className='render-message'>
                            {
                                messageChat.map((item: any) => {
                                    if (item.room == userChat.room) {
                                        return <div style={{ display: "flex" ,flexDirection:item.idGive.idUser == currentUser.idUser ? "row" : "row-reverse" ,width:"100%"}}>
                                            <div style={{
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "0.5rem",
                                            }}>
                                                <img src={item.idGive.idUser == currentUser.idUser ?userChat.avatar:currentUser.avatar} alt="" width={50}/>
                                            </div>
                                            <div style={{ display: "flex", backgroundColor: item.idGive.idUser == currentUser.idUser ? "orange" : "brown", padding: "0.5rem", borderRadius: "10px", width: "fit-content", marginBottom: "1rem",position:"relative" }}>
                                                <p style={{ color: "white", fontSize: "0.8rem", fontWeight: "bold",minWidth:"100px",maxWidth:"200px",wordWrap:"break-word",paddingBottom:"0.8rem" }}><span>{item.contents}</span>  </p>
                                                <p style={{ color: "black", fontSize: "0.5rem" ,position:"absolute",bottom:"5px",right:"10px",fontWeight:"bold"}}>{item.timeSend}</p>
                                            </div>
                                        </div>
                                    }


                                })
                            }
                            <div ref={scrollRef}></div>
                        </div>
                    </div>
                    <div className='input-chat'>
                        <input type="text" placeholder='Enter message ...' onChange={(e) => setMessage(e.target.value)} value={message} />
                        <button className='button-emoji' onClick={() => setOpenEmoji(!openEmoji)} >
                            <img src="../../../../public/images/sun.png" alt="" />
                        </button>
                        <button className='button-send' onClick={sendMess}>
                            <i className="fa-solid fa-cloud cloud1" ></i>
                            <i className="fa-solid fa-cloud cloud2"></i>
                            <i className="fa-regular fa-paper-plane fly"></i>
                        </button>
                        <div className='emoji' style={{ display: openEmoji ? "block" : "none" }}>
                            <Picker 
                            
                            previewPosition="none"
                            onEmojiSelect={(e:any)=>{
                                setMessage(message + e.native)
                                setOpenEmoji(false)
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            }
            
        </>
    )
}

