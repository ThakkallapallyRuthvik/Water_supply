import {React,useState,useEffect} from 'react';
import { useJsApiLoader, GoogleMap, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import {Flex,Box,HStack,Button,ButtonGroup,Modal,ModalOverlay,ModalContent,ModalHeader,ModalBody,ModalCloseButton} from "@chakra-ui/react";
// import {AdvancedMarker,Pin} from '@vis.gl/react-google-maps' 
import GreenHouseMarker from './greenhousemarker.jpeg'
import RedHouseMarker from './redhousemarker.jpeg'
import junctionmarker from './junctionmarker.jpeg'
import './App.css'


function App()
{
    const origin = { lat: 16.82365305593255, lng: 78.36275955215761 };
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:"AIzaSyB6IhzjbQp_KS4lsGdGWq3TvMgMdngijQU",
    })
    const [ map, setMap] = useState('')
    const [coordinates, setCoordinates] = useState([])
    const [ center, setCenter] = useState(origin)
    const [ selectedhouseMarker, setSelectedhouseMarker] = useState(null)
    const [ selectedjunctionMarker, setSelectedjunctionMarker] = useState(null)
    const [ defaultcoordinates, setDefaultCoordinates ] = useState([])
    const [ housecoords, setHouseCoords ] = useState([])
    const [ defaultHouseCoords, setDefaultHouseCoords ] = useState([])
    const [ junctioncoords , setJunctionCoords] = useState([])
    const [ defaultjunctioncoords , setDefaultJunctionCoords ] = useState([])
    const [selectedHouseForJunction, setSelectedHouseForJunction] = useState(null);
    let [ subcoords, setSubCoords ] = useState([])
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ modalContent, SetModalContent ] = useState({})
    let [ markerFunction, setMarkerFunction ] = useState(1)
    

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
        }else if (markertype == 'junction'){
            setSelectedjunctionMarker(index)
            setSelectedhouseMarker(null)
        }
    };

    
    const openModal = (body) => {
        SetModalContent({
            body:body
        })
        
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
            setDefaultJunctionCoords(data.junctions)
            setJunctionCoords(data.junctions)
            // console.log(data.housecoords)
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
    
    async function submitCoordinates(event){
        event.preventDefault()
        try{

        const response = await fetch('http://localhost:5000/api/map',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                coordinates,
                housecoords,
                junctioncoords,
            }),
        })
        const data = await response.json()
        if(data){
            openModal('✅Submitted succesfully')
        }
        } catch (error) {
            openModal('❌Error submitting coordinates');
            console.error("Error: ",error)
        }      
    }

    if (!isLoaded){
        return "Loading"
    }
    return(
        <div className='map'>
        <Navbar>
            <NavItem icon="Draw New Line" onClick={drawLine} />
            <NavItem icon="House Markers" onClick={houseMarker} />
            <NavItem icon="Junction" onClick={junctionMarker} />
            <NavItem icon="Delete Last Line" onClick={deleteLastLine} />
            <NavItem icon="Delete Last House" onClick={deleteLastHouse} />
            <NavItem icon="Delete Last Junction" onClick={deleteLastJunction} />
            <NavItem icon="Submit" onClick={submitCoordinates} />
        </Navbar>
        <Flex 
        position="relative"
        flexdirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
        backgroundColor="white">
            {/* Google Map */}
            <GoogleMap 
            center={center} 
            zoom={17}
            mapContainerStyle={{width:"80%", height:"80%",left:"150px",top:"0"}}
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
            {/* onRightClick={(event) => houseMarker(event.latLng)}> */}

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

            {/* {showMarkers && subcoords.map((coords,index) => (
                    <Marker key={index} position={coords} />
                )    
            )} */}

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
                    <p> house number : {housecoords[selectedhouseMarker].CANID}</p>
                    <p>
                        Water Supply status:{' '}
                        <button
                            onClick={() => toggleHouseWaterSupply(selectedhouseMarker)}
                        >
                            {housecoords[selectedhouseMarker].waterSupplied
                                ? 'YES'
                                : 'NO'}
                        </button>
                    </p>
                    <p> Junction to house : {housecoords[selectedhouseMarker].assignedJunction}</p>
                    <ButtonGroup>
                        <button onClick={() => assignJunctionToHouse(housecoords[selectedhouseMarker])}>
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


            </GoogleMap> 
        {/* <Box
        position='absolute'
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='skyblue'
        shadow='base'
        minW='container.md'
        zIndex='modal'
        w='50%'
        h='6%'
        top="5%"            
        left="65%"           
        transform="translate(-50%, -50%)"
        >
        <HStack spacing={4}>
        <ButtonGroup height="100%">
            <Button bgColor="white" position="absolute" type="button" height="50%" 
            width="20%" onClick={drawLine}>
            Draw new line
            </Button>
            <Button bgColor="white" position="absolute" type="button" height="50%"
             width="20%" left="20%" onClick={houseMarker}>
            House Marker
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="40.5%" height="50%" width="20%" onClick={deleteLastLine}>
            Delete last line
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="61%" height="50%" width="19%" onClick={deleteLastHouse}>
            Delete last house
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="80.5%" height="50%" width="18%" onClick={junctionMarker}>
            New Junction
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="99%" height="50%" width="19%" onClick={deleteLastJunction}>
            Delete Last Junction
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="118.25%" height="50%" width="18%" onClick={submitCoordinates}>
            Submit
            </Button>
        </ButtonGroup>
        </HStack>
        </Box> */}
        {/* Modal for success message */}
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blockScrollOnMount={false}>
                 <ModalOverlay />
                     <ModalContent bg="white" border="2px solid lightgreen" borderRadius="5px" p={10} top={70} left="40%" boxSize="15%">
                         {/* <ModalHeader>Success!</ModalHeader> */}
                         {/* <ModalCloseButton width={10} left="50%" /> */}
                        <ModalBody>
                           {modalContent.body}
                        </ModalBody>
                   </ModalContent>
            </Modal>
        </Flex>
        </div>
    )
}


function Navbar(props) {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">{props.children}</ul>
      </nav>
    );
  }
  
  function NavItem({ icon, onClick }) {
    return (
        <li className="nav-item">
            <a href="#" className="icon-button" onClick={onClick}>
                {icon}
            </a>
        </li>
    );
}

export default App