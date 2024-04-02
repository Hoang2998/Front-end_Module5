import React, { useEffect, useState, useRef } from 'react'
import './NavAdmin.scss'
import { NavLink, useNavigate, Outlet } from "react-router-dom";
// import apis from "../../../service/apis/api.user.js";
import { useSelector, useDispatch } from "react-redux";

import avatar from "../../../assets/images/sheep.png";
import { SiIconfinder } from "react-icons/si";
import axios from 'axios';

export default function NavAdminn() {
    const [openfind, setOpenFind] = useState<string>("35px");
    const closeIn = useRef("hidden");
    const [currentUser, setCurrentUser] = useState<string>("");
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log(token)
        setCurrentUser(token || "")
    }, [])
    // console.log(data);

    const openfinda = () => {
        closeIn.current = "visible";
        setOpenFind("250px");
    };
    const closefinda = () => {
        closeIn.current = "hidden";
        setOpenFind("35px");
    };

    const logOut = () => {
        localStorage.clear()
        navigate("/login")
    }
    return (
        <div>
            <div className="NavAmin__bar">

                <ul className="ul">
                    <NavLink to={"/Admin"} className="NavAmin--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l1 fa-solid fa-film"><p>Movie</p></li>
                    </NavLink>

                    <NavLink to={"/userAdmin"} className="NavAmin--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l2 fa-solid fa-user"><p>User</p></li>
                    </NavLink>
                    <NavLink to={"/categoryAdmin"} className="NavAmin--link" style={{ fontSize: "0.9rem" }}>
                        <li className="l3 fa-solid fa-book"><p>Category</p></li>
                    </NavLink>
                    <NavLink to={"/showtimeAdmin"} className="NavAmin--link">
                        <li className="l5  fa-solid fa-clapperboard" style={{ fontSize: "0.9rem" }}>
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                                Set Up Showtime
                            </p>
                        </li>
                    </NavLink>
                    <li
                        className="l6 fa-solid fa-arrow-right-from-bracket"
                        style={{ fontSize: "0.8rem" }}
                        onClick={logOut}
                    >
                        <p>
                            {currentUser ? "Log out" : "Log in"}
                        </p>
                    </li>
                    <div className="l7"></div>
                </ul>
            </div>

            <div className="NavAmin__bar2">
                <div style={{ position: "absolute", left: "8%" }}>
                    <img src={"../../assets/images/shark.png"} alt="" width={50} />
                </div>
                {/* <div className="NavAmin__bar2__input" onClick={openfinda}>
          <input
            type="text"
            style={{ width: openfind }}
            className="NavAmin__bar2--input"
          />
          <SiIconfinder
            style={{
              position: "absolute",
              right: "10px",
              top: "8px",
              color: "brown",
            }}
          ></SiIconfinder>
        </div>
        <div
          style={{ visibility: closeIn.current }}
          className="NavAmin__bar2__inputClose"
          onClick={closefinda}
        >
          X
        </div> */}

                <div className='btn__home'>
                    <button onClick={() => { navigate("/") }}>Home</button>
                </div>
            </div>
        </div>
    )
}
