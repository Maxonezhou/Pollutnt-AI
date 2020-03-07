import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Beacon from './components/Beacon';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCxkOPS5DqnXak4ecDbuPrNKJ-fK4Xc868",
  authDomain: "hacktech2020-88888.firebaseapp.com",
  databaseURL: "https://hacktech2020-88888.firebaseio.com",
  projectId: "hacktech2020-88888",
  storageBucket: "hacktech2020-88888.appspot.com",
  messagingSenderId: "562008011322",
  appId: "1:562008011322:web:ff933e53757c12fd84fb03"
};

firebase.initializeApp(firebaseConfig);
export var database = firebase.database();

export default function App() {
  const [data, setData] = useState(0);
  const heatMapData = {    
    positions: [
      {lat: 59.95, lng: 30.33, weight: 2},
      {lat: 60, lng: 30.5, weight: 1}
    ],
    options: {   
      radius: 300,   
      opacity: 0.6,
    }
  }

  useEffect(() => {
    const dataRef = firebase.database().ref('Data');
    dataRef.on('value', (snapshot) => {
      let value = snapshot.val();
      setData(value);
      
    })
  }, []);

  return (
    <div style={{ position: 'absolute', top: '10%', left: '5%', height: '80%', width: '90%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBWSzeSPr_5zD53xEs0CU0UTOVYsOb6FvA'}}
        defaultCenter={{
          lat: 59.95,
          lng: 30.33
        }}
        options={{ scrollwheel: false }}
        heatmapLibrary={true}          
        heatmap={heatMapData}   
        zoom={11}
      >
        <Beacon 
          lat={59.95}
          lng={30.33}
          data={Object.values(data)}
        />
      </GoogleMapReact>
    </div>
  );
}
