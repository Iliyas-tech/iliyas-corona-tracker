import React, { useState, useEffect } from 'react'
import {Bar} from 'react-chartjs-2'

function BarGraph({cases, recovered, deaths, countryName}) {
    return (
        
        <Bar 
            data={{
                labels:['Infected', 'Recovered', 'Deaths'],
                datasets:[{
                    label:'People',
                    backgroundColor:[
                    'rgba(0, 0, 255, 0.6)',
                    'rgba(0, 255, 0,  0.6)',
                    'rgba(255, 0, 0, 0.6)'
                    ],
                
                data:[cases, recovered, deaths],
                }]
            }}
            options={{
                legend:{display:false},
                title:{display:true, text:`Current Situation in ${countryName ? countryName : 'World'}`}
            }}
        />
    )
}

export default BarGraph

