import React, { useEffect, useState } from 'react'
import NavAdminn from '../../../components/NavAmin/NavAmin'
import "./AdminCategory.scss"
import instance from '../../../utils/axios/axiosPublic'
import privateAxios from '../../../utils/axios/privateAxios'

interface category {
    name: string;
    idCategory: number;
    status: number;
}
export default function AdminCategory() {
    const [categorys, setCategory] = useState<category[]>([])
    const [flag, setFlag] = useState(0)
    const uuid = () => {
        return Math.floor(Math.random() * 999999)
    }
    const [newCategory, setNewCategory] = useState({
        name: "",
        status: 1,
    })

    useEffect(() => {
        instance.get('/category').then((res) => {
            console.log(res.data.data)
            setCategory(res.data.data)
        })
    }, [])

    const addNewCategory = async () => {
        try {
            console.log(newCategory)
            if (newCategory.name != "") {
                const result = await privateAxios.post('/addCategory', newCategory)
                console.log(result.data.data)
                setCategory(result.data.data)
                setNewCategory({
                    name: "",
                    status: 1,
                })
            }
        } catch (error: any) {
            console.log(error)
        }

    }
    const changeStatus = async (idCategory: number, status: number) => {
        console.log(idCategory, status)
        const activea = status ? 0 : 1
        console.log(activea)
        const result = await instance.put('categoryActive',{active : activea,idCategory : idCategory})
        console.log(result.data.data)
        setCategory(result.data.data)
    }
    return (
        <>
            <NavAdminn />
            <div className='adminCategory'>
                <div className='adminCategory__render'>
                    <div>
                        <button onClick={addNewCategory}>Add New Category</button>
                        <input type="text" onChange={(e) => {
                            newCategory.name = e.target.value
                            setNewCategory({ ...newCategory, name: e.target.value })
                        }} value={newCategory.name} />
                        <table>
                            <thead>
                                <th>STT</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {
                                    categorys?.map((item, index) => {
                                        return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td style={{ color: item.status ? "green" : "red" }}>{item.status ? "Active" : "Block"}</td>
                                            {/* <td><button style={{ color: item.status ? "red" : "green" }} onClick={() => changeStatus(index, item.idCategory)}>{item.status ? "Block" : "Active"}</button></td> */}
                                            <td>
                                                <div className="content">
                                                    <label className="switch">
                                                        <input type="checkbox" checked={item?.status ? true : false} onClick={() => changeStatus(item.idCategory, item.status)} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
