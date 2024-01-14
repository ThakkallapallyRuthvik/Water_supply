import React,{useState, useEffect} from 'react'
import {Flex,Box,HStack,Button,ButtonGroup,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton, Center} from "@chakra-ui/react";
import './App.css'

function App()
{
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [ role, setRole ] = useState('')
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ modalContent, setModalContent ] = useState({})
  const [ otp, setOtp ] = useState('')
  const [ disable, setDisable ] = useState(false)
  const [ add, setAdd ] = useState('')

  const openModal = (header, body) => {
    if (header == "FAILED"){
      setModalContent({
        header: '❌'+header,
        body: body,
        border: "3px solid red"
      });
    }
    else{
      setModalContent({
        header: '✅'+header,
        body: body,
        border: "3px solid lightgreen"
      });
    }
    setIsModalOpen(true);
    // Automatically close the modal after 2 seconds
    setTimeout(() => {
      if(header=='PENDING'){
        setDisable(true)
        // window.location.href="/login"
      }
      else if(header=='SUCCESS'){
        window.location.href='/login'
      }
      setIsModalOpen(false);
    }, 2000);
  };


  useEffect(() => {
    if (role === 'Department') {
      setAdd('None');
    }
    if (role === 'Customer'){
      setAdd('')
    }
  }, [role]);

  async function sendotp(event){
    event.preventDefault()
    const response = await fetch('http://localhost:5000/verifyotp',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        email,
        otp
      })
    })

    const data = await response.json()
    console.log(data)
    if (data.data)
    {
      openModal(data.status,data.message)
    }
    else{
      openModal(data.status,data.message)
    }
  }

  async function registerUser(event)
  {
    event.preventDefault()
    const response = await fetch('http://localhost:5000/api/register',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      }, 
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        add
      }),
    })

    const data = await response.json()
    console.log(data)
    if (data.data)
    {
      openModal(data.status,data.message)
    }
    else{
      openModal(data.status,data.message)
    }
    // console.log(data)
  }

  return(
    <form onSubmit={sendotp}> 
    <div className='login-box'>
      <h1 style={{textAlign:'center',color:"Aqua"}}>Register</h1>
      {/* <label style={{color:'Powderblue'}}>Username</label> */}
        <div className='user-box'>
        <input 
          value={name}
          onChange = {(e) => setName(e.target.value)}
          type='text' 
          placeholder='Username'></input>
        </div>
        <div className='user-box'>
        <input 
          value={email}
          onChange = {(e) => setEmail(e.target.value)}
          type='email' 
          placeholder='Email'></input>
        </div>
        {/* <label style={{color:'Powderblue'}}>Password</label> */}
        <div className='user-box'>
        <input
          value={password}
          onChange = {(e) => setPassword(e.target.value)}
          type='password' placeholder='Password'/>               {/* '/' implies </input> */}
        </div>
        <div className='user-box'>
          <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder='Select Role'
          style={{width:"50%",fontSize:"100%"}}>
            <option value="">--Select Role--</option>
            <option value="Department">Department</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
        <br/>
        {role=="Customer" && (
          <div className='user-box'>
            <input 
            value={add}
            onChange={(e)=>setAdd(e.target.value)}
            placeholder='Enter Address'
            />
            <br/>
          </div> 
        )}
        <button onClick={registerUser} style={{width:'100%',height:'30px'}} >Get OTP</button>
        <br/>
        <br/>
        <input type='text' value={otp} 
        onChange={(e) => setOtp(e.target.value)}
        placeholder='Enter OTP' 
        disabled={disable?false:true}
        />
        <br/>
        <br/>
        <input type='submit' value='Register' />
    </div>
    <div className='modal-box'>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false}>
        <ModalOverlay />
            <ModalContent bg="white" border={modalContent.border} borderRadius="5px" p={4} top={40} left="41%" boxSize="18%">
                <ModalHeader style={{marginLeft:45}}>{modalContent.header}</ModalHeader>
                {/* <ModalCloseButton width={10} left="50%" /> */}
                <ModalBody>
                    {modalContent.body}
                </ModalBody>
            </ModalContent>
      </Modal>
      </div>
    </form>
    
  )
}

export default App