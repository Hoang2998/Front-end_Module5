import React, { useEffect, useRef, useState } from 'react'
import './Film.scss'
import { NavLink, useNavigate } from 'react-router-dom';
import privateAxios from '../../../utils/axios/privateAxios';
import NavFilm from '../../../components/NavFilm/NavFilm';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaCartPlus } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { Rate } from "antd";
import instance from '../../../utils/axios/axiosPublic';
import NavNotice from '../../../components/NavNotice/NavNotice';

type film = {
    nameFilm: string
    idFilm: number
    releaseDate: string
    duration: string
    imageFilm: string
    detailFilm: string
    trailer: string
    categoryFilm?: string
    name?: string
    date_show: string
    idRoom: number
    nameRoom?: string
    showTimeAt?: string
}
interface ticket {
    idTicket?: number;
    idAdminShowTime?: number;
    idUser?: number;
    idChair: number;
    dateBuy?: string;
    price?: string;
}
interface chair {
    idChair: number;
    nameChair: string;
    idPrice: number;
}
export default function Film() {

    const [filmComing, setFilmComing] = useState<film[]>([])
    const [filmNowShowing, setFilmNowShowing] = useState<film[]>([])
    const [categoryForFilms, setCategoryForFilms] = useState<film[]>([])
    const [openDetail, setOpenDetail] = useState<string>("0");
    const [filmDetail, setFilmDetail] = useState<film>({
        nameFilm: "",
        idFilm: -1,
        releaseDate: "",
        duration: "",
        imageFilm: "",
        detailFilm: "",
        trailer: "",
        categoryFilm: "",
        name: "",
        date_show: "",
        idRoom: -1
    });
    const [timeNow, setTimeNow] = useState<string>("")
    const [openBuy, setOpenBuy] = useState<string>("0px")
    const [alert, setAlert] = useState<string>("0px")
    const [content, setContent] = useState<string>("Thêm giỏ hàng thành công ^^")
    const [user, setUser] = useState<any>({});
    const [films, setFilms] = useState<any[]>([]);
    const [newTicket, setNewTicket] = useState<ticket>({
        idTicket: -1,
        idAdminShowTime: -1,
        idUser: -1,
        idChair: -1,
        dateBuy: "",
        price: ""
    })
    const [ticket, setTicket] = useState({
        idFilm: -1,
        idRoom: -1,
        idShowTime: -1,
        date_show: ""
    })
    const [day, setDay] = useState<string[]>([]);
    const [checkRoom, setCheckRoom] = useState<film[]>([])
    const [chair, setChair] = useState<chair[]>([])
    const [ShowTimeTicket, setShowTimeTicket] = useState<film[]>([])
    const [openChair, setOpenChair] = useState<string>("0px")
    const [checkShowTimes, setCheckShowTimes] = useState<film[]>([])
    const [price, setPrice] = useState({
        priceDay: -1,
        priceRoom: -1
    })
    const [openPayment, setOpenPayment] = useState<string>("0px")
    const token = localStorage.getItem("token") || ""
    const [comment, setComment] = useState<string>("")
    const [rate, setRate] = useState<number>(0)
    const [allComment, setAllComment] = useState<any[]>([])
    useEffect(() => {
        const now: any = new Date()
        now.current = now.toISOString().split("T")[0]
        setTimeNow(now.toISOString().split("T")[0].split("-").join(""))
        let arr: string[] = []
        for (let i = 0; i < 6; i++) {
            let day = new Date(now)
            day.setDate(now.getDate() + i)
            arr.push(day.toUTCString())
        }
        setDay(arr)
        instance.get("/filmComing").then((res) => {
            console.log(res.data.data);
            setFilmComing(res.data.data);
        })

        instance.get("/filmNowShowing").then((res) => {
            console.log(res.data.data);
            setFilmNowShowing(res.data.data);
        })

        instance.get("/getCategoryForFilms").then((res) => {
            console.log(res.data.data)
            setCategoryForFilms(res.data.data)
            // setCategoryForFilms()
        })
        instance.get("/getChair").then((res) => {
            console.log(res.data.data)
            setChair(res.data.data)
            // console.log(res.data.data[0])
        })
        instance.get("/getAllComment").then((res) => {
            setAllComment(res.data.data)
        })
        if(token != ""){
            console.log(token)
            const result = privateAxios.get("account")
            .then((res)=> {
                console.log(res.data.data)
                setUser(res.data.data)})
          }else{
            setUser({})
          }
    }, [])
    const next = () => {
        let lists = document.querySelectorAll(".item");
        const a: any = document.getElementById("slide");
        a.appendChild(lists[0])
    };
    const pre = () => {
        let lists = document.querySelectorAll(".item");
        const b: any = document.getElementById("slide")
        b.prepend(lists[lists.length - 1]);
    };
    const openDetaila = async (index: number, id: number) => {
        console.log(id)
        setOpenDetail("100vh");
        const result = await instance.get(`/getFilmUpdate/${id}`);
        // const result2 = await instance.get(`/getCategoryForFilmUpdate?idFilm=${id}`);
        // console.log(result2.data.data);
        console.log(result.data.data);
        setFilmDetail({
            ...filmDetail,
            idFilm: result.data.data.idFilm,
            nameFilm: result.data.data.nameFilm,
            duration: result.data.data.duration,
            releaseDate: result.data.data.releaseDate,
            imageFilm: result.data.data.imageFilm,
            detailFilm: result.data.data.detailFilm,
            trailer: result.data.data.trailer,
        })
    };
    const closeDetial = () => {
        setOpenDetail("0vh");
    }
    const buyTicket = async (idFilm: number) => {
        if(token==""){
            setContent("Please login to buy tickets")
            setAlert("200px")
        }else{
            const now: any = new Date()

        setOpenBuy("90vh")

        try {
            const result = await privateAxios.get(`/getfilmBuyTicket/${idFilm}`)
            console.log(result.data.data)
            // const idUser = result.data.user.idUser
            // console.log(idUser)
            // setUser(result.data.user)
            // console.log(user)
            setFilms(result.data.data)
            // console.log(result.data.data[0])
            // console.log(idFilm)
            setTicket({ ...ticket, idFilm: idFilm })
            setNewTicket({ ...newTicket, idUser: user.idUser, dateBuy: now.toISOString().split("T")[0] })
        } catch (error: any) {
            setContent(error.response.data.message)
            setAlert("200px")
        }
        }
        

    }
    const closeBooking = () => {
        setNewTicket({
            idTicket: -1,
            idAdminShowTime: -1,
            idUser: -1,
            idChair: -1,
            dateBuy: "",
            price: ""
        })
        const a: any = document.getElementsByClassName('dayTicket')
        const b: any = document.getElementsByClassName('roomTicket')
        const c: any = document.getElementsByClassName('chair')
        const d: any = document.getElementsByClassName('showTimeTicket')
        for (let i = 0; i < 6; i++) {
            a[i].style.color = ' rgba(255, 166, 0, 0.2)'
        }
        for (let i = 0; i < b.length; i++) {
            b[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        for (let i = 0; i < c.length; i++) {
            c[i].style.color = 'white'
        }
        for (let i = 0; i < d.length; i++) {
            d[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        setOpenChair("0vh")
        setChairTicket([])
        setTicket({
            idFilm: -1,
            idRoom: -1,
            idShowTime: -1,
            date_show: ""
        })
        setCheckRoom([])
        setShowTimeTicket([])

        setOpenPayment("0vw")
        setOpenBuy("0vh")
    }
    const checkShowTime = (day: string, index: number) => {
        // console.log(day)
        const a: any = document.getElementsByClassName('dayTicket')
        a[index].style.color = 'orange'
        const b: any = document.getElementsByClassName('roomTicket')
        const c: any = document.getElementsByClassName('chair')
        for (let i = 0; i < 6; i++) {
            if (i != index) {
                a[i].style.color = ' rgba(255, 166, 0, 0.2)'
            }
        }
        for (let i = 0; i < b.length; i++) {
            b[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        for (let i = 0; i < c.length; i++) {
            c[i].style.color = 'white'
        }
        const date = new Date(day)
        const priceDay = date.getDay()
        if (priceDay == 0 || priceDay == 6) {
            setPrice({ ...price, priceDay: 55000 })
        } else {
            setPrice({ ...price, priceDay: 45000 })
        }
        console.log(date)
        setTicket({ ...ticket, date_show: date.toISOString().split("T")[0].split("-").join("") })
        console.log(films[0].date_show.slice(0, 10).split("-").join(""))
        const check = films.filter((item: any) => Number(item.date_show.slice(0, 10).split("-").join("")) == Number(date.toISOString().split("T")[0].split("-").join("")))
        console.log(check)
        let arr: any[] = []
        setCheckShowTimes(check)
        check.forEach((itema) => {
            const check = arr.findIndex((item) => item.room.idRoom == itema.room.idRoom)
            if (check == -1) {
                arr.push(itema)
            }
        })
        console.log(arr)
        setCheckRoom(arr)
        setShowTimeTicket([])
        setOpenChair("0vh")
    }
    const chooseRoom = (idRoom: number, index: number) => {
        const a: any = document.getElementsByClassName('chair')
        const b: any = document.getElementsByClassName('showTimeTicket')
        for (let i = 0; i < a.length; i++) {
            a[i].style.color = 'white'
        }
        for (let i = 0; i < b.length; i++) {
            b[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        const c: any = document.getElementsByClassName('roomTicket')
        c[index].style.color = 'orange'
        if (c.length > 1) {
            for (let i = 0; i < c.length; i++) {
                if (i != index) {
                    c[i].style.color = ' rgba(255, 166, 0, 0.2)'
                }
            }
        }
        const check = checkShowTimes.filter((item:any) => item.room.idRoom == idRoom)
        console.log(check)
        setShowTimeTicket(check)
        console.log(idRoom)
        if (idRoom > 1) {
            setPrice({ ...price, priceRoom: 5000 })
        } else {
            setPrice({ ...price, priceRoom: 10000 })
        }
        setTicket({ ...ticket, idRoom: idRoom, idShowTime: -1 })
        setOpenChair("0vh")
    }
    const chooseChair = async () => {
        console.log(ticket)
        if (ticket.idRoom != -1 && ticket.idFilm != -1 && ticket.idShowTime != -1 && ticket.date_show != "") {
            const result = await instance.get(`/checkTicket?idRoom=${ticket.idRoom}&idFilm=${ticket.idFilm}&idShowTime=${ticket.idShowTime}&date_show=${ticket.date_show}`)
            console.log(result.data.data)
            console.log(result.data.data[0].idSetupFilm)
            setNewTicket({ ...newTicket, idAdminShowTime: result.data.data[0].idSetupFilm })
            setOpenChair("45vh")
            const result2 = await instance.get("/getTicket")
            console.log(result2.data.data)
            const reSaleChair: ticket[] = result2.data.data.filter((item: any) => item.adminshowtime.idSetupFilm == result.data.data[0].idSetupFilm)
            console.log(reSaleChair)
            const a: any = document.getElementsByClassName('chair')
            const b: any = document.getElementsByClassName('chair2')
            reSaleChair.forEach((item: any) => {
                a[item.chair.nameChair - 1].style.color = 'brown'
            })
            for (let i = 0; i < chair.length; i++) {
                if (reSaleChair.findIndex((item: any) => item.chair.nameChair == i + 1) == -1) {
                    b[i].style.zIndex = '2'
                } else {
                    b[i].style.zIndex = '1'
                }
            }
        } else {
            setAlert("20vh")
            setContent("Please choose all fields")
        }
    }

    const chooseShowTime = (idShowTime: number, index: number) => {
        console.log(idShowTime)
        const a: any = document.getElementsByClassName('chair')
        for (let i = 0; i < a.length; i++) {
            a[i].style.color = 'white'
        }
        setTicket({ ...ticket, idShowTime: idShowTime })
        // setNewTicket({...newTicket, idShowTime: idShowTime,idChair: []})
        const b: any = document.getElementsByClassName('showTimeTicket')
        b[index].style.color = 'orange'
        if (b.length > 1) {
            for (let i = 0; i < document.getElementsByClassName('showTimeTicket').length; i++) {
                if (i != index) {
                    b[i].style.color = ' rgba(255, 166, 0, 0.2)'
                }
            }
        }
        setOpenChair("0vh")
        setChairTicket([])
    }
    const [ticketInfo, setTicketInfo] = useState<any>({
        nameFilm: "",
        idFilm: -1,
        releaseDate: "",
        duration: "",
        imageFilm: "",
        detailFilm: "",
        trailer: "",
        categoryFilm: "",
        name: "",
        date_show: "",
        idRoom: -1,
        nameRoom: "",
        showTimeAt: ""
    })
    const bookingTicket = async () => {
        console.log(newTicket)
        console.log(chairTicket)
        const arr: any = []
        chairTicket.forEach((item) => {
            if (item > 20) {
                arr.push(price.priceDay + price.priceRoom + 30000)
            } else {
                arr.push(price.priceDay + price.priceRoom + 5000)
            }
        })
        console.log(arr)
        if (newTicket.dateBuy != "" && newTicket.idAdminShowTime != -1 && newTicket.idUser != -1 && chairTicket.length != 0) {

            const result = await instance.get(`/getFilmTicket/${newTicket.idAdminShowTime}`)
            console.log(result.data.data)
            setTicketInfo(result.data.data)
            setOpenPayment("80vw")
        } else {
            setAlert("20vh")
            setContent("Please choose all fields")
        }
    }
    const [chairTicket, setChairTicket] = useState<number[]>([])
    const chooseChairTicket = (idChair: number, index: number) => {
        console.log(idChair)

        const a: any = document.getElementsByClassName('chair')
        if (a[index].style.color == 'orange') {
            a[index].style.color = 'white'
        } else {
            a[index].style.color = 'orange'
        }
        const arr = [...chairTicket]
        const check = arr.findIndex((item) => item == idChair)
        if (check != -1) {
            console.log(check)
            arr.splice(check, 1)
            console.log(arr)
            setChairTicket(arr)
            return
        }
        arr.push(idChair)
        setChairTicket(arr)
        console.log(arr)
    }
    const Payment = async () => {
        console.log(newTicket)
        const arr: any = []
        chairTicket.forEach((item) => {
            if (item > 20) {
                arr.push(price.priceDay + price.priceRoom + 30000)
            } else {
                arr.push(price.priceDay + price.priceRoom + 5000)
            }
        })
        const result = await instance.post("/bookingTicket", {
            newTicket: newTicket,
            chairTicket: chairTicket,
            price: arr
        })
        console.log(result.data.message)
        setNewTicket({
            idTicket: -1,
            idAdminShowTime: -1,
            idUser: -1,
            idChair: -1,
            dateBuy: "",
            price: ""
        })
        const a: any = document.getElementsByClassName('dayTicket')
        const b: any = document.getElementsByClassName('roomTicket')
        const c: any = document.getElementsByClassName('chair')
        const d: any = document.getElementsByClassName('showTimeTicket')
        for (let i = 0; i < 6; i++) {
            a[i].style.color = ' rgba(255, 166, 0, 0.2)'
        }
        for (let i = 0; i < b.length; i++) {
            b[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        for (let i = 0; i < c.length; i++) {
            c[i].style.color = 'white'
        }
        for (let i = 0; i < d.length; i++) {
            d[i].style.color = 'rgba(255, 166, 0, 0.2)'
        }
        setOpenChair("0vh")
        setChairTicket([])
        //  setCheckRoom([])
        //  setShowTimeTicket([])
        setContent("Payment success")
        setAlert("20vh")
        setOpenPayment("0vw")
    }
    const closePayment = () => {
        setOpenPayment("0vw")
    }
    const addComment = async (idFilm: number) => {
        console.log(comment)
        console.log(rate)
        console.log(user.idUser)
        console.log(idFilm)
        const result = await instance.post("/addComment", {
            comment: comment,
            rate: rate,
            idUser: user.idUser,
            idFilm: idFilm
        })
        setAllComment(result.data.data)
        setRate(0)
        setComment("")
    }
    useEffect(() => {
        setTimeout(() => {
            setAlert("0px")
            setContent("")
        }, 1500)
    }, [alert])
    return (
        <>
            <div className="Film">
                <NavFilm />
                
                <div className="Store__render">

                    <div className="Store__render--slide">
                        <div className="container">
                            {/* <div style={{position:"absolute",left:"100px",top:"10px",zIndex:"100",color:"white",padding:"10px",backgroundColor:"rgba(0,0,0,0.6)",borderRadius:"10px"}}>
                <h1>Movies Comming Soon</h1>
              </div> */}
                            <div id="slide">
                                {
                                    filmComing.map((item, index) => {
                                        return <div
                                            className="item"
                                            style={{

                                                backgroundImage: item ? `url(${item.imageFilm})` : "url()",
                                            }}
                                        >
                                            <div className="content">
                                                <div className="name">{item.nameFilm}</div>
                                                <div style={{ color: "orange" }}>{item.releaseDate ? new Date(item.releaseDate).toUTCString().slice(0, 16) : ""}</div>
                                                <div className="desa">
                                                    {item.detailFilm}
                                                </div>
                                                <button onClick={() => openDetaila(0, item.idFilm)}>See more</button>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            <div className="buttons">
                                <button id="prev" onClick={pre}>
                                    <GrFormPrevious></GrFormPrevious>
                                </button>
                                <button id="next" onClick={next}>
                                    <GrFormNext></GrFormNext>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: "relative", left: "20vw", zIndex: "100", color: "white", padding: "20px", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "10px" }}>
                        <h2>Now Showing</h2>
                    </div>
                    <div className="Store__render--list">
                        {
                            filmNowShowing.map((item, index) => {
                                return <div key={index} className="listRender" onClick={() => openDetaila(0, item.idFilm)}>
                                    <div style={{ overflow: "hidden", borderRadius: "10px 10px 0 0", width: "280px", height: "320px" }}>
                                        <img src={item.imageFilm} alt="" width={280} height={320} style={{ borderRadius: "10px 10px 0 0" }} />
                                    </div>
                                    <div className="contentFilm">
                                        <h5 style={{ color: "brown" }}>{item.nameFilm}</h5>
                                        <p><span style={{ color: "orange" }}>Duration :</span> {item.duration} h </p>
                                        <p><span style={{ color: "orange" }}>Category :</span>{categoryForFilms.map((itema:any) => {
                                            if (itema.films.idFilm == item.idFilm) {
                                                return <span> {itema.category.name}, </span>
                                            }
                                        })}</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className="Store__detail" style={{ height: openDetail }}>
                    <div style={{ display: "flex", padding: "4rem", width: "100%", height: "60vh" }}>
                        <div style={{ width: "55%", height: "100%" }}>
                            <h1 style={{  width: "100%", height: "5vw" }}>{filmDetail.nameFilm}</h1>
                            {/* <p>{product.productDetail}</p> */}
                            <div style={{ margin: "0.5rem",paddingLeft:"10px" }}>
                                <img src={filmDetail?.imageFilm} alt="" width={120} />
                                {/* <video src={filmDetail?.trailer} controls style={{ width: "50%" }}></video> */}
                            </div>
                            <Rate
                                disabled
                                defaultValue={5}
                                value={5}
                                style={{ paddingRight: "10px" }}
                            />

                            <p>
                                Release Date :
                                <span style={{ color: "orange" }}>  {filmDetail.releaseDate ? new Date(filmDetail.releaseDate).toUTCString().slice(0, 16) : ""} </span>
                            </p>
                            {
                                filmDetail.releaseDate ? new Date(filmDetail.releaseDate).toISOString().split("T")[0].split("-").join("") <= timeNow ? <button className="button__detail" onClick={() => buyTicket(filmDetail.idFilm)} >BUY TICKET <FaCartPlus></FaCartPlus></button> : <h5 style={{ color: "silver" }}>Comming soon ...</h5> : ""
                            }

                        </div>
                        <div style={{ width: "500px" }}>
                            <div style={{ width: "100%", height: "100%" }}>
                                <h2 style={{color:"brown",marginBottom:"2rem"}}>Trailer</h2>
                                {/* <p>Date : {filmDetail.date}</p> */}
                                <video src={filmDetail?.trailer} controls style={{ width: "68%" }}></video>
                                <p style={{ fontSize:"0.8rem",textOverflow:"ellipsis",overflow:"hidden",WebkitLineClamp:"3",WebkitBoxOrient:"vertical",height:"100px"}}>{filmDetail.detailFilm}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        width: "100%", backgroundColor: "black",
                        height: "36vh", padding: "1rem 3rem",
                        display: "grid",
                        gridTemplateColumns: "50% 50%",
                        // gap: "1rem"


                    }}>
                        {/* <div>
              <h3>Infomation</h3>
              <p>Date : {filmDetail.date}</p>
              <p>{filmDetail.detailFilm}</p>
              </div> */}
                        <div>
                            <h3>Comment</h3>
                            <p>Rate : <Rate allowHalf  onChange={(e:any) => setRate(e)}/> </p>
                            <textarea name="" id="" cols={46} rows={4} style={{
                                backgroundColor: "transparent",
                                color: "white"
                            }} onChange={(e:any) => setComment(e.target.value)}></textarea>
                            <button className="button__detail btn" onClick={() => addComment(filmDetail.idFilm)}>Sumbit</button>
                        </div>
                        <div style={{ overflowY: "scroll" }}>

                            {
                                allComment.map((item: any, index: number) => {
                                    if (item.users.idUser == user.idUser && item.films.idFilm == filmDetail.idFilm) {
                                        return <div style={{ border: "1px solid white", padding: "0.5rem", borderRadius: "10px", fontSize: "0.6rem", marginBottom: "0.2rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <h4 style={{ color: "orange", fontSize: "0.8rem" }}>{item.users.nameUser}</h4>
                                                <p style={{ color: "oranged" }}>Rate : <Rate value={item.rate} style={{ fontSize: "0.8rem" }} /></p>
                                            </div>
                                            <p style={{ marginTop: "0.5rem" }}>{item.comment}</p>
                                            <p style={{ textAlign: "right", marginTop: "0.5rem" }}>12/12/2021 </p>
                                        </div>
                                    }

                                })
                            }

                        </div>

                    </div>

                    <div style={{
                        width: "100%", backgroundColor: "rgba(255, 0, 0, 0.5)", color: "black",
                        textAlign: "center"
                    }}
                        onClick={closeDetial}
                    >
                        <IoIosArrowUp></IoIosArrowUp>
                    </div>
                </div>

                <div className="BuyTicket" style={{ height: openBuy, zIndex: "1" }}>
                    <p style={{ cursor: "pointer", paddingTop: "1rem" }} onClick={closeBooking}>close</p>
                    <h1 style={{ color: "brown" }}>{films[0]?.films.nameFilm}</h1>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        {
                            day.map((item, index) => {

                                return <p className="dayTicket" onClick={() => { checkShowTime(item, index) }}>
                                    {item ? item.slice(0, 12) : ""}
                                </p>

                            })
                        }
                    </div>
                    <h5>Choose Room</h5>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        {
                            checkRoom?.map((item: any, index: any) => {
                                if (item.room.idRoom > 1) {
                                    return <p className="dayTicket roomTicket" onClick={() => chooseRoom(item.room.idRoom, index)}>
                                        Room {item.room.nameRoom}
                                    </p>
                                } else {
                                    return <p className="dayTicket roomTicket" onClick={() => chooseRoom(item.room.idRoom, index)}>
                                        <i className="fa-solid fa-crown"></i>
                                        <span> Room {item.room.nameRoom}</span>
                                    </p>
                                }
                            })
                        }
                    </div>
                    <h5>Choose ShowTime</h5>
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        {
                            ShowTimeTicket?.map((item: any, index: any) => {
                                return <p className="dayTicket showTimeTicket" onClick={() => chooseShowTime(item.showtime.idTime, index)}> {item.showtime.showTimeAt}</p>
                            })
                        }
                    </div>
                    <div>
                        <button onClick={chooseChair} className="btn_ticket btn_ticket_pay">Choose Chair</button>
                    </div>
                    <div style={{ height: openChair, overflowY: "scroll", transition: "all 0.5s" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", width: "100%", gap: "0.5rem", height: "30vh" }}>
                            {
                                chair.map((item, index) => {
                                    if (index < 20) {
                                        return <div className="chair " ><i onClick={() => chooseChairTicket(item.idChair, index)} className="fa-solid fa-couch chair2" style={{ fontSize: "2rem" }}></i><p style={{ width: "45%", textAlign: "center", position: "absolute", zIndex: "5", bottom: "15px" }}>{item.nameChair}</p> </div>
                                    }
                                })
                            }
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ", width: "100%", gap: "0.5rem", height: "15vh" }}>
                            {
                                chair.map((item, index) => {
                                    if (19 < index && index < 25) {
                                        return <div className="chair " >
                                            {/* <i onClick={() => chooseChairTicket(item.idChair, index)} className="fa-solid fa-couch chair2" style={{ fontSize: "2rem" }}></i> */}
                                            {/* <i onClick={() => chooseChairTicket(item.idChair, index)} className="fa-solid fa-couch chair2" style={{ fontSize: "2rem" }}></i> */}
                                            <span className="chair2 material-symbols-outlined " onClick={() => chooseChairTicket(item.idChair, index)} style={{ fontSize: "3.5rem" }} >
                                                king_bed
                                            </span>
                                            <p style={{ width: "45%", textAlign: "center", position: "absolute", zIndex: "5", bottom: "20px" }}>{item.nameChair}</p>
                                        </div>
                                    }
                                })
                            }
                        </div>
                    </div>


                    <div>
                        <button className="btn_ticket_pay" onClick={bookingTicket}>Booking Ticket</button>
                    </div>
                    {/* payment */}

                    <div className="payment" style={{ width: openPayment }}>
                        <div className="close" onClick={closePayment}>X</div>
                        <div>
                            <h1>TICKET BILL</h1>
                        </div>
                        <div>
                            <div style={{ margin: "1rem" }}>
                                <p>User: {user.nameUser} </p>
                                <p>Email:{user.email} </p>
                                <p>Date Buy : {newTicket.dateBuy}</p>
                            </div>
                            <table >
                                <thead>
                                    <th>STT</th>
                                    <th>Movie</th>
                                    <th>Chair-Room</th>
                                    <th>Time</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                </thead>
                                <tbody>
                                    {
                                        chairTicket.map((item: any, index) => {
                                            return <tr>
                                                <td>{index + 1}</td>
                                                <td>{films[0]?.films.nameFilm}</td>
                                                <td>{item-4}-{ticketInfo?.room?.nameRoom}</td>
                                                <td>{ticketInfo?.showtime?.showTimeAt}</td>
                                                <td>{ticketInfo?.date_show}</td>
                                                <td>{item > 20 ? (price.priceDay + price.priceRoom + 30000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : (price.priceDay + price.priceRoom + 5000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                            </tr>
                                        })
                                    }
                                    <tr style={{ fontWeight: "bold" }}><td colSpan={5}>Total</td>
                                        <td>{chairTicket.reduce((a, b) => { return a + (b > 20 ? (price.priceDay + price.priceRoom + 30000) : (price.priceDay + price.priceRoom + 5000)) }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td></tr>
                                </tbody>

                            </table>
                        </div>
                        <div style={{ margin: "1rem", }}>
                            <button style={{ border: "none", backgroundColor: "brown", color: "white", padding: "0.5rem 2rem" }} onClick={Payment}>Payment</button>
                        </div>
                    </div>


                </div>

                <div className="Alert__store" style={{ height: alert }}>
                    <p>{content}</p>
                </div>
            </div>
        </>
    )
}
