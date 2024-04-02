import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss'
import instance from '../../../utils/axios/axiosPublic';
type user = {
    email: string,
    passwords: string
}
export default function Login(props: any) {
    console.log(props.socket)
    const [status, setStatus] = useState<boolean|string>(false);
    const [account,setAccount] = useState<user>({
      email:"",
      passwords:""
    })
    const navigate = useNavigate()
    const changeValue = (e:React.ChangeEvent<HTMLInputElement>) =>{
      const {name,value} = e.target
      setAccount({...account,[name]:value})
    }
    const login = async()=>{
        try {
          const result = await instance.post('/login',account)
            setStatus(result.data.message)
            console.log(result.data.data.token)
            localStorage.setItem("token",result.data.data.token)
            setTimeout(()=>{
              setStatus(false)
              console.log(result.data.user)
              result.data.data.user.role ? navigate("/Admin") : navigate("/")
            },1500)
        } catch (error:any) {
          console.log(error)
          setStatus(error.response.data.message)
          setTimeout(()=>{
            setStatus(false)
          },1500)
        }
        }
    return (
        <>
            <div>
                <section className='section1'>
                    {/* <video autoPlay muted loop className="myVideo2">
                        <source src={"./public/videos/bg_login2.mp4"} type="video/mp4" />
                    </video> */}
                    <img src="./public/images/bg_film.jpg" alt="" className="myVideo2"/>
                    {status ? <div className="alertRegister" style={{
                        color:status === 'login success' ? 'green' : 'red',
                    }}>{status}</div> : ""}

                    <div className="form-box">
                        <div className="form-value">
                            <div>
                                <h2>Login</h2>
                                <div className="inputbox">
                                    <input type="email" 
                                        onChange={changeValue}
                                        name='email'
                                        value={account.email}
                                    />
                                    <label htmlFor="">Email</label>
                                </div>
                                <div className="inputbox">
                                    <input type="password" 
                                        onChange={changeValue}
                                        name='passwords'
                                        value={account.passwords}
                                    />
                                    <label htmlFor="">Password</label>
                                </div>
                                <div className="forget">
                                    <label htmlFor="">
                                        <input type="checkbox" />
                                        Remember Me <a href="#">Forget Password</a>
                                    </label>
                                </div>
                                <div style={{ position: 'relative' }} className='login__btn'>
                                    <div className='login--btn1'></div>
                                    <div className='login--btn2'></div>
                                    <div className='login--btn3'></div>
                                    <div className='login--btn4'></div>
                                    <button className='logIn-btn' onClick={login} >Log in</button>
                                </div>
                                <div className="register">
                                    <Link to='/Register' style={{ textDecoration: "none" }}>
                                        <p >
                                            Don't have a account <a href="#">Register</a>
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}
