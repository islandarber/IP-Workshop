import { useState, useEffect } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function App() {
  const myIP = import.meta.env.VITE_MYIP_KEY;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [info, setInfo] = useState({});

  
  const getIp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${myIP}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      console.log(err);
      setLoading(false);
      throw err;
    }
  };
  
  useEffect(() => {
    getIp()
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, []);
  
   

  const getInfo = async () => {
    try {
      if (data.location) { const country = data.location.country;
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
      const info = await response.json();
      return info;
      }
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  }

  useEffect(() => {
    getInfo()
    .then(info => setInfo(info[0]))
    .catch(err => console.log(err));
  }, [data]);
  

  const date = new Date();
const dateString = date.toLocaleDateString();
const timeString = date.toLocaleTimeString();
const timeLA = date.toLocaleTimeString('en-US', {timeZone: 'America/Los_Angeles'});


  return (
    <>
      <div>
        <div className='date-time'>
          <h1>IP Address Tracker</h1>
          <p>The date is : {dateString}</p>
          <p>Local Time : {timeString}</p>
          <p>Time in Los Angeles cause I know you were wondering 😉: {timeLA}</p>
        </div>
        
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <div className='Results'>
            <p>IP : {data.ip}</p>
            <p>ISP :{data.isp}</p>
            {data.location ? (
                <div className='data_map'>
                  <div className='Data'>
                    <p>{data.location.city}</p>
                    <p>{data.location.region}</p>
                    <p>{data.location.country}</p>
                    <p>{data.location.postalCode}</p>
                    {info &&
                    <div>
                      {info.altSpellings && <p>You are in the country : {info.altSpellings[1]} {info.flag}</p>}
                      <p>With the CAPITAL: {info.capital}</p>
                    </div>}
                  </div>
                <MapContainer center={[data.location.lat, data.location.lng]} zoom={13} scrollWheelZoom={true} className='map'>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[data.location.lat, data.location.lng]}>
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <p>Location data not available</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
