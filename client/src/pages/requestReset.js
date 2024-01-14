import React, { Component, useState } from 'react';
import './test2.css'
import bg4 from '../components/bg.jpg'
function App(){

    const [email, setEmail] = useState('');
    return(
        <form>
            <div style={{backgroundImage : `url(${bg4})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width:'100vw',
                display: 'grid',
                placeContent: 'center'
                }}>
                
                <div className='requestContainer'>

                    <h1 className='request-text' 
                    style={{gridRow: '2', gridColumn: '2/5', placeSelf: 'center ',
                    fontSize: '2rem', textDecoration: 'underline', textDecorationThickness: '2px'}}>Enter your Email</h1>
                    <div className='request-input' style={{gridColumn: '3', gridRow: '4', placeSelf: 'center'}}>
                        <input 
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)}
                            type='email' 
                            placeholder='Email' />    

                        <i className='fas fa-envelope' style={{position: 'relative', top: '-5vh', left: '1vw',
                        fontSize: '1.2rem'}}></i>
                    </div>

                    <button style={{
                            backgroundImage: `url(${bg4})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            gridColumn: '2', gridRow: '5', marginLeft: '0.5vw'}} className='request-button' type='submit' >Proceed</button>                    
                </div>
            </div>
        </form>
    );
}
export default App;