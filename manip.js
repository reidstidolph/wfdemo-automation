'use strict'

const fs = require('fs')
var inputData = require('./sites.json')
const outputData = './sites-updated.json'

let next2ndOctet = 0
let next3rdOctet = 1

let manipData = inputData.map((site, index)=>{

  //let pattern = /(?<kiosk>Kiosk)|(?<smallBranch>Small Branch)|(?<largeBranch>Large Branch)|(?<dataCenter>Data Center)$/
  let addressPattern = /.+, (?<city>.+), (?<state>[A-Z]{2}) \d{5}, .+/
  let namePattern = /^(?<number>\d{5})/
  let results = site.address.match(addressPattern).groups
  let numberResults = site.name.match(namePattern).groups.number

  let region

  if (site.latlng.lng < -104) {
    region = 'WEST'
  } else if (site.latlng.lng >= -104 && site.latlng.lng < -84) {
    region = 'CENTRAL'
  } else if (site.latlng.lng >= -84) {
    region = 'EAST'
  }
  
  let manipData = {
    name: `${numberResults}_${results.city.toLowerCase().replace(/\s/g, '')}_${results.state}`,
    country_code: site.country_code,
    address: site.address,
    latlng: site.latlng,
    timezone: site.timezone,
    type: site.type,
    region: region,
    network2ndOctet: next2ndOctet,
    network3rdOctet: next3rdOctet
  }

  if (next3rdOctet === 255) {
    next3rdOctet = 0
    next2ndOctet++
  } else {
    next3rdOctet++
  }

  //console.log(manipData)

  return manipData
})


function writeToFile(path, contentString){
  return new Promise((resolve, reject) => {
    fs.writeFile(path, contentString, {mode: 0o600,encoding: 'utf8'}, (err) => {
      if (err) { reject(err) }
      else { resolve() }
    })
  })
}

async function writeData(){
  await writeToFile(outputData, JSON.stringify(manipData, null, 2))
}

writeData()
