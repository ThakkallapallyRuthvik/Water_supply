import { React,useState } from "react";
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";

function App(){
    const [ email, setEmail ] = useState('')
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
        <form onSubmit={nextpage}>
        <div className="login-box">
        <div className="user-box">
        <h2 style={{color:"powderblue",textAlign:'center'}}>Enter Your Email</h2>
        <br/>
        <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Enter your Email' />
        </div>
        <br/>
        <button type="submit">Enter</button>
        </div>
        <div className='modal-box'>
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

    )
}

export default App