import React, { useState, useEffect} from "react";
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";
import './newHome.css'
import { Center } from "@chakra-ui/react";

function Home(){
    const [ name,setName ] = useState('')
    const [isclicked, setIsClicked] = useState(false);
    const [isclicked2, setIsClicked2] = useState(false);
    const [password, setPassword] = useState(''); 
    const [ confirmpassword, setConfirmPassword ] = useState('')
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [ loginRole, setLoginRole ] = useState('')
    const [ add, setAdd ] = useState('')
    const [otp, setOtp] = useState('');
    const [ disable, setDisable ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ modalContent, setModalContent ] = useState({})

    
    function toggleLogin() {
        const loginForm = document.getElementById('loginForm');
        const loginMain = document.getElementById('loginMain');
        const registerMain = document.getElementById('signupMain');

        registerMain.classList.toggle('active');
        loginMain.classList.toggle('active');

        loginForm.classList.toggle('active');

    }



    function toggleSignup() {
        const signupForm = document.getElementById('signupForm');
        const signupMain = document.getElementById('signupMain');
        const signinMain = document.getElementById('loginMain');

        signinMain.classList.toggle('active1');
        signupMain.classList.toggle('active1');

        signupForm.classList.toggle('active');

    }

    function uponClickD(){
        setIsClicked(!isclicked);
        setIsClicked2(false);
        console.log('Department');
      }
    
      function uponClickC(){
        setIsClicked2(!isclicked2);
        setIsClicked(false)
        console.log('Customer');
      }



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
            if(role=="Customer"){
              window.location.href="/mapCustomer"
            }
            else if(role=="Department"){
              window.location.href="/mapDepartment"
            }
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
            confirmpassword,
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


    async function loginUser(event){
      event.preventDefault()
      const response = await fetch('http://localhost:5000/api/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      })
  
      const data = await response.json()
    //   console.log(data)
    if(data.data)
    {
        setLoginRole(data.data.role)
        openModal(data.status,data.message)
    }
    else{
        openModal(data.status,data.message)
    }
    // console.log(data)
  }

  useEffect(() => {
    // Use useEffect to listen for changes in 'role'
    if (loginRole == 'Department') {
      // Redirect to the mapDepartment page
      setTimeout(() => {
        window.location.href = '/mapDepartment';
      }, 2000);
    } else if (loginRole == 'Customer') {
      // Redirect to the mapCustomer page
      setTimeout(() => {
        window.location.href = '/mapCustomer';
      }, 2000);
    }
    else if(loginRole == 'Admin'){
      setTimeout(() => {
        window.location.href="/map";
      }, 2000);
    }
  }, [loginRole]); // Run this effect whenever 'role' changes


    return(
        <div className="home">
            <a style={{gridColumn: '7',gridRow: '1', placeSelf: 'center', backdropFilter: 'blur(4px)', backgroundColor: 'transparent'}}>Home</a>
            <a style={{gridColumn: '8', gridRow: '1', placeSelf: 'center'}}>About Us</a>
            <a style={{gridColumn: '9', gridRow: '1', placeSelf: 'center'}}>View</a>
            <main className="flexparent">
                <section className="flexchild" id="loginMain">
                    <p style={{color: 'white'}}>Sign In as a citizen or continue as a surveyor</p>
                    <button tabIndex='-1' className="toggle" 
                        onClick={() => {toggleLogin()}}
                        type="button">

                        <i className="fas fa-lock" />
                        <p>Login</p>
                        
                    </button>
                </section>

                <section className="flexchild" id="signupMain">
                    <p style={{color: 'white'}}>Register for our mapping tool or Sign up as a citizen</p>
                    <button tabIndex='-1' className="toggle" 
                        onClick={() => {toggleSignup()}}
                        type="button">

                        <i className="fas fa-pencil" />
                        <p>Sign Up</p>

                    </button>
                </section>
            </main>

            <form onSubmit={loginUser} className="login" id="loginForm">
                <button tabIndex='-1' onClick={()=>{toggleLogin()}} type="button">
                    <i className="fas fa-arrow-left"/>
                </button>

                <h1 style={{gridRow: '1', gridColumn: '2/5', placeSelf: 'center', fontSize: '2.5rem', }}>Login</h1>

                <i className="fas fa-user" style={{fontSize: '1.5rem', position: 'absolute', top: '29%', left: '17%'}} />
                <i className="fas fa-key" style={{fontSize: '1.5rem', position: 'absolute', top: '56%', left: '17%', color: 'white'}} />
                <a onClick={()=>window.location.href='/requestPasswordReset'} style={{gridRow: '4', gridColumn: '3/5', justifySelf: 'end', alignSelf: 'center', fontSize: '0.96rem', position: 'relative', zIndex: '1'}}>Forgot password?</a>
                <div className="loginInput">

                    <input tabIndex='-1' type="text" placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                    <input tabIndex='-1' type="password" placeholder="Password" autoComplete="current-password" style={{color: 'white'}}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input tabIndex='-1' type="submit" value='Sign In' />
                    <i className="fas fa-arrow-right" style={{fontSize: '1.5rem', position: 'absolute', top: '83%', right: '18%'}} />

                </div>


            </form>

            <form onSubmit={sendotp} className="register" id="signupForm">
                <button tabIndex='-1' onClick={() =>{toggleSignup()}} type="button" >
                    <i className="fas fa-arrow-left"></i>
                </button>

                <h1 style={{gridRow: '1', gridColumn: '4/6', justifySelf: 'center', fontSize: '3rem'}}>Register</h1>
                
                <div style={{ gridRow: '3/10', gridColumn: '1/2', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', fontSize: '1.3rem', color: 'white'}}>
                    <i className="fas fa-user"></i>
                    <i className="fas fa-envelope"></i>
                    <i className="fas fa-key"></i>
                    <i className="fas fa-rotate"></i>
                    {/* <i className="fas fa-rotate"></i> */}
                </div>

                <div className="registerInput">

                    <input tabIndex='-1' type="text" placeholder="Enter your username"
                    value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input tabIndex='-1' type="email" placeholder="Enter your email"
                    value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input tabIndex='-1' type="password" placeholder="Enter your password" autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <input tabIndex='-1' type="password" placeholder="Confirm password" autoComplete="new-password"
                    value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>

                </div>

                <div className="roleInput">

                    <p>Select Role: </p>
                    <button tabIndex='-1' type="button" onClick={() => {uponClickD();
                    setRole('Department');}} className={`dept${ isclicked ? 'yes': '' }`} dept-tooltip='Department'
                    value={role} onChange={(e) => setRole(e.target.value)}>
                        <i className="fas fa-user-tie"></i>
                    </button>
                    <button tabIndex='-1' type="button" onClick={() => {uponClickC();
                    setRole('Customer');}} className={`cust${ isclicked2 ? 'yes': '' }`} cust-tooltip='Citizen'
                    value={role} onChange={(e) => setRole(e.target.value)}>
                        <i className="far fa-user"></i>
                    </button>

                    

                </div>
                {role=="Customer" && (
                      <div  style={{gridRow: '5', gridColumn: '6/10', placeSelf: 'center'}}>
                        <input 
                        className="hello"
                        value={add}
                        onChange={(e)=>setAdd(e.target.value)}
                        placeholder='Enter Address'
                        />
                        <br/>
                      </div> 
                    )}
                <div className="otpInput">
                    <button tabIndex='-1' type="button" onClick={registerUser}>
                        <p>Get OTP</p>
                    </button>
                    <input 
                        className="hello"
                        value={otp}
                        onChange={(e)=>setOtp(e.target.value)}
                        placeholder='Enter OTP'
                        />
                    <button type="submit" value="Register">Register</button>
                </div>
                <br/>
                <br/>
                {/* <div className="otpInput">
                    <input type="text" value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    disabled={disable?false:true} />
                </div> */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false} >
                    <ModalOverlay />
                        <ModalContent bg="white" border={modalContent.border} borderRadius="5px" p={4} top={60} left="40%" boxSize="18%" >
                            <ModalHeader style={{marginLeft:60}}>{modalContent.header}</ModalHeader>
                            {/* <ModalCloseButton width={10} left="50%" /> */}
                            <ModalBody>
                                {modalContent.body}
                            </ModalBody>
                        </ModalContent>
                </Modal>
            </form>
        </div>
    );
}

export default Home;