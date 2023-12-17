import {React,useState,useEffect} from 'react';
import { useJsApiLoader, GoogleMap, Marker, Polyline, InfoWindow } from "@react-google-maps/api";
import {Flex,Box,HStack,Text,Button,ButtonGroup,Input, position} from "@chakra-ui/react";
// import {AdvancedMarker,Pin} from '@vis.gl/react-google-maps' 
import GreenHouseMarker from './greenhousemarker.jpeg'
import RedHouseMarker from './redhousemarker.jpeg'
import './App.css'


function App()
{
    const origin = { lat: 16.82365305593255, lng: 78.36275955215761 };
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:"AIzaSyB6IhzjbQp_KS4lsGdGWq3TvMgMdngijQU",
    })
    const [ map, setMap] = useState('')
    const [coordinates, setCoordinates] = useState([])
    const [showMarkers, setShowMarkers] = useState(true)
    const [ center, setCenter] = useState(origin)
    const [ selectedMarker, setSelectedMarker] = useState(null)
    const [ defaultcoordinates, setDefaultCoordinates ] = useState([])
    const [ housecoords, setHouseCoords ] = useState([])

    function addMarker(pos){
        setCoordinates((prevCoordinates) => [...prevCoordinates, pos])
        
    }

    function houseMarker(pos){
        setHouseCoords((prevHouseCoords) => [...prevHouseCoords,pos])
    }

    function toggleMarkerVisibility() {
        setShowMarkers((prevVisibility) => !prevVisibility);
    }

    function deleteLastLine(){
        if (coordinates.length > 0 && coordinates.length > defaultcoordinates.length){
            const newCoordinates = [...coordinates]
            newCoordinates.pop()
            setCoordinates(newCoordinates)
        }
    }

    const markerIndex = (index) => {
        setSelectedMarker(index)
    }

    useEffect(() => {
        const fetchCoordinates = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/import',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            });
            const data = await response.json();
            console.log(data)
            setCoordinates(data.coordinates)
            setDefaultCoordinates(data.coordinates)
            setHouseCoords(data.housecoords)
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
            }),
        })
        const data = await response.json()
        // console.log(data); 
        } catch (error) {
            console.error('Error submitting coordinates:', error);
        }    
    }

    if (!isLoaded){
        return "Loading"
    }
    return(
        <div className='map'>
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
                ]
            }}
            onLoad={(map) => setMap(map) }
            onClick={(event) => addMarker(event.latLng)}
            onRightClick={(event) => houseMarker(event.latLng)}>


            {/* Displaying markers */}
            {/* {showMarkers && map && <Marker position={origin} />} */}
            
            {housecoords.map((housecoord,index) => (
                <Marker key={index} position={housecoord} onClick={() => markerIndex(index)} 
                icon={{
                    url:GreenHouseMarker,
                    scaledSize:new window.google.maps.Size(20,20)}} /> 
                ))}

            {/* {showMarkers && coordinates.map((coordinate, index) => (
                <Marker key={index} position={coordinate} />
            ))} */}
            
            {/* Draw polyline */}
            {coordinates.length>1 && <Polyline path={coordinates} options={{strokeColor:"deepskyblue",strokeOpacity:1}} />}

            {/* Display InfoWindow when a marker is selected */}
            {selectedMarker !== null && (
                <InfoWindow
                position={housecoords[selectedMarker]}
                onCloseClick={() => setSelectedMarker(null)} // Close InfoWindow when clicked
                >
                {/* Add your content for the InfoWindow */}
                <div>
                    <h3>Marker Information</h3>
                    <p>You have selected marker number {selectedMarker}</p>
                </div>
                </InfoWindow>
            )}


            </GoogleMap> 
        <Box
        position='absolute'
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='skyblue'
        shadow='base'
        minW='container.md'
        zIndex='modal'
        w='50%'
        h='7%'
        top="5%"            
        left="65%"           
        transform="translate(-50%, -50%)"
        >
        <HStack spacing={4}>
        <ButtonGroup height="100%">
            <Button bgColor="white" position="absolute" type="button" height="50%" 
            width="20%" >
            Draw new line
            </Button>
            <Button bgColor="white" position="absolute" type="button" height="50%"
             width="20%" left="20%" onClick={toggleMarkerVisibility}>
            {showMarkers ? 'Hide Markers' : 'Show Markers'}
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="40.5%" height="50%" width="20%" onClick={deleteLastLine}>
            Delete last line
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="61%" height="50%" width="20%" onClick={submitCoordinates}>
            Submit
            </Button>
        </ButtonGroup>
        </HStack>
        </Box>
        </Flex>
        </div>
    )
}


export default App