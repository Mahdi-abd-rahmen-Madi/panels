import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './App.css';
import { MapContainer, TileLayer, GeoJSON, LayersControl, LayerGroup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Features style
const featureStyle = {
  weight: 2,
  opacity: 1,
  color: 'yellow',
  fillOpacity: 0.2,
  zIndex: 10,
};

// Feature popup
const onEachFeature = (feature, layer) => {


    layer.options.fillcolor = feature.properties.color;
    const commune = feature.properties.nom;
    const superficie = feature.properties.superficie;
    const Production = feature.properties.prod;
    const classification = feature.properties.prod_class;

    layer.bindPopup (`
        commune: ${commune} <br/>
        superficie: ${superficie}<br/>
        Production en Euro: ${Production}<br/>
        classification: ${classification}<br/>
      `)
 
};

const classificationLabels = {
  low: 'faible',
  high: 'forte',
};



const App = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commune, setCommune] = useState('');
  const [classification, setClassification] = useState('');


  const position = [43.5140, 5.4790];
  const zoom = 15;
  const minzoom = 10;
  const style = { height: "85vh", width: "100vw" };
  const zIndex = 1;

 




  useEffect(() => {
    const fetchGeojson = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/V1/panels/?format=json');
        console.log('Fetched GeoJSON data:', response.data);
        if (response.headers['content-type'] === 'application/json') {
          setGeojsonData(response.data);
          setFilteredData(response.data); // Initialize filteredData with the fetched data
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading GeoJSON data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchGeojson();
  }, []);

  useEffect(() => {
    if (geojsonData) {
      const filtered = {
        ...geojsonData,
        features: geojsonData.features.filter((feature) => {
          const matchesCommune = commune
            ? feature.properties.nom.toLowerCase().includes(commune.toLowerCase())
            : true;
          const matchesClassification = classification
            ? feature.properties.prod_class.value === classification
            : true;
          return matchesCommune && matchesClassification;
        }),
      };
      console.log('Filtered GeoJSON data:', filtered);
      setFilteredData(filtered);
    }
  }, [commune, classification, geojsonData]);



  


  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error loading GeoJSON data: {error.message}</Alert>;
  }

  return (
    <div className="App">
      <div>
        <label>
          Commune:
          <input
            type="text"
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
          />
        </label>
        <label>
          Classification:
          <select
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
          >
            <option value="">All</option>
            <option value="faible">Low Production</option>
            <option value="forte">High Production</option>
          </select>
        </label>
        <div>
    </div>
      </div>

      <MapContainer center={position} zoom={zoom} minZoom={minzoom} style={style} zIndex={zIndex}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Google Maps">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/intl/en/help/terms_maps.html">Google Maps</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="GeoJSON Data">
            <LayerGroup>
              {filteredData && (
                <GeoJSON data={filteredData} style={featureStyle} onEachFeature={onEachFeature} />
              )}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default App;