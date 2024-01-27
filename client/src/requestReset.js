import React, { Component, useState } from 'react';
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";
import './test2.css'
import './request-reset.css';
// import bg4 from './bg.jpg'
function App(){

    const [email, setEmail] = useState('');
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ modalContent, setModalContent ] = useState({})


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
      if(header=='SUCCESS'){
        window.location.href="/resetPassword"
      }
      setIsModalOpen(false);
    }, 2000);
  };


  async function nextpage(event)
  {
    event.preventDefault()
    const response = await fetch('http://localhost:5000/requestPasswordReset',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      }, 
      body: JSON.stringify({
        email
      }),
    })

    const data = await response.json()
    console.log(data)
    if (data.status=="PENDING")
    {
      openModal(data.status,data.message)
    }
    else{
      openModal(data.status,data.message)
    }
    // console.log(data)
  }

    return(
        <form onSubmit={nextpage} className='requestForm'>
            <div>
                
                <div className='requestContainer' style={{ backgroundColor: 'transparent'}}>

                  <h1 className='request-text' 
                  style={{gridRow: '2', gridColumn: '2/5', placeSelf: 'center ',
                  fontSize: '2rem'}}>Enter your Email</h1>
                  <div className='request-input' style={{gridColumn: '3', gridRow: '4', placeSelf: 'center'}}>
                      <input 
                          value={email}
                          onChange = {(e) => setEmail(e.target.value)}
                          type='email' 
                          placeholder='Email' 
                              style={{backgroundColor: 'transparent', color: 'white'}}
                          />    

                      <i className='fas fa-envelope' style={{position: 'relative', top: '-5.3vh', left: '1vw', zIndex: '2',
                      fontSize: '1.2rem', color: 'white'}}></i>
                  </div>

                  <button style={{
                          // backgroundColor: 'transparent',
                          gridColumn: '2/5', gridRow: '5', placeSelf: 'center'}} className='request-button' type='submit' >
                              <p>Proceed</p>
                              <i className="fas fa-arrow-right" style={{fontSize: '1.5rem', 
                              // position: 'absolute', top: '83%', right: '18%'
                              }} />
                          </button>                    
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false}>
                    <ModalOverlay />
                    <ModalContent bg="white" border={modalContent.border} borderRadius="5px" p={4} top={95} left="41%" boxSize="18%">
                        <ModalHeader style={{marginLeft:60}}>{modalContent.header}</ModalHeader>
                        {/* <ModalCloseButton width={10} left="50%" /> */}
                        <ModalBody>
                            {modalContent.body}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </form>
    );
}
export default App;