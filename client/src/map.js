import {React,useState,useEffect} from 'react';
import { useJsApiLoader, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import {Flex,Box,HStack,Text,Button,ButtonGroup,Input} from "@chakra-ui/react";
// import {AdvancedMarker,Pin} from '@vis.gl/react-google-maps' 



function App()
{
    const origin = { lat: 17.39763609879129, lng: 78.49017952657705 };
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:"AIzaSyB6IhzjbQp_KS4lsGdGWq3TvMgMdngijQU",
    })
    const [ map, setMap] = useState('')
    const [coordinates, setCoordinates] = useState([])
    const [showMarkers, setShowMarkers] = useState(true)

    function addMarker(pos){
        setCoordinates((prevCoordinates) => [...prevCoordinates, pos]);
        return <Marker position={pos}/>
    }

    function toggleMarkerVisibility() {
        setShowMarkers((prevVisibility) => !prevVisibility);
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
            setCoordinates(data);
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
                coordinates
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
        <Flex 
        position="relative"
        flexdirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
        backgroundColor="white">
        <Box position='absolute' left={0} top={80} h="100%" w="100%" >
            {/* Google Map */}
            <GoogleMap 
            center={origin} 
            zoom={15}
            mapContainerStyle={{width:"80%", height:"80%",left:"150px",top:"0"}}
            onLoad={(map) => setMap(map) }
            onClick={(event) => addMarker(event.latLng)}>

            <div>
                {coordinates && coordinates.map((coordinate, index) => (
                    <div key={index}>
                    Latitude: {coordinate.lat}, Longitude: {coordinate.lng}
                    </div>
                ))}
                </div>

            {/* Displaying markers */}
            {showMarkers && map && <Marker position={origin} />}
            {showMarkers && coordinates.map((coordinate, index) => (
                <Marker key={index} position={coordinate} />
            ))}

            {/* Draw polyline */}
            {coordinates.length>1 && <Polyline path={coordinates}/>}

            </GoogleMap> 
            </Box>
        <Box
        position='absolute'
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='skyblue'
        shadow='base'
        minW='container.md'
        zIndex='modal'
        w='40%'
        h='7%'
        top="5%"            
        left="70%"           
        transform="translate(-50%, -50%)"
        >
        <HStack spacing={4}>
        <ButtonGroup height="100%">
            <Button bgColor="white" position={"absolute"} type="button" height="50%"
             width="30%" onClick={toggleMarkerVisibility}>
            {showMarkers ? 'Hide Markers' : 'Show Markers'}
            </Button>
            <Button bgColor="white" position="absolute" type="submit" 
            left="30%" height="50%" width="30%" onClick={submitCoordinates}>
            Submit
            </Button>
        </ButtonGroup>
        </HStack>
        </Box>
        </Flex>
    )
}


export default App