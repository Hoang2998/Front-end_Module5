import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from "axios"
import * as CryptoAES from 'crypto-js/aes';
import * as CryptoJS from 'crypto-js';
import './Register.scss'
import instance from '../../../utils/axios/axiosPublic';
import { useInView } from '@react-spring/three';

type user = {
    nameUser: string
    email: string
    passwords: string
    comfirmPassword: string
}
type User = {
    nameUser: string
    email: string
    passwords: string
    active: number
    role: number
    id: number
}

export default function Register() {
    const [users, setUsers] = useState<User[]>([]);
    const [alertEmail, setAlertEmail] = useState<string>("");
    const [alertPassword, setAlertPassword] = useState<string>("");
    const [alertCPassword, setAlertCPassword] = useState<string>("");
    const [status, setStatus] = useState<boolean|string>(false);
    const [statusFalse, setStatusFalse] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<user>({
        nameUser: "",
        email: "",
        passwords: "",
        comfirmPassword: "",
    });

    useEffect(() => {
        const result = instance.get("getUser")
        .then((res) => {
            setUsers(res.data.data)  
        })
        ;
    }, []);
    
    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        console.log(newUser);
    };
    const createUser = async () => {
        if (
            newUser.email != "" &&
            newUser.passwords != "" &&
            newUser.nameUser != "" &&
            newUser.comfirmPassword != ""
        ) {
            let resultEmail = newUser.email.match(
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
            );
            let checkEmail = users.findIndex((item) => item.email == newUser.email);
            if (resultEmail == null) {
                // console.log("11111");
                setAlertEmail("Email cuả bạn không đúng định dạng!");
            } else if (checkEmail != -1) {
                // console.log("22222");
                setAlertEmail("Email cuả bạn đã tồn tại!");
            } else {
                setAlertEmail("");
            }
            let resultPassword = newUser.passwords.match(/^\d{8,50}$/);
            if (resultPassword == null) {
                // console.log("33333");

                setAlertPassword("Mật khẩu của bạn ko đúng định dạng");
            } else {
                setAlertPassword("");
            }
            if (newUser.comfirmPassword != newUser.passwords) {
                setAlertCPassword("Mời xác nhận lại mật khẩu!");
            } else {
                setAlertCPassword("");
            }
            if (
                resultEmail != null &&
                checkEmail == -1 &&
                resultPassword != null &&
                newUser.comfirmPassword == newUser.passwords
            ) {
                // const hashedPassword = await bcrypt.hash(newUser.password,10);
                //  console.log(newUser.nameuser)
                try {
                    await instance.post("/addUser", {
                        email: newUser.email,
                        passwords: newUser.passwords,
                        nameUser: newUser.nameUser,
                    })
                    setStatus("Đăng ký thành công !");
                    setTimeout(() => {
                        setNewUser({
                            nameUser: "", 
                            email: "",
                            passwords: "",
                            comfirmPassword: "",
                        })
                        setStatus(false);
                    }, 2000);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            setStatus("Bạn chưa điền đủ thông tin mời nhập đủ !");
            setTimeout(() => {
                setStatus(false);
            }, 2000);
        }
    };

    const [statusP, setStatusP] = useState<boolean>(false);
    const statusPassWord = () => {
        if (statusP == true) {
            setStatusP(false);
        } else {
            setStatusP(true);
        }
    };
    const [statusCP, setStatusCP] = useState<boolean>(false);
    const statusCPassWord = () => {
        if (statusCP == true) {
            setStatusCP(false);
        } else {
            setStatusCP(true);
        }
    };
    return (
        <><section className="section1">
            {/* <video autoPlay muted loop className="myVideo2">
                <source src={"./public/videos/bg_login2.mp4"} type="video/mp4" />
            </video> */}
              <img src="./public/images/bg_film.jpg" alt="" className="myVideo2"/>
            {status ? <div className="alertRegister" style={{ color: status == "Đăng ký thành công !"? "green":"red" }}>{status}</div> : ""}

            <div className="form-box">
                <div className="form-value">
                    <div >
                        <h2>Register</h2>
                        <div className="inputbox">
                            <input
                                onChange={changeValue}
                                type="text"
                                
                                name="nameUser"
                                value={newUser.nameUser}
                            />
                            <label htmlFor="">Name User</label>
                        </div>
                        <div className="inputbox">
                            <input
                                onChange={changeValue}
                                type="email"
                                
                                name="email"
                                value={newUser.email}
                            />
                            <label htmlFor="">Email</label>
                        </div>
                        <p style={{ fontSize: "0.5rem", color: "red", margin: "0" }}>
                            {alertEmail}
                        </p>
                        <div className="inputbox">
                            <input
                                onChange={changeValue}
                                type={statusP ? "text" : "password"}
                                
                                name="passwords"
                                value={newUser.passwords}
                            />
                            <label htmlFor="">Password</label>
                            {statusP ? (
                                <FaRegEye
                                    onClick={statusPassWord}
                                    style={{
                                        color: "white",
                                        position: "absolute",
                                        bottom: "0.5rem",
                                        right: "1rem",
                                    }}
                                ></FaRegEye>
                            ) : (
                                <FaRegEyeSlash
                                    onClick={statusPassWord}
                                    style={{
                                        color: "white",
                                        position: "absolute",
                                        bottom: "0.5rem",
                                        right: "1rem",
                                    }}
                                />
                            )}
                        </div>
                        <p style={{ fontSize: "0.5rem", color: "red", margin: "0" }}>
                            {alertPassword}
                        </p>

                        <div className="inputbox">
                            <input
                                onChange={changeValue}
                                type={statusCP ? "text" : "password"}
                            
                                name="comfirmPassword"
                                value={newUser.comfirmPassword}
                            // className={alertCPassword}
                            />
                            <label htmlFor="">Comfirm Password</label>
                            {statusCP ? (
                                <FaRegEye
                                    onClick={statusCPassWord}
                                    style={{
                                        color: "white",
                                        position: "absolute",
                                        bottom: "0.5rem",
                                        right: "1rem",
                                    }}
                                ></FaRegEye>
                            ) : (
                                <FaRegEyeSlash
                                    onClick={statusCPassWord}
                                    style={{
                                        color: "white",
                                        position: "absolute",
                                        bottom: "0.5rem",
                                        right: "1rem",
                                    }}
                                />
                            )}
                        </div>
                        <p
                            style={{
                                fontSize: "0.5rem",
                                color: "red",
                                margin: "0 0 1rem 0",
                            }}
                        >
                            {alertCPassword}
                        </p>

                        <div className="forget"></div>
                        <div style={{ position: "relative" }} className="login__btn">
                            <div className="login--btn1"></div>
                            <div className="login--btn2"></div>
                            <div className="login--btn3"></div>
                            <div className="login--btn4"></div>
                            <button className="logIn-btn" onClick={createUser}>
                                Create Account
                            </button>
                        </div>
                        <div className="register">
                            <Link
                                to="/Login"
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                    fontSize: "1rem",
                                }}
                            >
                                <p>
                                    <a>Login</a>
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

