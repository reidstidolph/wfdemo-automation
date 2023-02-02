'use strict'

const fs = require('fs')
var inputData = require('./sites.json')
const outputData = './sites-updated.json'

/*
var datacenterCount = 6
var largeCount = 100
var smallCount = 3000

var siteData = []

var kioskKeys = [...Array(6000).keys()]
var datacenterKeys = []
var largeKeys = []
var smallKeys = []

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function removeFromKiosk(siteKey){
  let index = kioskKeys.indexOf(siteKey)
  if (index > -1) {
    kioskKeys.splice(index, 1)
  }
}

for (let i = 0; i < datacenterCount; i++) {
  let dcNumber = getRandom(0, kioskKeys.length)
  datacenterKeys.push(kioskKeys[dcNumber])
  removeFromKiosk(kioskKeys[dcNumber])
}

for (let i = 0; i < largeCount; i++) {
  let largeNumber = getRandom(0, kioskKeys.length)
  largeKeys.push(kioskKeys[largeNumber])
  removeFromKiosk(kioskKeys[largeNumber])
}

for (let i = 0; i < smallCount; i++) {
  let smallNumber = getRandom(0, kioskKeys.length)
  smallKeys.push(kioskKeys[smallNumber])
  removeFromKiosk(kioskKeys[smallNumber])
  //console.log(`length: ${kioskKeys.length}`)
}

console.log(`dc: ${datacenterKeys.length}, large: ${largeKeys.length}, small: ${smallKeys.length}, kiosk: ${kioskKeys.length}`)

for (const key of datacenterKeys) {
  inputData[key].gatewaytemplate_id = templateIds.datacenter.wan
  inputData[key].name = `${inputData[key].name} - Data Center`
}

for (const key of largeKeys) {
  inputData[key].gatewaytemplate_id = templateIds['large-branch'].wan
  inputData[key].rftemplate_id = templateIds['large-branch'].rf
  inputData[key].name = `${inputData[key].name} - Large Branch`
}

for (const key of smallKeys) {
  inputData[key].gatewaytemplate_id = templateIds['small-branch'].wan
  inputData[key].rftemplate_id = templateIds['small-branch'].rf
  inputData[key].name = `${inputData[key].name} - Small Branch`
}

for (const key of kioskKeys) {
  inputData[key].gatewaytemplate_id = templateIds['kiosk'].wan
  inputData[key].rftemplate_id = templateIds['kiosk'].rf
  inputData[key].name = `${inputData[key].name} - Kiosk`
}

console.log(inputData)

*/

let manipData = inputData.map((site)=>{

  let pattern = /(?<kiosk>Kiosk)|(?<smallBranch>Small Branch)|(?<largeBranch>Large Branch)|(?<dataCenter>Data Center)$/
  let results = site.name.match(pattern).groups
  let manipData = {
    name: site.name,
    country_code: site.country_code,
    address: site.address,
    latlng: site.latlng,
    timezone: site.timezone
  }

  if (results.dataCenter) {
    manipData.type = "dataCenter"
  } else if (results.largeBranch) {
    manipData.type = "largeBranch"
  } else if (results.smallBranch) {
    manipData.type = "smallBranch"
  } else if (results.kiosk) {
    manipData.type = "kiosk"
  } else {
    console.log(site)
  }

  return manipData
})

//console.log(manipData)

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