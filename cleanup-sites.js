'use strict'
// modules
const rest = require('axios')
const readline = require('readline')

// import token and org to cleanup sites from
const apiToken = require('./token.json').token2
const orgId = require('./orgs.json').cleanupOrg

// variables
const restReqConfig = { headers: { Authorization: `Token ${apiToken}` }}
const userInput = readline.createInterface({input: process.stdin,output: process.stdout})
let siteDeleteSuccesses = 0
let siteDeleteFailures = 0

// are you sure?
userInput.question(`WARNING: This will delete all sites from org ID ${orgId}. Proceed? (y/n)\n`, async (input)=>{
  if (input != 'y' && input != 'yes') {
    console.log('Site delete canceled. No harm done.')
    process.exit(0)
  } else {

    let org = await getOrg()

    userInput.question(`ARE YOU SURE?\nThis is '${org.name}' we are talking about! Proceed? (y/n)\n`, (input2)=>{
      if (input2 != 'y' && input2 != 'yes') {
        console.log('Site delete canceled. No harm done.')
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

// function for deleting sites
async function deleteSite(site) {
  try {
    let response = await rest.delete(`https://api.mist.com/api/v1/sites/${site.id}`, restReqConfig)

    if (response.status === 200) {
      siteDeleteSuccesses++
      console.log(`'${site.name}' successfully deleted.`)
    } else {
      siteDeleteFailures++
      throw 'site delete failed, API returned error code ${response.status}.'
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

    // delete sites
    for (const site of siteData) {
      // skip default primary site
      if (site.name != "Primary Site") {
        await deleteSite(site)
      }
    }

    console.log(`\nsite deletion report: ${siteDeleteSuccesses} succeeded, ${siteDeleteFailures} failed.\n`)

  } catch (error) {
    // handle error
    console.error(error)
  }
}
