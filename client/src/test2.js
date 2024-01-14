import React from 'react';
import {useState, useEffect} from 'react'
import { HStack } from '@chakra-ui/react'
import bg4 from './bg-2.jpeg';
import './test2.css';
import  sideart from './login-bg.jpg';
import logo1 from './logo-1.png';


function App()
{ 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function loginUser(event)
  {
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
    <form onSubmit={loginUser} autoComplete='current-password'>
      <div style={{backgroundImage : `url(${bg4})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width:'100vw',
        display: 'grid',
        placeItems: 'center'}}>

        <div className='container'>
          <img src={logo1} className='logo-login'></img>
          <a onClick={()=>window.location.href='/newHome'} className='homeone'>Home</a>
          <HStack>
            <a></a>
          </HStack>
          <img style={{height: '77vh', width: '38vw', position: 'absolute', top: '15vh', left: '23vh', zIndex: '1'}} src={sideart}></img>
          <div className='login-text'>Sign In</div>
          <div className='username'>
            <input 
              className='username-box'
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
              type='text' 
              placeholder='Email'></input>
            <i className='fas fa-user' style={{position: 'relative', top: '-5.3vh', left: '2.2vh', fontSize: '1.2rem'}}></i>
            <input 
              // className='pass-box'
              autoComplete = 'current-password'
              value={password}
              onChange = {(e) => setPassword(e.target.value)}
              type='password' 
              placeholder='Password'
              />
            <i className='fas fa-lock' style={{position: 'relative', top: '-5.3vh', left: '2.2vh', fontSize: '1.2rem'}} />
          </div>
          <input className='login-button' type='submit' value='Login'></input>
        </div>
      </div>
    </form>
  );
}

export default App