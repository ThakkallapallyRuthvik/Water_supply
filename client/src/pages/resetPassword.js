import React, { Component } from 'react'
import bg4 from '../components/bg.jpg'
import './test2.css'
function App(){

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

                <div className='resetContainer'>
                        <h1 className='request-text' style={{ gridRow: '1', gridColumn: '1/5', placeSelf: 'center',
                            fontSize: '2rem', textDecoration: 'underline', textDecorationThickness: '2px'
                        }}>Password Reset</h1>
                    <div style={{marginLeft: '1vw', marginTop: '5vh'}}>
                        <input  style={{gridColumn: '1/5', gridRow: '3', placeSelf: 'center'}} type='email' placeholder='Enter your email' />
                        <i className='fas fa-envelope' style={{position: 'relative', top: '-5vh', left: '1vw',
                            fontSize: '1.2rem'}}></i>
                        <input  style={{gridColumn: '1/5', gridRow: '4', placeSelf: 'center'}} type='email' placeholder='Enter your token' />
                        <i className='fas fa-envelope' style={{position: 'relative', top: '-5vh', left: '1vw',
                            fontSize: '1.2rem'}}></i>
                        <input  style={{gridColumn: '1/5', gridRow: '5', placeSelf: 'center'}} type='email' placeholder='Enter your new password' />
                        <i className='fas fa-envelope' style={{position: 'relative', top: '-5vh', left: '1vw',
                            fontSize: '1.2rem'}}></i>
                    </div>
                    <button style={{
                            backgroundImage: `url(${bg4})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            gridColumn: '1/5', gridRow: '7', placeSelf:'center' }} className='request-button' type='submit' >Finish</button>
                </div>

            </div>


        </form>
    );
}
export default App;