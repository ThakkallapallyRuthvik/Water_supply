import {React,useState,useEffect} from 'react';
import { useJsApiLoader, GoogleMap, Marker, Polyline, InfoWindow, StandaloneSearchBox } from "@react-google-maps/api";
import {Flex,Box,HStack,Button,ButtonGroup,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { useRef } from "react";
import GreenHouseMarker from './greenhousemarker.jpeg'
import RedHouseMarker from './redhousemarker.jpeg'
import junctionmarker from './junctionmarker.jpeg'
import waterreservoir from './waterreservoir.jpeg'
import treatmentplant from './watertreatmentplant.png'
import bg from './bg.jpg'
import user from './img/user.png';
import edit from './img/edit.png';
import inbox from './img/envelope.png';
import settings from './img/settings.png';
import help from './img/question.png';
import logout from './img/log-out.png';
import logo from './img/logo-1.png'
import './profile.css';
import './App.css'
import './Navbar.css'
import UserList from './UserList'


  
function App()
{
    const origin = { lat: 16.82335305593255, lng: 78.36555955215761 };
    const MapLibraries = ["places"]
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:"AIzaSyB6IhzjbQp_KS4lsGdGWq3TvMgMdngijQU",
        libraries:MapLibraries,
    })
    const [ map, setMap] = useState('')
    const [zoomLevel, setZoomLevel] = useState(17); // Initialize zoom level
    const [coordinates, setCoordinates] = useState([])
    const [ center, setCenter] = useState(origin)
    const [searchBox, setSearchBox] = useState(null);
    const [ selectedhouseMarker, setSelectedhouseMarker] = useState(null)
    const [ selectedjunctionMarker, setSelectedjunctionMarker] = useState(null)
    const [ selectedreservoir, setSelectedreservoir] = useState(null)
    const [ defaultcoordinates, setDefaultCoordinates ] = useState([])
    const [ housecoords, setHouseCoords ] = useState([])
    const [ defaultHouseCoords, setDefaultHouseCoords ] = useState([])
    const [ junctioncoords , setJunctionCoords] = useState([])
    const [ defaultjunctioncoords , setDefaultJunctionCoords ] = useState([])
    const [selectedHouseForJunction, setSelectedHouseForJunction] = useState(null);
    const [waterReservoirCoords, setWaterReservoirCoords] = useState([])
    const [ treatmentplantCoords, setTreatmentplantCoords ] = useState([])
    const [selectedUserForAllotment, setSelectedUserForAllotment] = useState(null);
    const [newRegistrationsListModalOpen, setNewRegistrationsListModalOpen] = useState(false);
    const [isHouseMarkerAdded, setIsHouseMarkerAdded] = useState(false);
    const [ houseAllotedEmail, setHouseAllotedEmail ] = useState({})
    const [ housecoordsLength, setHousecoordsLength ] = useState(0)
    const [UserDataForDept, setUserDataForDept] = useState([]);
    let [ subcoords, setSubCoords ] = useState([])
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ raiseComplaintModal, setRaiseComplaintModal ] = useState(false)
    const [ modalContent, SetModalContent ] = useState({})
    const [ complaintsModal, setComplaintsModal ] = useState(false)
    const [ complaintsModalContent, setComplaintsModalContent ] = useState({})
    const [ newRegModal, setNewRegModal ] = useState(false)
    const [ newRegModalContent, setNewRegModalContent ] = useState({})
    const [ ID, setID ] = useState('')
    let [ markerFunction, setMarkerFunction ] = useState(0)
    const [waterQuantity, setWaterQuantity] = useState(1000)
    const [ description, setDescription ] = useState('')
    const [ isHovered, setIsHovered ] = useState(false)
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const [open, setOpen] = useState(false);
    let menuRef = useRef();
    const navRef = useRef();

    useEffect(() => {
    let handler = (e)=>{
        if(!menuRef.current.contains(e.target)){
        setOpen(false);
        // console.log(menuRef.current);
        }      
    };

    document.addEventListener("mousedown", handler);
    

    return() =>{
        document.removeEventListener("mousedown", handler);
    }

    });
    
    const onPlacesChanged = () => {
        const places = searchBox.getPlaces();
        if (places.length > 0) {
          const selectedPlace = places[0].geometry.location;
          map.panTo({ lat: selectedPlace.lat(), lng: selectedPlace.lng() });
        }
      };

    function addMarker(pos){
        if(markerFunction == 1){
            setSubCoords((prevSubCoords) => [...prevSubCoords, pos])
            if(subcoords.length!=0){
                const delextracoords = [...coordinates]
                delextracoords.pop()
                setCoordinates(delextracoords)
            }
            setCoordinates((prevcoordinates) => [...prevcoordinates,[...subcoords,pos]])
        }
        else if (markerFunction == 2){
            const newhouse = {
                CANID : "H" + (housecoords.length+1),
                userid:ID,
                hcoords : pos,
                waterSupplied : true,
                assignedJunction : null,
            }
            setHouseCoords((prevHouseCoords) => [...prevHouseCoords, newhouse])
            //console.log(housecoords)
            //console.log(housecoords[selectedhouseMarker].assignedJunction)
        }
        else if(markerFunction == 3){
            const newjunction = {
                JID : "J" + (junctioncoords.length+1),
                jcoords : pos,
                houses : [],
                waterSupplied : true,
            }
            setJunctionCoords((prevjunctioncoords) => [...prevjunctioncoords,newjunction])
            //console.log(junctioncoords)
        }
        else if(markerFunction==4){
            setWaterReservoirCoords((prevWaterReservoirCoords) => [...prevWaterReservoirCoords , pos])
        }
        else if(markerFunction==5){
            setTreatmentplantCoords((prevTreatmentplantCoords) => [...prevTreatmentplantCoords, pos])
        }
    }

    function drawLine(){
        setMarkerFunction(1)
        if ( subcoords.length>0){
            // setCoordinates([...coordinates,subcoords])
            setSubCoords([])
            // console.log(coordinates)
        }
    }
    
    function houseMarker(){
        setMarkerFunction(2)
        // setHouseCoords((prevHouseCoords) => [...prevHouseCoords,pos])
    }

    //function for junction marker

    function junctionMarker(){
        setMarkerFunction(3)
    }

    function waterReservoir(){
        setMarkerFunction(4)
    }

    function waterTreatmentPlant(){
        setMarkerFunction(5)
    }
    
    function deleteLastHouse(){
        if (housecoords.length > 0 && housecoords.length>defaultHouseCoords.length){
            const newHouseCoords = [...housecoords]
            newHouseCoords.pop()
            setHouseCoords(newHouseCoords)
        }
    }

    //function for deleting last junction
    function deleteLastJunction(){
        if (junctioncoords.length>0 && junctioncoords.length>defaultjunctioncoords.length){
            const newjunctioncoords = [...junctioncoords]
            newjunctioncoords.pop()
            setJunctionCoords(newjunctioncoords)
        }
    }

    function deleteLastLine(){
        setSubCoords((prevSubCoords) => {
            const updatedSubcoords = [...prevSubCoords];
            updatedSubcoords.pop();
            return updatedSubcoords;
          });
        
          setCoordinates((prevCoordinates) => {
            const lastLineIndex = prevCoordinates.length - 1;
            // if (lastLineIndex < 0) {         //only useful if there are no elements in the coordinates array
            //   return [];
            // }
        
            const lastLine = prevCoordinates[lastLineIndex];
            const updatedCoordinates = [...prevCoordinates];
            updatedCoordinates[lastLineIndex] = lastLine.slice(0, -1); // Remove the last point
            return updatedCoordinates;
          });
    }

    function assignJunctionToHouse(selectedHouse) {
        setSelectedHouseForJunction(selectedHouse);
    }

    function assignJunctionToSelectedHouse(selectedJunction) {
        if (selectedHouseForJunction) {
            const updatedHouseCoords = housecoords.map((house) => {
                if (house === selectedHouseForJunction) {
                    return {
                        ...house,
                        assignedJunction: selectedJunction.JID,
                    };
                }
                return house;
            });
    
            setHouseCoords(updatedHouseCoords);
    
            const updatedJunctions = junctioncoords.map((junction) => {
                if (junction === selectedJunction) {
                    return {
                        ...junction,
                        houses: [...junction.houses, selectedHouseForJunction.CANID],
                    };
                }
                return junction;
            });
    
            setJunctionCoords(updatedJunctions);
    
            setSelectedHouseForJunction(null);
        }
    }

    function toggleHouseWaterSupply(index) {
        const updatedHouseCoords = housecoords.map((house, i) => {
            if (i === index) {
                return {
                    ...house,
                    waterSupplied: !house.waterSupplied,
                };
            }
            return house;
        });
        setHouseCoords(updatedHouseCoords);
    }

    function toggleJunctionWaterSupply(index) {
        const updatedJunctionCoords = junctioncoords.map((junction, i) => {
            if (i === index) {
                const updatedJunction = {
                    ...junction,
                    waterSupplied: !junction.waterSupplied,
                };
    
                // Update house water supply status under this junction
                const updatedHouseCoords = housecoords.map((house) => {
                    if (house.assignedJunction === junction.JID) {
                        return {
                            ...house,
                            waterSupplied: updatedJunction.waterSupplied,
                        };
                    }
                    return house;
                });
    
                setHouseCoords(updatedHouseCoords);
                return updatedJunction;
            }
            return junction;
        });
        setJunctionCoords(updatedJunctionCoords);
    }
    


    const markerIndex = (index , markertype) => {
        if (markertype == 'house')
        {
            setSelectedhouseMarker(index)
            setSelectedjunctionMarker(null)
        }
        else if (markertype == 'junction'){
            setSelectedjunctionMarker(index)
            setSelectedhouseMarker(null)
        }
        else if (markertype == 'reservoir'){
            setSelectedreservoir(index)
            setSelectedhouseMarker(null)
            setSelectedjunctionMarker(null)
        }
    };

    const handleZoomChanged = () => {
        if (map) {
            setZoomLevel(map.getZoom());
        }
    };

    const getMarkerSize = () => {
        return Math.max(80 - zoomLevel * 3, 10);
    };
    
    const openModal = (header,body) => {
        if (header == "FAILED"){
            SetModalContent({
              header: '❌'+header,
              body: body,
              border: "3px solid red"
            });
          }
          else{
            SetModalContent({
              header: '✅'+header,
              body: body,
              border: "3px solid lightgreen"
            });
          }
        setIsModalOpen(true);
        // Automatically close the modal after 2 seconds
        setTimeout(() => {
            setIsModalOpen(false);
        }, 2000);
    };


    useEffect(() => {
        const fetchCoordinates = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/default',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            });
            const data = await response.json();
            //console.log(data.housecoords)
            setCoordinates(data.coordinates)
            setDefaultCoordinates(data.coordinates)
            setCoordinates(data.coordinates)
            setDefaultHouseCoords(data.housecoords)
            setHouseCoords(data.housecoords)
            setHousecoordsLength(data.housecoords.length)
            setDefaultJunctionCoords(data.junctions)
            setJunctionCoords(data.junctions)
            setWaterReservoirCoords(data.waterReservoirCoords)
            setTreatmentplantCoords(data.waterTreatmentplantCoords)
            // console.log(data.junctions)
            // data.housecoords.forEach(house => {
            //     console.log(house.waterSupplied);
            //   });
            // data.junctions.forEach(junction => {
            //     console.log(junction.waterSupplied);
            //   });
              
            // console.log(defaultcoordinates)
            // console.log(coordinates)
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchCoordinates();
      }, []); // Empty dependency array ensures the effect runs only once


    useEffect(() => {
        const getID = async() =>{
            const response = await fetch("http://localhost:5000/api/getID",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            const data = await response.json()
            // console.log(data)
            setID(data.ID)
        } 
        getID()
    },[])

    async function requestWater(){

    }

    async function submitComplaints(event){
        event.preventDefault()
        try{
        const response = await fetch('http://localhost:5000/api/mapCust/:ID',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                description,
            }),
        })
        const data = await response.json()
        console.log(data)
        if(data){
            openModal(data.status,data.message)
        }
        } catch (error) {
            console.error("Error: ",error)
        }    
    }
    
    if (!isLoaded){
        return "Loading"
    }
    return(
        <div className='map' style={{backgroundImage : `url(${bg})`,  
        backgroundSize: 'cover',
        
        backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        height: '150vh',
        width:'100vw',
        opacity: '90%'}}>
        <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'> 
        <img src={logo} style={{width:70,height:70,position:'absolute',left:'10px'}}/>
          <header>
                <nav ref={navRef}>
                  <a href="/#">about us</a>
                  <a href="/#">contact</a>
                  <button className='complaintButton' onClick={requestWater}> REQUEST EXTRA WATER</button>
                  <button className='complaintButton' onClick={()=>setComplaintsModal(true)}> RAISE A COMPLAINT</button>
                </nav>
              </header>
              {/* Profile */}
          <nav className="navbar">
                <div className="App">
                <div className='menu-container' ref={menuRef}>
                    <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                    <img src={user} style={{height:50,width:50}} ></img>
                    </div>

                    <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} style={{zIndex:10}} >
                    <h3>User Profile<br/><h4>ID:{ID}</h4></h3>
                    <ul style={{zIndex:10}}>
                        {/* <DropdownItem img = {user} text = {"My Profile"}/>
                        <DropdownItem img = {edit} text = {"Edit Profile"}/>
                        <DropdownItem img = {inbox} text = {"Inbox"}/>
                        <DropdownItem img = {settings} text = {"Settings"}/>
                        <DropdownItem img = {help} text = {"Helps"}/> */}
                        <DropdownItem img = {logout} text = {"Logout"} onClick={()=>{
                            openModal("Logging out...")
                            setTimeout(()=>{
                                window.location.href="/login"
                            },2000)
                            }}/>
                    </ul>
                    </div>
                </div>
                </div>
            </nav>
          
        </div>
        
    </IconContext.Provider>
        {map && (
                <StandaloneSearchBox
                onLoad={(ref) => {setSearchBox(ref)}}
                onPlacesChanged={onPlacesChanged}
                >
                <input
                    type="text"
                    placeholder="   Search for a location"
                    style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `300px`,
                    height: `32px`,
                    marginTop:'20px',
                    marginLeft:'50px',
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                    position:'absolute',
                    }}
                />
                </StandaloneSearchBox>
            )}
        <Flex 
        position="relative"
        flexdirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
        zIndex="-10">
            {/* Google Map */}
            <GoogleMap 
            center={center} 
            zoom={zoomLevel}
            onZoomChanged={handleZoomChanged}
            mapContainerStyle={{width:"95%", height:"80%",left:"30px",top:"-15px"}}
            options={{
                streetViewControl:false,
                mapTypeControl:false,
                fullscreenControl:false,
                clickableIcons:false,
                styles:[
                    {
                        featureType:"poi",
                        elementType:"labels",
                        stylers:[{visibility:"off"}],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1017FFF' },{weight:1}], // Set the color for roads (blue lines)#4285F4
                    },
                ]
            }}
            onLoad={(map) => setMap(map) }
            onClick={(event) => addMarker(event.latLng)}>

            {/* Displaying markers */}
            {/* {showMarkers && map && <Marker position={origin} />} */}
            
            {housecoords.map((housecoord,index) => (
                <Marker key={index + 1} position={housecoord.hcoords} onClick={() => markerIndex(index,'house')} 
                icon={{
                    url:housecoord.waterSupplied ? GreenHouseMarker : RedHouseMarker,
                    scaledSize:new window.google.maps.Size(20,20)}} /> 
            ))
            }
                
            {/* Displaying junctions */}
            
            {junctioncoords.map((junctioncoord,index) => (
                <Marker key={index + 1} position={junctioncoord.jcoords} onClick={() => markerIndex(index,'junction')} 
                icon={{
                    url:junctionmarker,
                    scaledSize:new window.google.maps.Size(20,20)}} /> 
                ))}

            {waterReservoirCoords.map((waterReservoircoord,index) => (
                <Marker key={index + 1} position={waterReservoircoord} onClick={() => markerIndex(index,'reservoir')} 
                icon={{
                    url:waterreservoir,
                    scaledSize:new window.google.maps.Size(Math.max(20, 100 / Math.pow(2, 17 - zoomLevel)),Math.max(20, 100 / Math.pow(2, 17 - zoomLevel)))}} /> 
                ))}

            {treatmentplantCoords.map((plant,index) => (
                <Marker key={index + 1} position={plant} 
                // onClick={() => markerIndex(index,'reservoir')} 
                icon={{
                    url:treatmentplant,
                    scaledSize:new window.google.maps.Size(Math.max(20, 150 / Math.pow(2, 17 - zoomLevel)),Math.max(20, 150 / Math.pow(2, 17 - zoomLevel)))}} /> 
                ))}


            {/* Draw default polyline */}    
            {defaultcoordinates.map((lineArray,lineIndex) => (
                <Polyline path={lineArray} key={lineIndex} options={{strokeColor:"deepskyblue",strokeOpacity:1,geodesic:true}} />
            ))}
            
            {/* Draw users polylines */}    
            {coordinates.map((lineArray,lineIndex) => (
                <Polyline path={lineArray} key={lineIndex} options={{strokeColor:"deepskyblue",strokeOpacity:1}} />
            ))}
            
            {/* Display InfoWindow when a house is selected */}
            {selectedhouseMarker !== null && (
                <InfoWindow
                position={housecoords[selectedhouseMarker].hcoords}
                onCloseClick={() => setSelectedhouseMarker(null)} // Close InfoWindow when clicked
                >
                {/* Add your content for the InfoWindow */}
                <div>
                    <h3>HOUSE INFORMATION</h3>
                    <p style={{fontSize:15}}> house number : <strong>{housecoords[selectedhouseMarker].CANID}</strong></p>
                    <p style={{fontSize:15}}>USERID:<strong>{housecoords[selectedhouseMarker].userid}</strong></p>
                    <p style={{fontSize:15}}>
                        Water Supply status:{' '}
                        <button style={{
                                color: isHovered ? 'rgb(74, 72, 205)' : 'black',
                                marginLeft: 5,
                            }}
                            onMouseOver={() => setIsHovered(true)}
                            onMouseOut={() => setIsHovered(false)}
                            onClick={() => toggleHouseWaterSupply(selectedhouseMarker)}
                        >
                            {housecoords[selectedhouseMarker].waterSupplied
                                ? 'YES'
                                : 'NO'}
                        </button>
                    </p>
                    <p style={{fontSize:15}}> Junction to house : {housecoords[selectedhouseMarker].assignedJunction}</p>
                    <ButtonGroup>
                        <button style={{
                                color: isHovered ? 'rgb(74, 72, 205)' : 'black',
                                marginLeft: 5,
                            }}
                            onMouseOver={() => setIsHovered(true)}
                            onMouseOut={() => setIsHovered(false)}
                            onClick={() => assignJunctionToHouse(housecoords[selectedhouseMarker])}>
                        ASSIGN JUNCTION
                        </button>
                    </ButtonGroup>
                    {selectedHouseForJunction === housecoords[selectedhouseMarker] && (
                        <div>
                            <h4>Select a Junction</h4>
                            <ButtonGroup>
                                {junctioncoords.map((junction, index) => (
                                    <Button key={index} onClick={() => assignJunctionToSelectedHouse(junction)}>
                                        {junction.JID}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                    )}

                </div>
                </InfoWindow>
            )}

            {/* Display InfoWindow when a junction is selected */}
            {selectedjunctionMarker !== null && (
                <InfoWindow
                position={junctioncoords[selectedjunctionMarker].jcoords}
                onCloseClick={() => setSelectedjunctionMarker(null)} // Close InfoWindow when clicked
                >
                {/* Add your content for the InfoWindow */}
                <div>
                    <h3>JUNCTION INFORMATION</h3>
                    <p> Junction number : {junctioncoords[selectedjunctionMarker].JID}</p>
                    <p> Houses under junction : {junctioncoords[selectedjunctionMarker].houses.join(', ')}</p>
                    <p> 
                        Water supply status:{' '}
                        <button
                            onClick={() => toggleJunctionWaterSupply(selectedjunctionMarker)}
                        >
                            {junctioncoords[selectedjunctionMarker].waterSupplied
                                ? 'YES'
                                : 'NO'}
                        </button>
                    </p>
                </div>
                </InfoWindow>
            )}

            {selectedreservoir !== null && (
            <InfoWindow
                position={waterReservoirCoords[selectedreservoir]}
                onCloseClick={() => setSelectedreservoir(null)} // Close InfoWindow when clicked
            >
                {/* Add content for the InfoWindow */}
                <div>
                <h3>RESERVOIR INFORMATION</h3>
                <p>Water Quantity: {waterQuantity}</p>
                {/* <Button onClick={handleSupplyWater}>Supply Water</Button> */}
                </div>
            </InfoWindow>
            )}


            </GoogleMap> 
        {/* Modal for success message */}
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false}>
                 <ModalOverlay />
                     <ModalContent bg="white" border={modalContent.border} borderRadius="5px" p={10} top={70} left="40%" boxSize="15%">
                     <ModalHeader style={{marginLeft:50}}>{modalContent.header}</ModalHeader>
                        <ModalBody>
                           {modalContent.body}
                        </ModalBody>
                   </ModalContent>
            </Modal>
        {/* Modal for submitting complaint */}
        <Modal isOpen={complaintsModal} onClose={() => setComplaintsModal(false)} blockScrollOnMount={false}>
        <ModalOverlay />
            <ModalContent bg="white" border="2px solid red" borderRadius="5px" p={10} top={120} left="20%" boxSize="60%" style={{height:"75%"}}>
            <ModalCloseButton style={{marginLeft:'97%'}} />
                <ModalHeader style={{marginLeft:'32%',fontWeight:'bold',fontSize:30}}>RAISE A COMPLAINT</ModalHeader>
                <br/>
                <br/>
                <ModalBody>
                <h3>Description : 
                <input 
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder='Enter Your Complaint'
                    type='text' 
                    style={{marginLeft:10,width:'70%',height:'50px'}}
                    />
                </h3>
                <br/>
                <br/>
                <br/>
                <br/>
                <input type='submit' style={{width:'10%',backgroundColor:'skyblue',marginLeft:'90%'}} onClick={submitComplaints} />
                </ModalBody>
            </ModalContent>
        </Modal>
        </Flex>
        </div>
    )
}


function DropdownItem(props){
    return(
      <li className = 'dropdownItem' onClick={props.onClick}>
        <img src={props.img}></img>
        <a> {props.text} </a>
      </li>
    );
  }



export default App
