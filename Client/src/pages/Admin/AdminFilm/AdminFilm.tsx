import React, { useEffect, useRef, useState } from 'react'
import "./AdminFilm.scss";
import NavAdminn from '../../../components/NavAmin/NavAmin'
// import { useSelector, useDispatch } from "react-redux";
// import api from "../../../service/apis/api.user";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GrPrevious, GrNext } from "react-icons/gr";
// import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
// import { storage } from "../../../../config/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import { SiIconfinder } from "react-icons/si";
import instance from "../../../utils/axios/axiosPublic";
import privateAxios from "../../../utils/axios/privateAxios";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../config/firebase';
const token = localStorage.getItem("token") ||"";
interface film  {
    idFilm: number;
    nameFilm: string;
    releaseDate: string;
    duration: string;
    imageFilm: string;
    detailFilm: string;
    trailer: string;
    rate: number;
    categoryFilm?: string;
    name?: string;
    idCategory?: number;
    id?: number;
}
interface category  {
  name: string;
  idCategory: number;
  status: number;
}
interface products extends film{
  categoryFilm: string
}
  
export default function AdminFilm() {
    const uuid = () => {
        return Math.floor(Math.random() * 999999);
      };
      const [openfind, setOpenFind] = useState("35px");
      const closeIn: any = useRef("hidden");
    
      const [products, setProducts] = useState<film>({
        idFilm: -1,
        nameFilm:"",
        releaseDate: "",
        duration: "",
        imageFilm: "",
        detailFilm:"",
        trailer:"aaa",
        rate: 5,
      });
      const [productsRender, setproductsRender] = useState<film[]>([]);
      const [productsFind, setproductsFind] = useState<film[]>([]);
      const [productsPana, setproductsPana] = useState<film[]>([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPage, setTotalPage] = useState<number[]>([]);
      const [openAddNew, setOpenAddNew] = useState<string>("0vh");
      const [openEdit, setOpenEdit] = useState<string>("0vw");
      const [imageUpload, setImageUpload] = useState(null);
      const [urlImage, setUrlImage] = useState(null);
      const [urlImage2, setUrlImage2] = useState(null);
      const [category, setCategory] = useState<category[]>([]);
      const [categoryForFilms,setCategoryForFilms] = useState<film[]>([])
      const [categoryForFilmEdit,setCategoryForFilmEdit] = useState([])
      const [content, setContent] = useState("");
      const [alert, setAlert] = useState("0");
      // const [preview, setPreview] = useState(null);
      const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
      const [chosseCategory, setChosseCategory] = useState("Category");
      const [films, setFilms] = useState([]);
    
    
      const [newCategory,setNewCategory] = useState<number[]>([])
      // const [productsDetail,setproductsDetail]= useState([])
      const navigate = useNavigate();
      const changeColor = () => {
        for (let i = 0; i < Math.ceil(productsRender.length / 6); i++) {
        const a: any = document.getElementsByClassName("dot")[i];
          if (currentPage - 1 == i) {
            a.style.color = "red";
          } else {
            a.style.color = "white";
          }
        }
      };
      useEffect(() => {
          const users = privateAxios.get("account").then((res) => {
              if(res.data.data.role === 0){
                  navigate("/")
              }
          })
       
        const filmResult = instance.get("/films").then((res) => {
          // console.log(res.data.data)
          setFilms(res.data.data);
        });
        const categoryResult = instance.get("/getCategoryForFilms").then((res) => {
          console.log(res.data.data)
          setCategoryForFilms(res.data.data);
        })
        const category = instance.get("/category").then((res) => {
          console.log(res.data.data)
          setCategory(res.data.data);  
        })
      },[])

      useEffect(() => {
       
        let arr:film[] = [];
        let arr2:number[] = [];
        const currentPerPage = 5;
        const start = (currentPage - 1) * currentPerPage;
        let end = currentPage * currentPerPage;
        for (let i = 0; i < Math.ceil(films.length / currentPerPage); i++) {
          arr2.push(i);
        }
        setTotalPage(arr2);
        if (end > films.length) {
          end = films.length;
        }
        for (let i = start; i < end; i++) {
          arr.push(films[i]);
        }
        console.log(arr);
        setproductsPana(arr);
        for (let i = 0; i < Math.ceil(films.length / 6); i++) {
          if (document.getElementsByClassName("dot")[i]) {
            const a:any  = document.getElementsByClassName("dot")[i]; 
            if (currentPage - 1 == i) {
              a.style.color = "red";
            } else {
              a.style.color = "white";
            }
          }
        }
      }, [currentPage, films]);
      const nextPage = () => {
        if (currentPage >= totalPage.length) {
          setCurrentPage(1);
        } else {
          setCurrentPage(currentPage + 1);
        }
        changeColor();
      };
      const prePage = () => {
        if (currentPage < 2) {
          setCurrentPage(totalPage.length);
        } else {
          setCurrentPage(currentPage - 1);
        }
        changeColor();
      };
      const changeImage = (event:any) => {
        console.log(event.target.files[0])  
        setSelectedMedia(event.target.files[0]);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event:any) {
          console.log(event.target.result);
          setProducts({ ...products, imageFilm: event.target.result});
        };
        reader.readAsDataURL(file);
      };
    
      const changeValue = (e:React.ChangeEvent<HTMLInputElement>) => {
        let arr = { ...products };
        console.log(arr);
        setProducts({ ...products, [e.target.name]: e.target.value });
        console.log(products);
      };
      const changeValueCategory = (e:React.ChangeEvent<HTMLInputElement>) => {
        let arr = { ...products };
        // arr.category = e.target.value;
        console.log(arr);
        setProducts(arr);
      };
    
      const newCategoryforfilm = (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.value)
        // console.log(e.target.name)

        const arr:number[] = [...newCategory]
        const check = arr.findIndex((item:number)=> item == Number(e.target.value))
        if(check != -1){
          arr.splice(check,1)
          setNewCategory(arr)
          return
        }
        arr.push( Number(e.target.value))
        setNewCategory(arr)
        console.log(arr)
      }
    
      useEffect(() => {}, [alert]);
      const saveNewProduct = async () => {
        console.log(products);
        console.log(newCategory)
        if (
          products.nameFilm != "" &&
          products.duration != "" &&
          products.releaseDate != "" &&
          products.imageFilm != "" &&
          products.detailFilm != "" &&
          products.trailer != ""&&
          newCategory.length > 0
        ) {
          try {
            const formData:any = new FormData();
            formData.append("file", selectedMedia);
            formData.append("upload_preset", "project3");
            const [uploadMedia] = await Promise.all([
              axios.post(
                "https://api.cloudinary.com/v1_1/dcmrlgyyd/image/upload",
                formData
              ),
            ]);
            const media = uploadMedia.data.secure_url;
    
            console.log(media);
            const result = await privateAxios.post("/addFilm", {
              ...products,
              imageFilm: media,
              arr: newCategory
            });
            
           //lay dc idFilm de goi lenh vao tao category cho film dung cho nodejs

            // console.log(result.data.data[result.data.data.length-1].idFilm)
            // const result2 = await instance.post("/addCategoryForFilm", {
            //   idFilm: result.data.data[result.data.data.length-1].idFilm,
            //   arr: newCategory
            // })
            // console.log(result2.data.data2)
            // setFilms(result2.data.data2);
            // setCategoryForFilms(result2.data.data);

            //dùng bên nestjs
            const categoryResult = await instance.get("/getCategoryForFilms").then((res) => {
              // console.log(res.data.data)
              setCategoryForFilms(res.data.data);
            })
            setFilms(result.data.data);
            setContent(result.data.message);
            setAlert("200px");
            setTimeout(() => {
              setAlert("0");
            }, 1500);
            setProducts({
              idFilm: -1,
              nameFilm:"",
              releaseDate: "",
              duration: "",
              imageFilm: "",
              detailFilm:"",
              trailer:"",
              rate: 5,
            });
            setSelectedMedia(null);
            setNewCategory([])
            return;
          } catch (error:any) {
            setContent(error.response.data.message);
            setAlert("200px");
            setTimeout(() => {
              setAlert("0");
            }, 1500);
            return;
          }
        }
        setContent("Please fill in all fields");
        setAlert("200px");
        setTimeout(() => {
          setAlert("0");
        }, 1500);

      };
    
      const [idDelete, setIdDelete] = useState<number>(-1);
      const deleteItem = (id:number) => {
        setContent("Bạn muốn xóa sản phẩm này ?");
        setAlert("200px");
        setIdDelete(id);
      };
      const deleteItemCP = async () => {
        try {
          const result = await privateAxios.delete(`/deletefilm/${idDelete}`);
          setFilms(result.data.data);
        setIdDelete(-1);
        setAlert("0px");
        } catch (error:any) {
          setContent(error.response.data.message);
          setAlert("200px");
        }
        
      };
      const [idEdit, setIdEdit] = useState<number>(-1);
      const editItem = async (id:number) => {
        setIdEdit(id);
        setOpenEdit("80vw");
        // const result = await instance.get(`/getFilmUpdate/${id}`);
        // console.log(result.data.data[0][0]);
        // const result2 = await instance.get(`/getCategoryForFilmUpdate?idFilm=${id}`);
        // console.log(result2.data.data[0]);
        // let arr:number[] = []
        // result2.data.data[0].forEach((element:category) => {
        //   arr.push(element.idCategory)
        // });

        //nestjs
        const result = await instance.get(`/getFilmUpdate/${id}`);
        console.log(result.data.data);
        const arr:any = []
        result.data.data.categoryforfilms.forEach((element:any) => {
          arr.push(element.category.idCategory)
        })
        console.log(arr)
        setNewCategory(arr);
        
    
        // setCategoryForFilms(result2.data.data[0]);
        // console.log(result.data.data[0][0]);
        // setChosseCategory(result.data.data[0][0].name);
        setProducts({
          nameFilm: result.data.data.nameFilm,
          duration: result.data.data.duration,
          releaseDate: result.data.data.releaseDate,
          imageFilm: result.data.data.imageFilm,
          detailFilm: result.data.data.detailFilm,
          trailer: result.data.data.trailer,
          idFilm: result.data.data.idFilm,
          rate: 5
        });
      };
      const saveEditProduct = async () => {
        console.log(newCategory);
        console.log(products);
        if (
          products.nameFilm != "" &&
          products.duration != "" &&
          products.releaseDate != "" &&
          products.imageFilm != "" &&
          products.detailFilm != "" &&
          products.trailer != ""&&
          newCategory.length > 0
        ) {
          try {
            if(selectedMedia != null){
              const formData:any = new FormData();
              formData.append("file", selectedMedia);
              formData.append("upload_preset", "project3");
              const [uploadMedia] = await Promise.all([
              axios.post(
                "https://api.cloudinary.com/v1_1/dcmrlgyyd/image/upload",
                formData
              ),
            ]);
              const media = uploadMedia.data.secure_url;
              setProducts({ ...products, imageFilm: media });
              console.log(media);
            }
            console.log(products.idFilm);
            const result = await privateAxios.put(`/updateFilm/${products.idFilm}`, {
              ...products
            });
            const result3 = await instance.delete(`/deleteCategoryForFilm/${products.idFilm}`)
            console.log(result3.data.message)

          //   console.log(result.data.data[result.data.data.length-1].idFilm)
            const result2 = await instance.post("/addCategoryForFilm", {
              idFilm: products.idFilm,
              arr: newCategory
            })
            console.log(result.data.data)
            setCategoryForFilms(result2.data.data)
            setFilms(result.data.data);
            setContent(result2.data.message);
            setAlert("200px");
            setTimeout(() => {
              setAlert("0");
              setOpenEdit("0vw");
            }, 1500);
            setProducts({
              idFilm: -1,
              nameFilm:"",
              releaseDate: "",
              duration: "",
              imageFilm: "",
              detailFilm:"",
              trailer:"aaa",
              rate: 5,
            });
            setSelectedMedia(null);

            setNewCategory([])
            return;
          } catch (error:any) {
            setContent(error.response.data.message);
            setAlert("200px");
            setTimeout(() => {
              setAlert("0");
            }, 1500);
            return;
          }
        }
        setContent("Please fill in all fields");
        setAlert("200px");
        setTimeout(() => {
          setAlert("0");
        }, 1500);

      };
      const sortPriceDe = () => {
        const filmResult = instance.get("/sortASCFilms").then((res) => {
          // console.log(res.data.data)
          setFilms(res.data.data);
        });
      };
      const sortPriceIn = () => {
        const filmResult = instance.get("/sortDESCFilms").then((res) => {
          // console.log(res.data.data)
          setFilms(res.data.data);
        });
        // let arr = [...productsRender];
        // arr.sort((a, b) => a.price - b.price);
        // setproductsRender(arr);
      };
      const openfinda = () => {
        closeIn.current = "visible";
        setOpenFind("250px");
      };
      const closefinda = () => {
        closeIn.current = "hidden";
        setOpenFind("35px");
      };
    
      const changeValueFind = async(e:React.ChangeEvent<HTMLInputElement>) => {
        // clearTimeout(time);
        console.log(e.target.value);
        console.log(films);
        const find =  await instance.get(`/findFilm?nameFilm=${e.target.value}`)
        console.log(find.data.data)
        setFilms(find.data.data)
      }
        // const arr = [...films];
        // if(e.target.value){
        //   let arrFind = arr.filter((item:any) => {
        //     return (
        //       item.films.nameFilm.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1
        //     );
        //   });
        //   setFilms(arrFind);
        // }
        //   console.log(films);
        //   setFilms(films);
      
        // }
      let time:any = null;
      const debound = (arr:any, e:React.ChangeEvent<HTMLInputElement>) => {
        // let time:any = null;
          clearTimeout(time);
           time = setTimeout(() => {
          arr(e);
        }, 2000);
      };           
      const closeUpdate = () => {
        setOpenEdit("0vw");
        setProducts({
              idFilm: -1,
              nameFilm:"",
              releaseDate: "",
              duration: "",
              imageFilm: "",
              detailFilm:"",
              trailer:"aaa",
              rate: 5,
            });
            setSelectedMedia(null);
      }
      const [video, setVideo] = useState<any>("");
      const [videoTrailer, setVideoTrailer] = useState<string>("0");
      const handleAddVideo = (event:any) => {
        let file = event.target.files[0];
        console.log(file);
        console.log(storage);
        setVideoTrailer("600px");
        const imageRef = ref(storage, `video/${file.name}`);
          uploadBytes(imageRef, file).then((snapshot:any) => {
          getDownloadURL(snapshot.ref).then((url:any) => {
            if(url != null){
            setVideo(url);
            // setVideoTrailer("600px");
            }
          });
        });
      };
    const closeTrailer = ()=>{
      setProducts({ ...products, trailer: video });
      setVideo("")
      setVideoTrailer("0")
    }  
  return (
    <>
    <NavAdminn />
    <div
        style={{
          position: "absolute",
          width: "100vw",
          height: "35px",
          zIndex: "100",
        }}
      >
        <div className="admin__bar2__input" onClick={openfinda}>
          <input
            type="text"
            style={{ width: openfind }}
            className="admin__bar2--input"
            onChange={(e) => {
              debound(changeValueFind, e);
            }}
            placeholder="Tìm kiếm theo tên"
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
          className="admin__bar2__inputClose"
          onClick={closefinda}
        >
          X
        </div>

    </div>
      <div className="adminProduct">

        <div className="admin__Alert" style={{ height: alert }}>
          <p>{content}</p>
          {idDelete != -1 ? (
            <div>
              <button onClick={deleteItemCP}>OK</button>
              <button
                onClick={() => {
                  setAlert("0px");
                  setIdDelete(-1);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="adminProduct__render">

          <div className="adminProduct--addNew">
            <button
              onClick={() => {
                setOpenAddNew("85vh");
              }}
            >
              Add new Film +
            </button>
            <div
              className="admin__addNewProduct"
              style={{ height: openAddNew }}
            >
              <button
                onClick={() => {
                  setOpenAddNew("0vh");
                }}
              >
                close
              </button>
              <div style={{ display: "flex" }}>
                <table>
                  <tr>
                    <td>
                      <label htmlFor="">Name</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        onChange={changeValue}
                        name="nameFilm"
                        value={products.nameFilm}
                      />
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Category</label>
                    </td>
                    <td>

                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
                        {category?.map((item, index) => {
                          if (item.status == 1) {
                            return (
                              <div>
                                <input
                                  type="checkbox"
                                  // name={index}
                                  value={item.idCategory}
                                  onChange={newCategoryforfilm}
                                  // checked={true}                                 
                                />
                                {item.name}
                              </div>
                            );
                          }
                        })}
                      </div>

                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Duration</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        onChange={changeValue}
                        name="duration"
                        value={products.duration}
                      />
                      <br />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="">Date</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="date"
                        onChange={changeValue}
                        name="releaseDate"
                        value={products.releaseDate}
                      />
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Film Detail</label>
                    </td>
                    <td>
                      <input  type="text" onChange={changeValue} name="detailFilm" value={products.detailFilm}></input>
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Image</label>
                    </td>
                    <td>
                      <input type="file" onChange={changeImage} />
                      {/* <button onClick={handleAdd}> Add Img </button> */}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Trailer</label>
                    </td>
                    <td>
                      <input
                        type="file"
                        onChange={handleAddVideo}
                        name="trailer"
                        placeholder="link url"
                        // value={products.trailer}
                      />
                      {/* <button onClick={handleAdd}> Add Img </button> */}
                    </td>
                  </tr>
                </table>
                
                <div>
                  <div>
                    <h5>Poster</h5>
                    <div
                      style={{
                        width: "200px",
                        height: "280px",
                        border: "1px solid brown",
                        margin: "1rem",
                      }}
                    >
                      <img src={products.imageFilm} alt="" width={200} height={280} />
                    </div>
                  </div>
                  <div className="trailer" style={{height:videoTrailer}} >
                    {
                      video == "" ? <><div className="loader">
                      <div className="dotLoanding"></div>
                      <div className="dotLoanding"></div>
                      <div className="dotLoanding"></div> 
                    </div></> :<><video src={video} controls width={850}></video>
                      <button onClick={closeTrailer}>Add Trailer</button>
                      </> 
                    }
                  </div>
                  <div>
                    <button
                      style={{ border: "1px solid brown" }}
                      onClick={saveNewProduct}
                    >
                      Save New Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="adminProduct--addNew">
            {/* <button onClick={()=>{setOpenAddNew("75vh")}}>Add new product +</button> */}
            <div className="admin__addNewProduct" style={{ width: openEdit }}>
              <button
                onClick={
                  closeUpdate
                }
              >
                close
              </button>
              <div style={{ display: "flex" }}>
                <table>
                  <tr>
                    <td>
                      <label htmlFor="">Name</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        onChange={changeValue}
                        name="nameFilm"
                        value={products.nameFilm}
                      />
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Category</label>
                    </td>
                    <td>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
                        {category?.map((item, index) => {
                          // <p style={{color:"red",zIndex:"100"}}>a</p>
                          if (item.status == 1) {
                            return (
                              <div>
                                <input
                                  type="checkbox"
                                  // name={index}
                                  value={item.idCategory}
                                  onChange={newCategoryforfilm}
                                  checked={newCategory.findIndex(ite=>ite==item.idCategory)== -1 ?false:true}
                                />
                                {item.name}
                              </div>       
                            );
                          }
                        })}
                      </div>
                    
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Duration</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        onChange={changeValue}
                        name="duration"
                        value={products.duration}
                      />
                      <br />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="">Date</label>
                    </td>
                    <td>
                      {" "}
                      <input
                        type="date"
                        onChange={changeValue}
                        name="releaseDate"
                        value={products.releaseDate}
                      />
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Film Detail</label>
                    </td>
                    <td>
                      <input  type="text" onChange={changeValue} name="detailFilm" value={products.detailFilm}
                      ></input>
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Image</label>
                    </td>
                    <td>
                      <input type="file" onChange={changeImage} />
                      {/* <button onClick={handleAdd}> Add Img </button> */}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="">Trailer</label>
                    </td>
                    <td>
                      <input
                        type="file"
                        onChange={handleAddVideo}
                        name="trailer"
                        placeholder="link url"
                        // value={products.trailer}
                      />
                      {/* <button onClick={handleAdd}> Add Img </button> */}
                    </td>
                  </tr>
                </table>
                <div className="trailer" style={{height:videoTrailer}} >
                {
                      video == "" ? <><div className="loader">
                      <div className="dotLoanding"></div>
                      <div className="dotLoanding"></div>
                      <div className="dotLoanding"></div> 
                    </div></> :<><video src={video} controls width={850}></video>
                      <button onClick={closeTrailer}>Add Trailer</button>
                      </> 
                    }
                  </div>
                <div>
                  <div>
                    <h5>Poster</h5>
                    <div
                      style={{
                        width: "200px",
                        height: "280px",
                        border: "1px solid brown",
                        margin: "1rem",
                      }}
                    >
                      <img src={products.imageFilm} alt="" width={200} height={280} />
                    </div>
                  </div>
                  <div>
                    <button
                      style={{ border: "1px solid brown" }}
                      onClick={saveEditProduct}
                    >
                      Save Edit Film
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <table>
            <thead>
              <th>Stt</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>
                Release Date
                <button
                  onClick={sortPriceIn}
                  style={{
                    width: "1rem",
                    height: "1rem",
                    padding: "0px",
                    borderRadius: "50%",
                  }}
                >
                  <HiArrowCircleDown />
                </button> 
                <button
                  onClick={sortPriceDe}
                  style={{
                    width: "1rem",
                    height: "1rem",
                    padding: "0px",
                    borderRadius: "100%",
                  }}
                >
                  <HiArrowCircleUp />
                </button>{" "}
              </th>
              <th>Duration</th>
              <th>Action</th>
            </thead>
            <tbody>
              {productsPana?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={item?.imageFilm} alt="" width={60} />
                    </td>
                    <td>{item?.nameFilm}</td>
                    <td>
                      {
                        categoryForFilms.map((itema:any)=>{
                          if(itema.films.idFilm == item.idFilm ){
                            return <span> {itema.category.name}, </span> 
                          }
                        })
                      }
                    </td>
                    <td>{item?.releaseDate}</td>
                    <td>{item?.duration}</td>
                    <td>
                      <button onClick={() => editItem(item.idFilm)}>
                        <FaEdit></FaEdit>
                      </button>
                      <button onClick={() => deleteItem(item.idFilm)}>
                        <MdDelete></MdDelete>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="adminProduct--pana">
            <GrPrevious onClick={prePage}></GrPrevious>
            {totalPage?.map((item) => {
              return (
                <div
                  className="dot"
                  onClick={() => {
                    setCurrentPage(item + 1);
                    changeColor();
                  }}
                >
                  {item + 1}
                </div>
              );
            })}
            <GrNext onClick={nextPage}></GrNext>
          </div>

        </div>
      </div>
    </>
  )
}
