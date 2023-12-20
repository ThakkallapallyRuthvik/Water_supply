import React,{useState, useEffect} from 'react'
import './App.css'

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
    <form onSubmit={loginUser}>
    <div className="login-box">
      <h1 style={{color:'Aqua',textAlign:'center'}}>Login</h1>
        {/* <label style={{color:'Powderblue'}}>Username</label> */}
        <br/>
        <div className='user-box'>
        <input 
          value={email}
          onChange = {(e) => setEmail(e.target.value)}
          type='email' 
          placeholder='Email'></input>
        <br/>
        </div>
        {/* <label style={{color:'Powderblue'}}>Password</label> */}
        <br/>
        <div className='user-box'>
        <input
          value={password}
          onChange = {(e) => setPassword(e.target.value)}
          type='password' placeholder='Password'/>               {/* '/' implies </input> */}
        </div>
        <br>
        </br>
        <input type='submit' value='Login'/>
    </div>
    </form>
  )
}

export default App