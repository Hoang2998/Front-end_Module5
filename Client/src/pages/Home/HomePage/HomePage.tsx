import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Effects, OrbitControls, ScrollControls, useScroll } from '@react-three/drei'
import { useGLTF, Stage } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import gsap from "gsap";
import './HomePage.css'
import NavHome from '../../../components/NavHome/NavHome'

function Film(props: any) {
  const { nodes, materials } = useGLTF('./node/35mm_film_roll.glb')
  let node: any = nodes
  const camera = useThree(state => state.camera)
  const cameraRef: any = useRef()
  const scrollControl = useScroll()
  const timeline: any = useRef()
  useLayoutEffect(() => {
    timeline.current = gsap.timeline()
    timeline.current.to(
      cameraRef.current.rotation,
      {

        y: Math.PI * 1.5,

        duration: 0.5,
        onUpdate: () => { }
      },
      0.5
    )
    timeline.current.to(
      cameraRef.current.position,
      {
        x: 0.2,
        z: -0.1,
        duration: 0.5,
        onUpdate: () => { }
      },
      0.5
    )

    timeline.current.to(
      cameraRef.current.rotation,
      {

        y: -Math.PI * 2,

        duration: 1.5,
        onUpdate: () => { }
      },
      1
    )
    timeline.current.to(
      cameraRef.current.position,
      {
        x: -0.3,
        z: -0.1,
        duration: 1.5,
        onUpdate: () => { }
      },
      1
    )

    timeline.current.to(
      cameraRef.current.rotation,
      {

        y: Math.PI / 4,

        duration: 1,
        onUpdate: () => { }
      },
      2.5
    )
    timeline.current.to(
      cameraRef.current.position,
      {
        x: 0,
        z: -0.1,
        duration: 1,
        onUpdate: () => { }
      },
      2.5
    )
  })
  useFrame(() => {
    if (camera.position.z < 0.4) {
      camera.position.z += 0.01
    }
    camera.lookAt(0, 0, 0)
    timeline.current.seek(scrollControl.offset * timeline.current.duration())
    if (scrollControl.offset * timeline.current.duration() > 0) {
      const a: any = document.getElementsByClassName('title1')[0].classList.add("title1move")
      const b: any = document.getElementsByClassName('title1')[1].classList.add("title1move")
    }
    if (scrollControl.offset * timeline.current.duration() > 0.5) {
      const a: any = document.getElementsByClassName('title1')[0].classList.remove("title1move")
      const b: any = document.getElementsByClassName('title1')[1].classList.remove("title1move")
    }
    if (scrollControl.offset * timeline.current.duration() < 0.7) {
      const a: any = document.getElementsByClassName('title2')[0].classList.remove("title2move")
    }
    if (scrollControl.offset * timeline.current.duration() > 0.7) {
      const a: any = document.getElementsByClassName('title2')[0].classList.add("title2move")
    }
    if (scrollControl.offset * timeline.current.duration() > 0.8) {
      const a: any = document.getElementsByClassName('title2-p1')[0].classList.add("title2move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 0.85) {
      const a: any = document.getElementsByClassName('title2-p1')[1].classList.add("title2move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 0.9) {
      const a: any = document.getElementsByClassName('title2-p1')[2].classList.add("title2move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 1.2) {
      const a: any = document.getElementsByClassName('title2')[0].classList.remove("title2move")
      
    }
    if (scrollControl.offset * timeline.current.duration() < 2.2 ) {
      const a: any = document.getElementsByClassName('title3')[0].classList.remove("title3move")
    }
    if (scrollControl.offset * timeline.current.duration() > 2.2 ) {
      const a: any = document.getElementsByClassName('title3')[0].classList.add("title3move")
    }
    if (scrollControl.offset * timeline.current.duration() > 2.3) {
      const a: any = document.getElementsByClassName('title3-p1')[0].classList.add("title3move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 2.4) {
      const a: any = document.getElementsByClassName('title3-p1')[1].classList.add("title3move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 2.45) {
      const a: any = document.getElementsByClassName('title3-p1')[2].classList.add("title3move-p1")
    }
    if (scrollControl.offset * timeline.current.duration() > 2.6 ) {
      const a: any = document.getElementsByClassName('title3')[0].classList.remove("title3move")
      const c: any = document.getElementsByClassName('title1')[0].classList.add("title1move")
      const b: any = document.getElementsByClassName('title1')[1].classList.add("title1move")

    }
    // console.log(scrollControl.offset * timeline.current.duration())
  })
  return (
    <><group {...props} dispose={null} ref={cameraRef} >
      <group scale={0.01}>
        <mesh geometry={node['LP_roll_film_Material_#27_0'].geometry} material={materials.Material_27} rotation={[-Math.PI / 2, 0, 0]} />
      </group>

      <OrbitControls enableZoom={false} />
    </group>
    </>
  )
}
function Model(props: any) {
  const { nodes, materials } = useGLTF('./node/popcorn_bucket.glb')
  let node: any = nodes
  const camera = useThree(state => state.camera)
  const scene = useThree(state => state.scene)
  const { popcornRotation } = useSpring({
    from: {
      popcornRotation: 0
    },
    to: [{
      popcornRotation: -Math.PI / 2
    },
    {
      popcornRotation: -Math.PI
    },
    {
      popcornRotation: -1.5 * Math.PI
    },
    {
      popcornRotation: -2 * Math.PI
    }
    ],
    config: {
      mass: 5,
      tension: 500,
      friction: 80,
      duration: 5000
    },
    loop: true,
    immediate: true
  })
  const scrollControl = useScroll()
  const pop = useRef()
  useFrame(() => {
    camera.position.set(5, 0, 1)
  })
  return (
    <> <group {...props} dispose={null} ref={pop} position={[0, 0, 0]} >
      <animated.group rotation-y={popcornRotation} >
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh geometry={node.Object_2.geometry} material={materials['Material.001']} />
          <mesh geometry={node.Object_3.geometry} material={materials['Material.002']} />
          <mesh geometry={node.Object_4.geometry} material={materials['Material.003']} />
          <mesh geometry={node.Object_5.geometry} material={materials['Material.003']} />
          <mesh geometry={node.Object_6.geometry} material={materials['Material.003']} />
          <mesh geometry={node.Object_7.geometry} material={materials['Material.003']} />
        </group>
      </animated.group >
    </group>
      <OrbitControls enableZoom={false} />
    </>

  )
}
function Coca(props: any) {
  const { nodes, materials } = useGLTF('./node/coca-cola.glb')
  let node: any = nodes

  const { cocaRotation } = useSpring({
    from: {
      cocaRotation: 0
    },
    to: [{
      cocaRotation: -Math.PI / 2
    },
    {
      cocaRotation: -Math.PI
    },
    {
      cocaRotation: -1.5 * Math.PI
    },
    {
      cocaRotation: -2 * Math.PI
    }
    ],
    config: {
      mass: 5,
      tension: 500,
      friction: 80,
      duration: 5000
    },
    loop: true,
    immediate: true
  })
  return (
    <group {...props} dispose={null} position={[1.5, 0, 1]}>
      <animated.group rotation-y={cocaRotation}>
        <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={node.defaultMaterial.geometry} material={materials.Can_Brand} />
            <mesh geometry={node.defaultMaterial_1.geometry} material={materials.Can_Metal} />
          </group>
        </group>
      </animated.group>
    </group>
  )
}
function Camera(props: any) {
  const { nodes, materials } = useGLTF('./node/cinema_camera.glb')
  let node: any = nodes
  const camera = useThree((state) => state.camera)
  const cameraRef: any = useRef()
  const scrollControl = useScroll()
  const timeline: any = useRef()
  useLayoutEffect(() => {
    timeline.current = gsap.timeline()
    timeline.current.to(
      cameraRef.current.position,
      {
        x: 3,
        duration: 1,
        onUpdate: () => { }
      },
      0
    )
    timeline.current.to(
      cameraRef.current.position,
      {
        x: 6,
        y: -3,
        duration: 1,
        onUpdate: () => { }
      },
      1
    )
    timeline.current.to(
      cameraRef.current.position,
      {
        x: 6,
        y: -3,
        z: 2,
        duration: 1,
        onUpdate: () => { }
      },
      2
    )

  })
  console.log(camera.position.z)

  // camera.zoom = 6

  useFrame(() => {
    camera.position.x = 0
    camera.position.y = 0
    if (camera.position.z > 5) {
      camera.position.z -= 0.5
    }
    timeline.current.seek(scrollControl.offset * timeline.current.duration())
    let a: any = document.getElementsByClassName('bg2')[0]
    let b: any = document.getElementsByClassName('movie')[0]
    let c: any = document.getElementById('sound')
    if (scrollControl.offset * timeline.current.duration() >= 1.5) {
      // console.log(scrollControl.offset * timeline.current.duration())
      a.style.backgroundSize = '140% 140%'
      a.style.backgroundPosition = '-250px'
    }
    if (scrollControl.offset * timeline.current.duration() >= 2.2) {
      b.style.opacity = '1'
      c.muted = false
    }
    if (scrollControl.offset * timeline.current.duration() < 1.5) {
      a.style.backgroundSize = '100% 100%'
      a.style.backgroundPosition = '0px'
    }
    if (scrollControl.offset * timeline.current.duration() <= 2.2) {
      b.style.opacity = '0'
      c.muted = true
    }

  })
  return (
    <> <group {...props} dispose={null}>
      <group rotation={[Math.PI, 0, Math.PI]} scale={1.5} ref={cameraRef}>
        <group  >
          <mesh geometry={node.Object_4.geometry} material={materials.ground} position={[0, -0.024, 0]} />
          <mesh geometry={node.Object_6.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_8.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_10.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_12.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_14.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_16.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_18.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_20.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_22.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_24.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_26.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_28.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_30.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_32.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_34.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_36.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_38.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_40.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_42.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_44.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_46.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_48.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_50.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_52.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_54.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_56.geometry} material={materials.camera_body} />
          <mesh geometry={node.Object_58.geometry} material={materials.camera_case} />
          <mesh geometry={node.Object_60.geometry} material={materials.camera_case} />
          <mesh geometry={node.Object_62.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_64.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_66.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_68.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_70.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_72.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_74.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_76.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_78.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_80.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_82.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_84.geometry} material={materials.camera_lense} />
          <mesh geometry={node.Object_86.geometry} material={materials.camera_lense} />
        </group>
      </group>
    </group>
      <OrbitControls enableZoom={false} />
    </>

  )
}
function Ticket(props: any) {
  const { nodes, materials } = useGLTF('./node/golden_ticket.glb')
  let node: any = nodes
  // const {ticketUp} = useSpring({
  //   from:{
  //     ticketUp:0
  //   },
  //   to:[{
  //     ticketUp:-Math.PI/2
  //   },
  //   {
  //     ticketUp:-Math.PI
  //   },
  //   {
  //     ticketUp:-1.5*Math.PI
  //   },
  //   {
  //     ticketUp:-2*Math.PI
  //   }
  // ],
  //   config:{
  //     mass:5,
  //     tension:500,
  //     friction:80,
  //     duration:2000
  //   },
  //   loop:true,
  //   immediate:true
  // })

  const a: any = useRef()
  useFrame(() => {
    a.current.rotation.z += Math.sin(Date.now() / 1000) * 0.01
    a.current.position.y += Math.sin(Date.now() / 1000) * 0.01
    // cameraRef.current.position.x += (-mouseX - cameraRef.current.position.x)*0.01
    // cameraRef.current.position.y += (-mouseY - cameraRef.current.position.y) *0.01
    // cameraRef.current.lookAt(0,0,5)
  })
  return (
    <>
      <group {...props} dispose={null} position={[1, 1, -4]} ref={a}>
        <animated.group >
          <group scale={0.1} rotation={[Math.PI / 4, Math.PI / 2, 0]}>
            <mesh geometry={node.GOLDEN_TICKET_blinn1_0.geometry} material={materials.blinn1} />
            <mesh geometry={node.GOLDEN_TICKET_blinn2_0.geometry} material={materials.blinn2} />
          </group>
        </animated.group>
      </group>
      <OrbitControls enableZoom={false} />
    </>
  )
}



export default function App() {

  return (
    <>
    <NavHome />
    <div className='bg'>
      <div className='bg1'>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '1', backdropFilter: 'blur(3px)', display: 'flex' }}>
          <h1 className='title1' style={{ position: 'absolute', top: '30%', width: '40%', paddingLeft: '50px' }}>Welcome to Cinema</h1>
          <h1 className='title1' style={{ position: 'absolute', top: '30%', width: '30%', right: '50px', paddingTop: '200px' }}>Shark Film</h1>
          <div className='title2'>
            <h1>Mang đến trải nghiệm tốt nhất</h1>
            {/* <p>Cinema mang đến trải nghiệm tốt nhất</p> */}
            <p className='title2-p1' style={{ marginTop: '30px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/voice.png" alt="" /> <span> Hệ thống âm thanh sống động </span></p>
            <p className='title2-p1' style={{ marginTop: '15px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/film-making.png" alt="" /> <span> Hình ảnh có độ phâm giải cao, sắc nét  </span></p>
            <p className='title2-p1' style={{ marginTop: '15px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/3d-movie.png" alt="" /> <span> Hệ thống rạp hiện đại,với các thiết bị tân tiến </span></p>
          </div>
          <div className='title3'>
            <h1>Nhiều chương trình ưu đãi</h1>
            {/* <p>Cinema mang đến trải nghiệm tốt nhất</p> */}
            <p className='title3-p1' style={{ marginTop: '30px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/ticket.png" alt="" /> <span> Giá vé phù hợp với học sinh,sinh viên </span></p>
            <p className='title3-p1' style={{ marginTop: '15px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/combo.png" alt="" /> <span> Nhiều combo, hấp dẫn với nhiều sự lựa chọn  </span></p>
            <p className='title3-p1' style={{ marginTop: '15px',display:'flex',alignItems:'center',gap:'30px'}}><img src="./public/node/tv.png" alt="" /> <span> Luôn cập nhập lịch chiếu mới nhất </span></p>
          </div>
          <div className='title4'>
            <h2> Scolling to see more</h2>
            <img src="./public/node/down.png" alt="" />
          </div>
        </div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: '2' }}>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5] }} className='canvas'>
              <ScrollControls pages={4} damping={0.25} >
                <ambientLight intensity={0.3} />
                <Stage environment={"night"} >
                  <Film></Film>
                </Stage>
              </ScrollControls>
            </Canvas>
          </Suspense>
        </div>

      </div>
      <div className='bg2'>
        <div className='camera'>
          <Suspense fallback={null}>
            <Canvas className='canvas' >
              <ScrollControls pages={4} damping={0.25} >
                <ambientLight intensity={1} />
                <Stage environment={"city"} >
                  <Camera></Camera>
                </Stage>
              </ScrollControls>
            </Canvas>
          </Suspense>
        </div>

        <div className='movie'>
          <video id='sound' width={500} height={400} autoPlay loop muted={true}>
            <source src={"./video/Aquaman và Vương Quốc Thất Lạc _ Trailer.mp4"} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className='bg3'>
      </div>
      <div className='bg4'>
        <Suspense fallback={null}>
          <Canvas >
            <ambientLight intensity={1} />
            <Stage environment={"city"}  >
              <Coca></Coca>
              <Model ></Model>
              <Ticket></Ticket>
            </Stage>
          </Canvas>
        </Suspense>
      </div>
    </div>
      

    </>

  )
}