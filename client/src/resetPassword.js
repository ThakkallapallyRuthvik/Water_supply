import React, { Component,useState,useEffect } from 'react'
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton, VStack} from "@chakra-ui/react";
import './request-reset.css';
import bg4 from './bg.jpg'
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
        
        <form onSubmit={nextpage} className='resetForm'>

          <div>

          <div className='resetContainer'>
                  <h1 className='request-text' style={{ gridRow: '1', gridColumn: '1/5', placeSelf: 'center',
                      fontSize: '2rem', textDecoration: 'underline', textDecorationThickness: '2px'
                  }}>Password Reset</h1>
              <div className='resetInputdiv' style={{display: 'flex', flexDirection: 'column', gridRow: '3/7', gridColumn: '1/5', alignItems: 'center', justifyContent: 'space-around'}}>
                  <input  style={{}} type='email' placeholder='Enter your email' />
                  <input  style={{}} type='email' placeholder='Enter your token' />
                  <input  style={{}} type='email' placeholder='Enter your new password' />
              </div>
              
              <div style={{display: 'flex',flexDirection: 'column', gridRow: '3/7', gridColumn: '1',alignItems: 'center', justifyContent: 'space-around', marginLeft: '50%',position:'relative',zIndex:2}}>
                <i className='fas fa-envelope'></i>
                <i className='fas fa-key'></i>
                <i className='fas fa-lock'></i>
              </div>
              <button style={{
                      // backgroundImage: url(${bg4}), backgroundSize: 'cover', backgroundPosition: 'center',
                      gridColumn: '1/5', gridRow: '7', placeSelf:'center' }} className='request-button' type='submit' >Finish</button>
          </div>

          </div>
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
              
        </form>
    );
}
export default App;