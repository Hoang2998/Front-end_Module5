import React, { useEffect, useState } from 'react'
import NavFilm from '../../../components/NavFilm/NavFilm'
import './MyTicket.scss'
import { GrPrevious,GrNext  } from "react-icons/gr";
import privateAxios from '../../../utils/axios/privateAxios';
import instance from '../../../utils/axios/axiosPublic';
import { Input, QRCode, Space } from 'antd';
const token = localStorage.getItem("token") ||"";
interface ticket {
    idAdminShowTime:number,
    idUser:number,
    idChair:number,
    dateBuy:string,
    price:number,
    idTicket:number,
    nameUser:string,
    nameFilm:string,
    nameRoom:string,
    showTimeAt:string,
    date:string,
    imageFilm:string,
    date_show:string
}
interface user {
    nameUser?:string
    email?:string
    passwords?:string
    avatar?:string
    phoneNumber?:string
    role?:number
    idUser?:number
}
export default function MyTicket() {
  const [billRender,setBillRender] = useState<any[]>([]);
  const [billPana,setBillPana] = useState<any[]>([])
  const [currentPage,setCurrentPage] = useState<number>(1)
  const [totalPage,setTotalPage] = useState<number[]>([])
  const [billDetail,setBillDetail]= useState<any[]>([])
  const [now,setNow] = useState<string>("")

const [user,setUser] = useState<user>({})
    useEffect(()=>{
        const now = new Date().toISOString().slice(0, 10).split("-").join("")
        setNow(now)
        if(token!=""){
            const result = privateAxios.get("/getTicketsUser")
        .then(res=>{
        console.log(res.data.data)
        setBillRender(res.data.data.reverse())
        // setUser(res.data.user)
        }
        )
        }
        
        
    },[])
    useEffect(()=>{
        let arr:ticket[] = []
        let arr2:number[] =[]
        const currentPerPage = 6
        const start = (currentPage - 1)*currentPerPage
        let end = currentPage* currentPerPage
        for(let i =0 ;i<Math.ceil( billRender.length/currentPerPage);i++){
            arr2.push(i)
        }
        setTotalPage(arr2)
        if( end > billRender.length){
           end = billRender.length
        }
        for(let i = start ; i<end;i++){
            arr.push(billRender[i])
        }
        console.log(arr);
        setBillPana(arr)
    },[currentPage,billRender])
    const nextPage=()=>{

        if(currentPage >= totalPage.length){
            setCurrentPage(1)
        }else{
            setCurrentPage(currentPage+1)
        }
    }
    const prePage=()=>{

        if(currentPage < totalPage.length){
            setCurrentPage(totalPage.length)
        }else{
            setCurrentPage(currentPage-1)
        }
    }

    const [openDetail,setOpenDetail] = useState("0vh")
    const [totalDetail,settotalDetail] = useState("0")
    const showDetail=async(id:number)=>{
        setOpenDetail("90vh")
       const arr:ticket[] = billRender.filter((item:ticket)=>{
            return item.idTicket === id
        })
       setBillDetail(arr)
    }
  return (
    <>
    <NavFilm/>  
    <div className='historyBill'>
        {
            token == "" ? <div className='historyBill__render'>
                <h1>Please Login ...</h1>
            </div>
             :<div className='historyBill__render'>
            <h1>History Bill</h1>
            <div className='historyBill__render__table'>
                <table style={{width:"100%"}}>
                <thead >
                    <th>Stt</th>
                    <th>ID Ticket</th>
                    <th>Date Buy</th>
                    <th>Date Show</th>
                    <th>Detail</th>
                    {/* <th>Status</th> */}
                </thead>
                <tbody>
                    {
                        billPana?.map((item:any,index:number)=>{
                            return <tr>
                                <td>{index+1}</td>
                                <td style={{width:"60px"}}>{item?.idTicket}</td>
                                <td>{item?.dateBuy}</td>
                                <td
                                style={{color:item?.adminshowtime.date_show.split("-").join("") >= now ?"orange":"",cursor:"pointer"}}
                                >{item?.adminshowtime.date_show}</td>
                                <td className='seeDetail' onClick={()=>{showDetail(item.idTicket)}} > See Detail</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            </div>
            {/* phan trang */}
            <div className='historyBill--pana'>
                    <GrPrevious onClick={prePage}></GrPrevious>
                    {
                       totalPage?.map((item)=>{
                        return <div  onClick={()=>{setCurrentPage(item+1)}}>{item+1}</div>
                       })
                    }
                   <GrNext onClick={nextPage}></GrNext>
            </div>
            
            <div className='historyBill__detail' style={{height:openDetail}}>
                        <div>
                          <p className="msg">Drag &amp; Drop the ticket</p>
                          <div className="m-ticket">
                              <p className="m">M-Ticket</p>
                              <div className="movie-details">
                                  <img
                                      src={billDetail[0]?.adminshowtime?.films?.imageFilm}
                                      className="poster"
                                  />
                                  <div className="moviea">
                                      <h4>{billDetail[0]?.adminshowtime?.films?.nameFilm}</h4>
                                      <p>2D</p>
                                      <p>{billDetail[0]?.adminshowtime?.showtime?.showTimeAt}h | {billDetail[0]?.adminshowtime?.date_show}</p>
                                      {/* <p>INOX Eros One: Jangpura Extn</p> */}
                                  </div>
                              </div>
                              <div className="info">Tap for support, details &amp; more actions</div>
                              <div className="ticket-details">
                                     <img
                                      src="https://pngimg.com/uploads/qr_code/qr_code_PNG2.png"
                                      className="scan"
                                  />                            
                                  <div className="ticket">
                                      <p>1 Ticket</p>
                                      <b>SCREEN {billDetail[0]?.adminshowtime?.room?.nameRoom}</b>
                                      <p>PR-{billDetail[0]?.chair.nameChair}</p>
                                      <h6>BOOKING ID:  {billDetail[0]?.idTicket}</h6>
                                  </div>
                              </div>
                              <div className="info-cancel">Cancellation not available for this venue</div>
                              <div className="total-amount">
                                  <p>Total Amount</p>
                                  <p>{(+billDetail[0]?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                              </div>
                          </div>
                          <button onClick={()=>{setOpenDetail("0vh")}}>Close</button>

                              {/*-m-ticket end--*/}
            </div>
            </div>

        </div>
        }
        
    </div>  
    </>
  )
}
