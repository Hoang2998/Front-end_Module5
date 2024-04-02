import React, { useEffect, useState } from 'react'
import './NavFilm.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import privateAxios from '../../utils/axios/privateAxios'
export default function NavFilm() {
    type user = {
        name?: string
        avatar?: string
        passwords?: string
        email?: string
        phoneNumber?: number
        role?: number
        idUser?: number
    }
    // const [openfind, setOpenFind] = useState("35px");
    //   const closeIn = useRef("hidden");
    const [currentUser, setCurrentUser] = useState<user>({});
    //   const [products, setProducts] = useState("");
    //   const data = useSelector((state) => state.accountReducer);
    //   const dispatch = useDispatch();
    const navigate = useNavigate()
    const [content, setContent] = useState("abc")
    const [alert, setAlert] = useState("-500px")
    const [tab, setTab] = useState("0%")
    //   const [openUpdatePs , setOpenUpdatePs] = useState("0px")
    //   const carta  = useSelector((data) => data.accountReducer.account);
    //   const [nameUser,setNameUser] = useState("abc")
    const token = localStorage.getItem("token") || ""
    useEffect(() => {
        if (token != "") {
            const result = privateAxios.get("account")
                .then(res => setCurrentUser(res.data.data))
        } else {
            setCurrentUser({})
        }
    }, [])

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value })
        console.log(currentUser);

    }
    const changeName = () => {

    }
    useEffect(() => {
        setTimeout(() => {
            setAlert("-500px")
        }, 2000);
    }, [alert])
    //   const saveUser =()=>{
    //     let arr = {...currentUser}
    //     axios.put(`http://localhost:8008/Account/${arr.id}`,arr)
    //     setContent(" Save Accept")
    //     setAlert("80px")

    //   }
    const [newPassword, setNewPassword] = useState({
        password: "",
        newpassword: "",
        comfirmpassword: ""
    })
    const checkValuePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword({ ...newPassword, [e.target.name]: e.target.value })
        console.log(newPassword);
    }
    const closeTab = () => {
        setTab("0%")
    }
    const openTab = () => {
        setTab("38%")
    }
    const logOut = () => {
        localStorage.clear()
        navigate("/login")
    }
  return (
    <>
             <div className="Store__bar">

                <div className='nav__alert' style={{ bottom: alert }}>
                    <p>{content}</p>
                </div>

                <div className="phg">
                    <img
                        src="https://i.pinimg.com/originals/a0/26/1b/a0261b885cfba5a65c675c33327acf5a.png"
                        width={150}
                        alt=""
                    />
                </div>
                <ul className="ul">
                    <NavLink to={"/"} className="Store--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l1 fa-solid fa-house">
                            <p>
                                Home
                            </p>
                        </li>
                    </NavLink>

                    <NavLink to={"/film"} className="Store--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l2 fa-solid fa-shop">
                            <p>
                                Movies
                            </p>
                        </li>
                    </NavLink>
                    {/* <NavLink to={"/category"} className="Store--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l3 fa-solid fa-cube">
                            <p>
                                Movies Schedule
                            </p>
                        </li>
                    </NavLink> */}
                    <NavLink to={"/ticket"} className="Store--link">
                        <li className="l4 fa-solid fa-cart-shopping" style={{ fontSize: "0.9rem" }}>
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                                Ticket Prices
                            </p>
                        </li>
                    </NavLink>
                    <NavLink to={"/myticket"} className="Store--link">
                        <li className="l5 fa-solid fa-money-bill" style={{ fontSize: "0.9rem" }}>
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                                My Ticket
                            </p>
                        </li>
                    </NavLink>
                    <NavLink to={"/myWebTicket"} className="Store--link">
                        <li className="l6 fa-solid fa-money-bill" style={{ fontSize: "0.9rem" }}>
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                                Web Ticket
                            </p>
                        </li>
                    </NavLink>
                    <NavLink to={"/login"}>
                        <li
                        className="l7 fa-solid fa-arrow-right-from-bracket"
                        style={{ fontSize: "0.9rem" }}
                        onClick={logOut}
                        >
                            <p>
                                {token ? "Log out" : "Log in"}
                            </p>
                    </li> 
                    </NavLink>
                    <div className="l8"></div>
                </ul>
            </div>
        
        </>
  )
}
