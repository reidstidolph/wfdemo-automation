'use strict'
// modules
const rest = require('axios')
const readline = require('readline')

// import token and org to cleanup sites from
const apiToken = require('./token.json').token1
const orgId = require('./orgs.json').cleanupOrg

// variables
const restReqConfig = { headers: { Authorization: `Token ${apiToken}` }}
const userInput = readline.createInterface({input: process.stdin,output: process.stdout})
let siteModifySuccesses = 0
let siteModifyFailures = 0
let skipped = 0

// are you sure?
userInput.question(`WARNING: This will modify all sites from org ID ${orgId}. Proceed? (y/n)\n`, async (input)=>{
  if (input != 'y' && input != 'yes') {
    console.log('Site modify canceled. No harm done.')
    process.exit(0)
  } else {

    let org = await getOrg()

    userInput.question(`ARE YOU SURE?\nThis is '${org.name}' we are talking about! Proceed? (y/n)\n`, (input2)=>{
      if (input2 != 'y' && input2 != 'yes') {
        console.log('Site modify canceled. No harm done.')
        process.exit(0)
      } else {
        begin()
      }
      userInput.close()
    })
  }
})

// function for getting org details
async function getOrg(){
  try {
    let response = await rest.get(`https://api.mist.com/api/v1/orgs/${orgId}`, restReqConfig)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

// function for modifying sites
async function modifySite(site) {
  let newVarSettings = {
    network2ndOctet: site.vars.RegionID,
    network3rdOctet: site.vars.SiteID
  }

  try {
    //let response = await rest.put(`https://api.mist.com/api/v1/sites/${site.id}/setting`, {vars:{...site.vars, ...newVarSettings}}, restReqConfig)
    let response = await rest.put(`https://api.mist.com/api/v1/sites/${site.id}/setting`, {vars: newVarSettings}, restReqConfig)

    if (response.status === 200) {
      siteModifySuccesses++
      console.log(`'${site.name}' successfully modified.`)
    } else {
      siteModifyFailures++
      throw 'site modify failed, API returned error code ${response.status}.'
    }

  } catch (error) {
    console.error(error)
  }
}

async function begin() {
  try {
    // fetch sites
    let response = await rest.get(`https://api.mist.com/api/v1/orgs/${orgId}/sites`, restReqConfig)
    let siteData = response.data

    // log message
    console.log(`Retrieved ${siteData.length} sites.`)

    // modify sites
    for (const site of siteData) {
      if (site.vars && site.vars.RegionID && site.vars.SiteID) {
        await modifySite(site)
      } else {
        console.log(`skipping site ${site.name}`)
        skipped++
      }
    }
  

    console.log(`\nsite modify report: ${siteModifySuccesses} succeeded, ${siteModifyFailures} failed, ${skipped} skipped.\n`)

  } catch (error) {
    // handle error
    console.error(error)
  }
}
