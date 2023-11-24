import React,{useState, useEffect} from 'react'


function App()
{
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [email, setEmail] = useState('')

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
        pass,
      }),
    })

    const data = await response.json()
    if (data)
    {
      alert("Registration succesful! Redirecting to login page")
      window.location.href="/login"
    }
    else{
      alert("Error! Please try again")
    }
    // console.log(data)
  }

  return(
    <form onSubmit={registerUser}>
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
          value={pass}
          onChange = {(e) => setPass(e.target.value)}
          type='password' placeholder='Password'/>               {/* '/' implies </input> */}
        </div>
        <br>
        </br>
        <input type='submit' value='Register'/>
    </div>
    </form>
  )
}

export default App