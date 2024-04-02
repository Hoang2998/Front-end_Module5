import React, { useEffect, useState } from 'react'
import NavFilm from '../../../components/NavFilm/NavFilm'
import './FriceTicket.scss'
import instance from '../../../utils/axios/axiosPublic'
interface price{
    idPrice:number;
    namePrice:string;
    price:number;
}
export default function FriceTicket() {
const [priceTicket,setPriceTicket] = useState<price[]>([])
    useEffect(() => {
        const result = instance.get("getPrice")
        result.then((res)=>{
            console.log(res.data.data)
            setPriceTicket(res.data.data)})
    },[])
  return (
    <>
    <NavFilm />
    <div className="Cart">
        <div className="Cart__render">
          <table className="Cart__render--table">
            <thead>
              <th>Stt</th>
              <th>Name event </th>
              <th>Price</th>
            </thead>
            <tbody>
              {
                priceTicket.map((item,index)=>{
                    return <tr>
                        <td>{index+1}</td>
                        <td>{item.namePrice}</td>
                        <td><span>Phụ phí</span> {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                })
              }
            </tbody>
          </table>
          <div style={{color:"white",padding:"2rem"}}>
             <h2>Chú Thích:</h2>
             <h3>Giá vé = ( 1 hoặc 2 ) + ( 3 hoặc 4 ) + ( 5 hoặc 6 )</h3>
        </div>
        </div>
        
      </div>
    </>
  )
}
