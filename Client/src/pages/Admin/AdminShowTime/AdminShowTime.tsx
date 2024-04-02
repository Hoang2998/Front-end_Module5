import React, { useEffect, useState } from 'react'
import './AdminShowTime.scss'
import NavAdminn from '../../../components/NavAmin/NavAmin'
import instance from '../../../utils/axios/axiosPublic'

interface film {
    idFilm: string;
    nameFilm: string;
    imageFilm: string;
    detailFilm: string;
    duration: string;
    releaseDate: string;
    trailer: string;
    // idCategory: string;
}
interface room{
    idRoom: number;
    nameRoom: string;
}
interface showTime {
    idTime: number;
    showTimeAt: string;
}
interface arrShowTime {
  // idSetupFilm?:number;
  idFilm?:number;
  idRoom?:number;
  idShowTime:number;
  date_show?:string;
  duration?:string;
  nameFilm?:string;
  nameRoom?:String;
  showTimeAt?:String;
}
export default function AdminShowTime() {
    const [films, setFilms] = useState<film[]>([])
  const [dayShowFilm, setDayShowFilm] = useState<string[]>([])
  const [room, setRoom] = useState<room[]>([])
  const [time, setTime] = useState<showTime[]>([])
  const [arrShowTime, setArrShowTime] = useState<arrShowTime[]>([])
  const [allShowTime, setallShowTime] = useState<arrShowTime[]>([])
  const [duration, setDuration] = useState("")
  const [shotime, setShotime] = useState<arrShowTime>({
    // idSetupFilm:-1,
    idFilm: -1,
    idRoom: -1,
    date_show: "",
    duration: "",
    idShowTime: -1,
  })
 useEffect(() => {
  //  instance.get("/filmsSetup").then((res) => {
  //   //  console.log(res.data.data);
  //    setFilms(res.data.data);
  //  })
  const now1 = new Date();
  let arr:string[] = []
  for(let i = 0;i<5;i++){
    const day = new Date(now1)
    day.setDate(now1.getDate() + i)
    arr.push(day.toISOString().split('T')[0])
    }
  setDayShowFilm(arr)
   instance.get("/getRoom").then((res) => {
     console.log(res.data.data);
     setRoom(res.data.data);
   })
   instance.get("/getShowTime").then((res) => {
    console.log(res.data.data);
     setTime(res.data.data);
   })
   instance.get("/getAllDayShowTime").then((res) => {
    console.log(res.data.data)
     setallShowTime(res.data.data)
   })
 },[])
 const changeValue = async(e:React.ChangeEvent<HTMLSelectElement>) => {
  if(e.target.name == "date"){
    console.log(e.target.value)
    const result = await instance.get(`/getFilmChoose/${e.target.value}`)
    console.log(result.data.data)
    setFilms(result.data.data)
    setShotime({
      ...shotime,
      date_show: e.target.value,
    })
    return

  }
   if(e.target.name == "idFilm"){
    const result = await instance.get(`/getFilmSetup/${e.target.value}`)
    console.log(result.data.data)
    setDuration(result.data.data.duration)
    setShotime({
      ...shotime,
      idFilm: Number(e.target.value),
      duration: result.data.data.duration,
    })
    return
   }
  //  console.log(e.target.value)
   console.log(shotime)
   setShotime({
     ...shotime,
     [e.target.name]: e.target.value,
   })
 }
 const addNewShowTime = async(show:number,index:number) => {  
   const arr:arrShowTime[] = [...arrShowTime]
   if(shotime.idFilm && shotime.idRoom && shotime.date_show){
    // console.log(index)
    let endtime = (+duration.split(":")[0] + 1 ) * 2 + index
    if(endtime > 24){
      endtime = 25
    }
    // if (arr[0] == null) return
      const check = arr.findIndex((item:arrShowTime) => +item.idShowTime - 1 == index)
      // console.log(check)
      const a:any = document.getElementsByClassName(`btn1`)
      const b:any = document.getElementsByClassName(`btn2`)
      if (check != -1) {
        arr.splice(check, 1)
        setArrShowTime(arr)
        console.log(endtime)
        a[index].style.backgroundColor = 'black'
        for(let i = index+1;i< endtime ;i++){
           b[i].style.zIndex = '1'
        }
        console.log(arr)  
        return
      }

      const arrNew = arr.filter((item:arrShowTime) => +item.idShowTime - 1 > index)
      console.log(arrNew)
      const result = arrNew.findIndex((item:arrShowTime) => +item?.idShowTime - 1 - index <= endtime)
      console.log(result)
      let result2:any = arrNew[result]?.idShowTime
      console.log(result2)
      a[index].style.backgroundColor = 'red'
      if(result2){
        const index = arr.findIndex((item:arrShowTime)=> +item?.idShowTime == result2)
        arr.splice(index, 1)
        setArrShowTime(arr)
        let endtimea = (+duration.split(":")[0] + 1 ) * 2 + result2
        if(endtimea > 24){
          endtimea = 25
        }
        a[result2-1].style.backgroundColor = 'black'
        for(let i = result2;i< endtimea ;i++){
            b[i].style.zIndex = '1'
        }
      }
    for(let i = index+1;i< endtime ;i++){
    b[i].style.zIndex = '0'
   }
    arr.push({...shotime, idShowTime:show})
    setArrShowTime(arr)
    console.log(arr)
   }else{
    alert("vui long nhap thong tin")
   }
 }
 const addShowTime = async() => {
  console.log(arrShowTime)
  if(arrShowTime.length > 0){
  const result = await instance.post("/addShowTime",{data:arrShowTime})
    console.log(result.data.data)
    setallShowTime(result.data.data)
    setArrShowTime([])
  }
   checkShowTime()
 }
 const checkShowTime = async() => {
    const c:any = document.getElementsByClassName(`table__time`)
    c[0].style.height = '35vh'
   console.log(shotime.idRoom,shotime.date_show)
   const result = await instance.post("/checkShowTime",{room:shotime.idRoom,date:shotime.date_show})
  //  setArrShowTime(result.data.data)
   console.log(result.data.data)
   const a:any = document.getElementsByClassName(`btn1`)
   const b:any = document.getElementsByClassName(`btn2`)
   for(let i = 0;i<=24;i++){
    a[i].style.backgroundColor = 'black'
    b[i].style.zIndex = '1'
   }
   if(result.data.data == undefined){
    // console.log("111111")
    for(let i = 0;i<24;i++){
      a[i].style.backgroundColor = 'black'
      b[i].style.zIndex = '1'
     }
     return
   }
  //  console.log(result.data.data[0].idShowTime)
   for(let i = 0;i<=24;i++){
    for (let j = 0; j < result.data.data.length; j++) {
      if(i == +result.data.data[j].adminshowtime_idShowTime - 1){
        let endTime = (+result.data.data[j].adminshowtime_duration
          .split(":")[0] +1) * 2 + i
        console.log(endTime)
        console.log(result.data.data[j].adminshowtime_idShowTime - 1)
        console.log(result.data.data[j].adminshowtime_duration.split(":")[0])
        a[i].style.backgroundColor = 'red'
        b[i].style.zIndex = '0'
        for(let k = result.data.data[j].adminshowtime_idShowTime;k< endTime ;k++){
          b[k].style.zIndex = '0'
         }
      }
      }
    }
 }
  return (
    <>
    <NavAdminn/>
    <div className='AdminBills'>
        <div className='AdminBills__render'>
          <div className='table__setUp'>

          <div>
              <label htmlFor="">Ngày chếu phim :</label>
              <br />
              <select name="date" id="" onChange={(e)=>{changeValue(e)}}>
                <option value="">Chọn Ngày</option>
                {
                  dayShowFilm.map((item,index)=>{
                    return <option value={item}>{item}</option>
                  })
                }
              </select>
            </div>

          <div>
              <label htmlFor="">Phim:</label>
              <br />
              <select name="idFilm" id="" onChange={(e)=>{changeValue(e)}}>
                <option value="">Chọn Phim</option>
                {
                  films?.map((item)=>{
                    return <option value={item.idFilm}>{item.nameFilm}/{item.releaseDate}/{item.duration} h</option>
                  })
                }
              </select>
            </div>

            

            <div>
              <label htmlFor=""> phong chieu :</label>
              <br />
              <select name="idRoom" id="" onChange={(e)=>{changeValue(e)}}>
                <option value="">Chọn Phòng</option>
                {
                  room?.map((item)=>{
                    return <option value={item.idRoom}>{item.nameRoom}</option>
                  })
                }
              </select>
            </div>
            <div><button className='btn3' onClick={checkShowTime}>Check ShowTime</button></div>
            <div className='table__time' >
              <label htmlFor=""> Gio chieu :</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:"10px"}}>
                {
                  time?.map((item,index)=>{
                    return <div className='btn1'><button className='btn2' value={item.idTime} onClick={()=>{addNewShowTime(item.idTime,index)}}>{item.showTimeAt}</button></div> 
                  })
                }
              </div>
            </div>
            <div>
            <button className='btn3' onClick={addShowTime}>ADD SHOW TIME</button>
            </div>
          </div>

          <div className='table__showtime'>
            <h1>Show Film</h1>
            <div className='table__showtime__render'>
              <table>
                <thead>
                  <th>Stt</th>
                  <th>Film</th>
                  <th>Room</th>
                  <th>Show Time</th>
                  <th>Date</th>
                  <th>Duration</th>
                </thead>
                <tbody>
                 
                    {
                      allShowTime?.map((item:any,index:number)=>{
                        return <tr>
                          <td>{index+1}</td>
                          <td>{item.films.nameFilm}</td>
                          <td>{item.room.nameRoom}</td>
                          <td>{item.showtime.showTimeAt}</td>
                          <td>{item.date_show ? new Date(item.date_show).toLocaleDateString():""}</td>
                          <td>{item.duration}</td>
                        </tr>
                      })
                    }
                 
                </tbody>
              </table>
            </div>
          </div>
          
                {/* <table>
                    <thead>
                        <th>Stt</th>
                        <th>Id Bill</th>
                        <th>Time</th>
                        <th>Detail</th>
                        <th>Status</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {
                            billsPana?.map((item,index)=>{
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.time}</td>
                                    <td><button onClick={()=>{showDetail(item.id)}} >Show Bill</button></td>
                                    <td
                                    style={{color:item.status == 0 ?"yellow":item.status == 1?"green":"red"}}
                                    >{item.status == 0 ?"loading":item.status == 1?"accept":"cancel"}</td>
                                    <td>
                                        {
                                            item.status == 0? <div>
                                                <button onClick={()=>acceptBill(item.id)}>Accept</button>
                                                <button onClick={()=>cancelBill(item.id)}>Cancel</button>
                                            </div> :""
                                        }
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <div className='adminProduct--pana'>
                    <GrPrevious onClick={prePage}></GrPrevious>
                    {
                       totalPage?.map((item)=>{
                        return <div  className='dot' onClick={()=>{setCurrentPage(item+1)
                        changeColor()
                        }}>{item +1}</div>
                       })
                    }
                   <GrNext onClick={nextPage}></GrNext>
            </div>

            <div className='Bill__detail' style={{height:openDetail}}>
                    <h1>Detail Bill</h1>
                    <p> <span>Name:</span>  {billDetail[0]?.address.name}</p>
                    <p> <span>Phone Number:</span> {billDetail[0]?.address.phonenumber}</p>
                    <p><span>Id:</span> {billDetail[0]?. id}</p>
                    <p><span>Time:</span>  {billDetail[0]?.time}</p>
                    <div>
                        <table>
                            <thead>
                                <th>Stt</th>
                                <th>Product</th>
                                <th>Quatity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </thead>
                            <tbody>
                                {
                                    billDetail[0]?.cart.map((item,index)=>{
                                        return <tr key={index}>
                                            <td>{index +1}</td>
                                            <td>{item?.name}</td>
                                            <td>{item?.quantity}</td>
                                            <td>{item?.price} $</td>
                                            <td>{item?.quantity * item?.price } $</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <td colSpan={4}>Total Bill:</td>
                                <td >{totalDetail} $</td>
                            </tfoot>
                        </table>
                    </div>
                    <button onClick={()=>{setOpenDetail("0vh")}}>Close</button>
            </div> */}

        </div>
    </div>
    </>
  )
}
