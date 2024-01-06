import { React,useState,useEffect } from "react";
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";

function App(){
    const [ email, setEmail ] = useState('')
    const [ resetString, setResetString ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ modalContent, setModalContent ] = useState({})
    const [ role,setRole ] = useState('')


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
    }, 2000);
  };

  useEffect(() => {
    // Use useEffect to listen for changes in 'role'
    if (role == 'Department') {
      // Redirect to the mapDepartment page
      setTimeout(() => {
        window.location.href = '/mapDepartment';
      }, 2000);
    } else if (role == 'Customer') {
      // Redirect to the mapCustomer page
      setTimeout(() => {
        window.location.href = '/mapCustomer';
      }, 2000);
    }
    else if(role == 'Admin'){
      setTimeout(() => {
        window.location.href="/map";
      }, 2000);
    }
  }, [role]); // Run this effect whenever 'role' changes


  async function nextpage(event)
  {
    event.preventDefault()
    const response = await fetch('http://localhost:5000/resetPassword',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      }, 
      body: JSON.stringify({
        email,
        resetString,
        newPassword
      }),
    })

    const data = await response.json()
    console.log(data)
    if (data.status=="SUCCESS")
    {
      setRole(data.role)
      openModal(data.status,data.message)
    }
    else{
      openModal(data.status,data.message)
    }
    // console.log(data)
  }
    return(
        <form onSubmit={nextpage}>
        <div className="login-box">
        <h2 style={{color:"powderblue",textAlign:"center"}}>Password Reset</h2>
        <br/>
        <div className="user-box">
        <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Enter your Email' />
        <input 
            value={resetString}
            onChange={(e) => setResetString(e.target.value)}
            type='text'
            placeholder='Enter your Token' />
        <input 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type='password'
            placeholder='Enter your New Password' />
        </div>
        <br/>
        <button type="submit">Enter</button>
        </div>
        <div className='modal-box'>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false}>
            <ModalOverlay />
                <ModalContent bg="white" border={modalContent.border} borderRadius="5px" p={4} top={50} left="41%" boxSize="18%">
                    <ModalHeader style={{marginLeft:60}}>{modalContent.header}</ModalHeader>
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