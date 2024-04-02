import React from 'react'
import "./NavNotice.scss"
import instance from '../../utils/axios/axiosPublic'
export default function NavNotice({ arrNotice, idSend, socket }: any) {
  const [open, setOpen] = React.useState<string>("0px")

  const openNotice = () => {
    setOpen(open == "0px" ? "300px" : "0px")
  }
  const readNotice =  () => {
    console.log(arrNotice)
    const read =  instance.patch("readed",{arr:arrNotice})
    .then(()=>{
      socket.emit("sendNotification",arrNotice[0].idGive)
    })

    setOpen("0px")
  }
  const acceptFriend = (idGive: number) => {

    // const addFriends = instance.post("addFriends",{idSend:idSend,idGive:idGive,status:1})
    // const acceptFrienda  = instance.put("acceptFriend",{idSend:idGive,idGive:idSend,status:1})
    socket.emit("acceptFriend", { idSend: idSend, idGive: idGive })
    // console.log(idUser)
  }
  return (
    <>
      <div className="nav-notice">
        <p className='point-bell'>{
        arrNotice?.findIndex((item: any) => item.readed == 0) != -1 ?  arrNotice?.filter((item: any) => item.readed == 0).length : 0
        }</p>
        <i className="fa-solid fa-bell bell" onClick={openNotice} ></i>
        <p className='point-message'>0</p>
        <i className="fa-solid fa-envelope message"></i>
        <div className='table-notice' style={{ height: open }}>
          {
            arrNotice?.map((item: any) => {
              if (item.readed == 0) {
                if (item.status == 0) {
                  return <div className="body-notice">
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "silver", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginRight: "0.5rem" }}>
                      <img src={item.avatar} alt="" width={30} />
                    </div>
                    <h5> <span>{item.nameUser}</span> da thich bai viet của bạn </h5>
                  </div>
                } else if (item.status == 1) {
                  return <div className='body-notice'>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "silver", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginRight: "0.5rem" }}>
                      <img src={item.avatar} alt="" width={30} />
                    </div>
                    <h5> <span>{item.nameUser}</span>  da gui loi moi cho bn </h5>
                    <button onClick={() => acceptFriend(item.idSend)} > Accept</button>
                    <button> Deny</button>
                  </div>
                }
              }

            })
          }


          <button className='button' onClick={readNotice} >Read all notifications</button>
        </div>
      </div>


    </>
  )
}
