import React, { useEffect, useState } from 'react'
import './NavHome.css'
import { NavLink,useNavigate } from 'react-router-dom'
import axios from 'axios'
import privateAxios from '../../utils/axios/privateAxios'
import instance from '../../utils/axios/axiosPublic'

type user = {
  name?:string
  avatar?:string
  passwords?:string
  email?:string
  phoneNumber?:number
  role?:number
  idUser?:number 
}

export default function NavHome() {
    const [tab,setTab] = useState<string>("0%")
  const [nameUser,setNameUser] = useState<string>("abc")
  const [currentUser,setCurrentUser] = useState<user>({})
//   const carta  = useSelector((data) => data.accountReducer.account);
  const [openUpdatePs , setOpenUpdatePs] = useState<string>("0px")
//   const dispatch = useDispatch()
  const [content,setContent] = useState<string>("")
  const [alert,setAlert] = useState<string>("-20rem")
  const navigate = useNavigate()
  const token = localStorage.getItem("token") || ""
 
  useEffect(()=>{
    if(token != ""){
      const result = privateAxios.get("account")
      .then(res=> setCurrentUser(res.data.data))
    }else{
      setCurrentUser({})
    }
  },[])
  // console.log(currentUser[0].nameuser);
  const closeTab=()=>{
    setTab("0%")
    setOpenTableAvatar("0px")
  }
  const openTab=()=>{
    setTab("38%")
  }
  const changeName = ()=>{

  }

  const changeValue=(e:React.ChangeEvent<HTMLInputElement>)=>{
   setCurrentUser({...currentUser,[e.target.name]:e.target.value}) 
   console.log(currentUser);
  }
  const logOut =()=>{
    localStorage.removeItem("token")
    setCurrentUser({})
    navigate("/login")
    // console.log(currentUser);
    // let arr = {...currentUser}
    // arr.status = 0
    // axios.put(`http://localhost:8008/Account/${arr.id}`,arr)
  }
  useEffect(()=>{
    setTimeout(() => {
      setAlert("-20rem")
    }, 2000);
  },[alert])
  const saveUser = async()=>{
    console.log(currentUser.idUser);
    try {
      const result = await instance.put(`updateUser/${currentUser.idUser}`,currentUser)
      setContent(result.data.message)
      setAlert("35rem")
    } catch (error:any) {
      console.log(error.response.data.message);
    }
  }
  const [newPassword,setNewPassword] = useState({
    password:"",
    newpassword:"",
    comfirmpassword:""
  })
  const checkValuePass = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setNewPassword({...newPassword,[e.target.name]:e.target.value})
    console.log(newPassword);
  }
  const updatePassword = async()=>{

    if(newPassword.password !="" &&
      newPassword.newpassword != "" &&
      newPassword.comfirmpassword != ""
    ){
      console.log(currentUser.idUser)
      try {
        const checkPassword = instance.put(`checkPassword/${currentUser.idUser}`,newPassword)
      .then(res=> {
        setContent(res.data.message)
        setAlert("35rem")
        setNewPassword({
          password:"",
          newpassword:"",
          comfirmpassword:""
        })
        // setOpenUpdatePs("0px")
      })
      } catch (error:any) {
        console.log(error.response.data.message);
        setContent(error.response.data.message)
        setAlert("35rem")
        setNewPassword({
          password:"",
          newpassword:"",
          comfirmpassword:""
        })
        setOpenUpdatePs("0px")
      }
      
      // if (isMatch) {
      //   if(newPassword.newpassword == newPassword.comfirmpassword){
      //     let arr = {...currentUser}
      //     // const hashedPassword = await bcrypt.hash(newPassword.newpassword, 10)
      //     arr.password = hashedPassword
      //     axios.put(`http://localhost:8008/Account/${arr.id}`,arr)
      //     setNewPassword({
      //       password:"",
      //       newpassword:"",
      //       comfirmpassword:""
      //     })
      //     setContent(" Update Accept !")
      //     setAlert("5rem")
      //     setOpenUpdatePs("0px")
      //   }else{
      //     setContent(" Comfirm Password incorrect !")
      //     setAlert("5rem")
      //   }

      // }else{
      //   setContent(" Sai mật khẩu !")
      //   setAlert("5rem")
      // }
    }else{
      setContent("Bạn chưa điền đủ thông tin")
      setAlert("35rem")
    }
  }
  const [openTableAvatar,setOpenTableAvatar] = useState("0px")
  const changeAvatar =(img:string)=>{
    setCurrentUser({...currentUser,avatar:img})
  }
  const saveAvatar =(idUser:number|undefined)=>{
    // let arr = {...currentUser}
    // axios.put(`http://localhost:8008/Account/${arr.id}`,arr)
    setContent(" Accept!")  
    setAlert("32rem")
    setOpenTableAvatar("0px")
  }
  return (
    <>
     
    <div className='navHome'>
      <div className='header__alert' style={{right:alert}}> 
          <p>{content}</p>
      </div>
            <NavLink to="/" style={{textDecoration:"none"}}>
            <div className="header--link">Home</div>
            </NavLink>
            <NavLink to="./film" style={{textDecoration:"none"}}>
            <div className="header--link">Film</div>
            </NavLink>
            <div >
              <img src="./public/images/shark.png" alt="" width={50} height={50}/>
            </div>
            {/* <div className="header--link">Infomation</div> */}
            <div className="header--link" onClick={openTab}>User</div>
            <NavLink to="/Login" style={{textDecoration:"none"}}>
            <div className="header--link">
              <button className='header--btn' onClick={logOut}>{token != "" ?"Log out":"Log in"}</button>
            </div>
            </NavLink>
    </div>
            <div className='header__user' style={{width:tab}}> 
              <div onClick={closeTab}><div className='header__user--close'>X</div></div>
              <div style={{width:"100%",position:"relative" }}>
                  <div className='header--avatar'>
                  <img src={currentUser.avatar} width={200}  alt="" />  
                  </div>
                  <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}} onClick={()=>{setOpenTableAvatar("300px")}}>
                  <div className='header--changeAvatar'>
                    Change Avatar 
                  </div>
                  </div>
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                   <input type="text" id='ChangName' name='name'  style={{backgroundColor:"transparent",color:"brown"
                   ,border:"none", textAlign:"center",padding:"0.5em",outline:"none",fontSize:"1.5rem" }} 
                   onChange={changeValue}
                   value={currentUser.name}
                   />
                   <label htmlFor="ChangName" onClick={changeName}  >
                   <div style={{color:"brown",cursor:"pointer",fontSize:"1.2rem"}}>edit</div>
                   </label>
                  </div>
              </div>
              <div className='header__user--info'>
                <div>
                    <label htmlFor=""> email</label>
                    <br />
                    <input type="email" placeholder='Email' onChange={changeValue} name='email' value={currentUser.email}/>
                </div>
                <div>
                    <label htmlFor="">Phone Number</label>
                    <br />
                    <input type="text" placeholder='Phone Number' onChange={changeValue}  name='phoneNumber' value={currentUser.phoneNumber} />
                </div>
               
                <p onClick={()=>{setOpenUpdatePs("380px")}} style={{cursor:"pointer",color:"silver"}}>Update Password</p>
                <button onClick={saveUser}>Save</button>


                <div className='header__user__newPassword' style={{height:openUpdatePs}}>
                <div>
                    <label htmlFor="">Password</label>
                    <br />
                    <input type="password" placeholder='Password' onChange={checkValuePass} name='password' value={newPassword.password}/>
                </div>
                <div>
                    <label htmlFor="">New Password</label>
                    <br />
                    <input type="password" placeholder='New Password' onChange={checkValuePass} name='newpassword' value={newPassword.newpassword}/>
                </div>
                <div>
                    <label htmlFor="">Comfirm Password</label>
                    <br />
                    <input type="password" placeholder='Comfirm Password' onChange={checkValuePass} name='comfirmpassword' value={newPassword.comfirmpassword}/>
                </div>
                <button style={{marginTop:"4rem",marginLeft:"1.5rem"}} onClick={updatePassword}>Update</button>
                <button style={{marginTop:"4rem",marginLeft:"1.5rem"}} onClick={()=>{setOpenUpdatePs("0px")}}>Close</button>
                </div>
              </div>

            </div>

            <div className='header__tableAvatar' style={{width:openTableAvatar}}>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://i.pinimg.com/originals/f2/91/b5/f291b5ea58464fc84b46bfe4298fbc77.png")}}
                ><img src={"https://i.pinimg.com/originals/f2/91/b5/f291b5ea58464fc84b46bfe4298fbc77.png"} alt="" width={50} /></div>
               <div className='sameImg'
                onClick={()=>{changeAvatar("https://i.pinimg.com/originals/c8/51/f7/c851f7740be845fb788cc847d73bf9a9.png")}}
                ><img src={"https://i.pinimg.com/originals/c8/51/f7/c851f7740be845fb788cc847d73bf9a9.png"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://i.pinimg.com/originals/92/1d/6e/921d6ec30a3f911a05b6bb939c9ae303.png")}}
                ><img src={"https://i.pinimg.com/originals/92/1d/6e/921d6ec30a3f911a05b6bb939c9ae303.png"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://i.pinimg.com/originals/66/d6/30/66d6304607ae97c4ac8b0ac0febbc92d.png")}}
                ><img src={"https://i.pinimg.com/originals/66/d6/30/66d6304607ae97c4ac8b0ac0febbc92d.png"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://toigingiuvedep.vn/wp-content/uploads/2022/08/hinh-avatar-ff-hoi-nhom.jpg")}}
                ><img src={"https://toigingiuvedep.vn/wp-content/uploads/2022/08/hinh-avatar-ff-hoi-nhom.jpg"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://khoinguonsangtao.vn/wp-content/uploads/2022/09/avatar-ff-ngau-nhat-danh-cho-gamer.jpg")}}
                ><img src={"https://khoinguonsangtao.vn/wp-content/uploads/2022/09/avatar-ff-ngau-nhat-danh-cho-gamer.jpg"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJB2kPENBfFHGxTBl1Mdz2Nzeq72KmOF-GKbLZ6aWv5f5TKKQFCM0-qKCwlMLWTs99XRU&usqp=CAU")}}
                ><img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJB2kPENBfFHGxTBl1Mdz2Nzeq72KmOF-GKbLZ6aWv5f5TKKQFCM0-qKCwlMLWTs99XRU&usqp=CAU"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU2pPaIqQb4YjAmXVYX1vFG5TWNP5R6xpRi0tfyRdfcfgiPirdu-CtH9nU2ZxznFT48Q4&usqp=CAU")}}
                ><img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU2pPaIqQb4YjAmXVYX1vFG5TWNP5R6xpRi0tfyRdfcfgiPirdu-CtH9nU2ZxznFT48Q4&usqp=CAU"} alt="" width={50} /></div>
                <div className='sameImg'
                onClick={()=>{changeAvatar("https://media.istockphoto.com/id/1346361424/vi/vec-to/linh-v%E1%BA%ADt-game-th%E1%BB%A7.jpg?s=1024x1024&w=is&k=20&c=TxGFMvsehIpp54bcD1HVP3ziGfF-7wIOYd8lt6PLyb0=")}}
                ><img src={"https://media.istockphoto.com/id/1346361424/vi/vec-to/linh-v%E1%BA%ADt-game-th%E1%BB%A7.jpg?s=1024x1024&w=is&k=20&c=TxGFMvsehIpp54bcD1HVP3ziGfF-7wIOYd8lt6PLyb0="} alt="" width={50} /></div>
                <div><button onClick={()=>saveAvatar(currentUser.idUser)}>Save</button></div>
            </div>
    </>
  )
}

