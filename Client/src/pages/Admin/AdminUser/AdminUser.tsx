import React, { useEffect, useState } from 'react'
import './AdminUser.scss'
import NavAdminn from '../../../components/NavAmin/NavAmin'
import instance from '../../../utils/axios/axiosPublic'

type users = {
    idUser: number;
    nameUser: string;
    email: string;
    role: number;
    active: number;
    avatar?: string;
    phoneNumber?: string;
}
export default function AdminUser() {
    const [users,setUsers] = useState<users[]>([])

    useEffect(()=>{
    instance.get("/getUser").then((res)=>{
        setUsers(res.data.data)
    })
},[])
const changeStatus= async(id:number,active:number)=>{
    const activea = active ? 0 : 1
    console.log(activea)
    const result = await instance.put('/usersActive',{active : activea,id:id})
    console.log(result.data.data)
    setUsers(result.data.data)
}
  return (
    <>
    <NavAdminn />
    <div className='AdminUser'>
        <div className='AdminUser__render'>
            <table>
                <thead>
                <th>Stt</th>
                <th>Name User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
                </thead>
                <tbody>
                    {
                        users.map((item,index)=>{
                            if(item?.role === 0){
                               return <tr key={index}>
                                <td>{index +1}</td>
                                <td>{item?.nameUser}</td>
                                <td>{item?.email}</td>
                                <td style={{color:item?.active?"green":"red"}} >{item?.active?"Active":"Block"}</td>
                                {/* <td><button style={{color:item?.active?"red":"green"}} onClick={()=>changeStatus(item.idUser,item.active)} >{item?.active?"Block":"Active"}</button></td> */}
                                <td>
                                    <div className="content">
                                        <label className="switch">
                                            <input type="checkbox" checked = {item?.active ? true : false} onClick={()=>changeStatus(item.idUser,item.active)}/>
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </td>
                            </tr> 
                            }
                            
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
    </>
  )
}
