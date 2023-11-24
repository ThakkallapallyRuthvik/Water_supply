import React,{useState, useEffect} from 'react'

function App()
{
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')

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
    if(data.user)
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
          value={name}
          onChange = {(e) => setName(e.target.value)}
          type='text' 
          placeholder='Username'></input>
        <br/>
        </div>
        {/* <label style={{color:'Powderblue'}}>Password</label> */}
        <br/>
        <div className='user-box'>
        <input
          value={pass}
          onChange = {(e) => setPass(e.target.value)}
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