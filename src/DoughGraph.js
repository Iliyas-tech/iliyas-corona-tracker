import React, { useState, useEffect } from 'react'
import {Doughnut} from 'react-chartjs-2'

function DoughGraph({cases, recovered, deaths, countryName}) {
    return (
        
        <Doughnut 
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
                title:{display:true, text:`Representation in ${countryName ? countryName : 'World'}`}
            }}
        />
    )
}

export default DoughGraph

