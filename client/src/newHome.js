import React, { useState} from "react";
import './newHome.css'
import { Center } from "@chakra-ui/react";

function Home(){


    const [name, setName] = useState('')
    const [pass, setPass] = useState('')
    const [isclicked, setIsClicked] = useState(false);
    const [isclicked2, setIsClicked2] = useState(false);
    const [password, setPassword] = useState(''); 
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [otp, setOtp] = useState('');
    const [ disable, setDisable ] = useState(false);

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


    async function loginUser(event)
    
    {
      event.preventDefault()
      const response = await fetch('http://localhost:5000/api/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          name,
          pass
        }),
      })
  
      const data = await response.json()
      console.log(data)
      if(data.data)
      {
          alert("Login successful")
          window.location.href='/map'
      }
      else{
          alert("Please check again")
      }
      // console.log(data)
    }




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
                <a onClick={()=>window.location.href='/request'} style={{gridRow: '4', gridColumn: '3/5', justifySelf: 'end', alignSelf: 'center', fontSize: '0.96rem', position: 'relative', zIndex: '1'}}>Forgor password?</a>
                <div className="loginInput">

                    <input tabIndex='-1' type="text" placeholder="Username" />
                    <input tabIndex='-1' type="password" placeholder="Password" autoComplete="current-password" style={{color: 'white'}}/>
                    <input tabIndex='-1' type="submit" value='Sign In' />
                    <i className="fas fa-arrow-right" style={{fontSize: '1.5rem', position: 'absolute', top: '83%', right: '18%'}} />

                </div>


            </form>

            <form onSubmit={loginUser} className="register" id="signupForm">
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

                    <input tabIndex='-1' type="text" placeholder="Enter your username"></input>
                    <input tabIndex='-1' type="email" placeholder="Enter your email"></input>
                    <input tabIndex='-1' type="password" placeholder="Enter your password" autoComplete="new-password"></input>
                    <input tabIndex='-1' type="password" placeholder="Confirm password" autoComplete="new-password"></input>

                </div>

                <div className="roleInput">

                    <p>Select Role: </p>
                    <button tabIndex='-1' type="button" onClick={() => {uponClickD()}} className={`dept${ isclicked ? 'yes': '' }`} dept-tooltip='Department'>
                        <i className="fas fa-user-tie"></i>
                    </button>
                    <button tabIndex='-1' type="button" onClick={() => {uponClickC()}} className={`cust${ isclicked2 ? 'yes': '' }`} cust-tooltip='Citizen'>
                        <i className="far fa-user"></i>
                    </button>

                    

                </div>

                <div className="otpInput">
                    <button tabIndex='-1' type="button">
                        <p>Get OTP</p>
                    </button>

                </div>
            </form>
        </div>
    );
}

export default Home;