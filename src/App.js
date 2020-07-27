import React, {useState, useEffect} from 'react';
import {FormControl, MenuItem, Select, Card, CardContent} from '@material-ui/core'
import InfoBox from './InfoBox'
import Table from './Table'
import LineGraph from './LineGraph'
import Map from './Map'
import './App.css';
import {sortData, prettyPrintStat} from './util'
import 'leaflet/dist/leaflet.css'
import BarGraph from './BarGraph';
import DoughGraph from './DoughGraph';

function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries ] = useState([])
  const [casesType, setCasesType] = useState('cases')

//curl -X GET "https://disease.sh/v3/covid-19/countries" -H "accept: application/json"

useEffect(() => {
  fetch('https://disease.sh/v3/covid-19/all')
  .then(response => response.json())
  .then(data => {
    setCountryInfo(data)
  })
}, [])

useEffect(() => {
  const getCountriesData = async ()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response)=> response.json())
        .then((data)=>{

          const countries = data.map(country =>(
            {
              name:country.country, //INDIA
              value: country.countryInfo.iso2, //IN
            }
          ))
          
          const sortedData = sortData(data)

          setTableData(sortedData)
          //console.log(tableData);
          setMapCountries(data)
          setCountries(countries)
        })
  }
  getCountriesData()
}, [])

const onCountryChange = async (e)=>{
  const countryCode = e.target.value
  // setCountry(countryCode)

  const url = countryCode === 'worldwide' 
  ? 'https://disease.sh/v3/covid-19/all' 
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`

  await fetch(url)
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      setCountry(countryCode)
      //All data from the selected country
      setCountryInfo(data)
      console.log(countryInfo);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    })
}

return (
    <div className="app"> 
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
              <Select variant="outlined" value={country} onChange={onCountryChange}>
                <MenuItem value="worldwide">WorldWide</MenuItem>
                {
                  countries.map(country =>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
              </Select>
          </FormControl>
        </div>
      
        {/* Header */}

        {/* infoboxes total 3 */}
        <div className="app__stats">
          <InfoBox isRed
           active={casesType ==='cases'}
           onClick={e => setCasesType('cases')}
           title="Cases" 
           cases={prettyPrintStat(countryInfo.todayCases)} 
           total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox active={casesType ==='recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox isRed
           active={casesType ==='deaths'}
           onClick={e => setCasesType('deaths')}
           title="Deceased" 
           cases={prettyPrintStat(countryInfo.todayDeaths)} 
           total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
      
        {/* Map */}
          <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
        {/* end of Map */}
        
        <h3 className="app__graphTitle">Worldwide {casesType} Cases</h3>
            <LineGraph casesType={casesType}/>
        {/* BarGraph */}
        <BarGraph countryName={countryInfo.country} cases={countryInfo.cases} recovered={countryInfo.recovered} deaths={countryInfo.deaths} />
        {/* end of BarGraph */}

        {/* Doughtnut Graph */}
        <DoughGraph countryName={countryInfo.country} cases={countryInfo.cases} recovered={countryInfo.recovered} deaths={countryInfo.deaths} />
        
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
