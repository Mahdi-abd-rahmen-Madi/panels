import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './App.css'
import { MapContainer, TileLayer, Marker, Popup ,GeoJSON, LayersControl, LayerGroup} from "react-leaflet";
import axios from 'axios'
import "leaflet/dist/leaflet.css"
import useSWR from 'swr'
import features from "./data/features.json";



  




// features style

const Featurestyle = {
  weight: 2,
  opacity: 1,
  color: "yellow",
  fillOpacity: 0.20,
  zIndex: 10,
};


// feature popup

const OnEachFeature = (panels, layer) => {
  layer.options.fillcolor = panels.properties.color;
  const commune = panels.properties.nom;
  const superficie = panels.properties.superficie;
  const Production = panels.properties.prod;
  const classification = panels.properties.prod_class;

  layer.bindPopup (`
    commune: ${commune} <br/>
    superficie: ${superficie}<br/>
    Production en Euro: ${Production}<br/>
    classification: ${classification}<br/>
  `)

}

 
// const fetcher = url => axios.get(url).then(res => res.data)

const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {

  const [municipality, setMunicipality] = useState("");
  const [productionClass, setProductionClass] = useState("");
  const {data, error} = useSWR("/api/V1/panels/", fetcher);
  const panels = data && !error ? data : []

  if (error) {
    return <Alert variant="danger">There was an error fetching the data</Alert>
  }
  if (!data) {
    return (
      <Spinner    
      animation='border'
      variant='danger'
      role='status'
      style={{
        width: '300px',
        height: '300px',
        margin: 'auto',
        display: 'block',
      }}
      
      />
    )
  }  
  useEffect(() => {
    axios
      .get("/api/V1/panels/", {
        params: {
          municipality,
          production_class: productionClass,
        },
      })
      .then((response) => {
        setRooftops(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the rooftops!", error);
      });
  }, [municipality, productionClass]);






  const position = [43.5140, 5.4790];
  const zoom = 15;
  const minzoom = 10;
  const style = { height: "80vh", width: "100vw" };
  const zIndex = 1;
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          "/api/V1/panels/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
      }
    };

    fetchGeoJSON();
  }, []); 

  // Render the map

  return (
    <div>
      <div>
        <label>
          Municipality:
          <input
            type="text"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
          />
        </label>
        <label>
          Production Class:
          <select
            value={productionClass}
            onChange={(e) => setProductionClass(e.target.value)}
          >
            <option value="">All</option>
            <option value="low">Low Production</option>
            <option value="high">High Production</option>
          </select>
        </label>
      </div>
      

      
      <MapContainer
        center={position}
        zoom={zoom}
        minZoom={minzoom}
        style={style}
        zIndex={zIndex}
      >
      
      <LayersControl>
      <LayersControl.Overlay checked name="OpenStreetMap">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </LayersControl.Overlay>  
      
      <LayersControl.Overlay checked name="Google Maps">
      <LayerGroup>
        
        <TileLayer 
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        attribution='&copy; <a href="https://www.google.com/intl/en/help/terms_maps.html">Google Maps</a>' 
        />
        <TileLayer 
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />

        </LayerGroup>
      </LayersControl.Overlay>
      </LayersControl>
          
          
      
      <GeoJSON data={features} style={Featurestyle} onEachFeature={OnEachFeature}/> 
     
        
        
        
      </MapContainer>
    </div>
  );
};

export default App

/* geojsonData */
/*
*/


/*  {geojsonData && <GeoJSON data={geojsonData} style={Featurestyle} onEachFeature={OnEachFeature} />} */