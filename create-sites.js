'use strict'
// modules
const rest = require('axios')

// import token and org to import to
const apiToken = require('./token.json')
const orgId = require('./orgs.json').importOrg
const templates = require('./templates.json')
const siteData = require('./sites.json')

// variables
var restReqConfig = { headers: { Authorization: `Token ${apiToken.token1}` }}
var siteCreateAttempts = 0
var siteCreateSuccesses = 0
var siteCreateFailures = 0

// site create function
async function createSite(site) {

  siteCreateAttempts++

  try {
    // POST https://api.mist.com/api/v1/orgs/${orgId}/sites
    let response = await rest.post(`https://api.mist.com/api/v1/orgs/${orgId}/sites`, site, restReqConfig)
    siteCreateSuccesses++
    console.log(`'${response.data.name}' site create success!`)

  } catch (error) {

    siteCreateFailures++
    console.error(error)
    console.log(`'${site.name}' site create failed.`)

  }
}

async function begin(){

  const start = new Date()

  // iterate through sites and create them
  for (const site of siteData) {

    // swap tokens part way through the job
    if (siteCreateAttempts === 3000) {
      restReqConfig = { headers: { Authorization: `Token ${apiToken.token2}` }}
    }

    let siteConfig = {
      name: site.name,
      country_code: site.country_code,
      address: site.address,
      latlng: site.latlng,
      timezone: site.timezone
    }

    // match type name to template
    if (templates[site.type]) {
      siteConfig = {
        ...siteConfig,
        ...templates[site.type]
      }
    }
    
    await createSite(siteConfig)
  }

  const end = new Date()
  let elapsed = (end.getTime() - start.getTime())/1000

  console.log(`\nsite automation summary:`)
  console.log(`  start:         ${start.toISOString()}`)
  console.log(`  end:           ${end.toISOString()}`)
  console.log(`  runtime:       ${elapsed} seconds`)
  console.log(`  failures:      ${siteCreateFailures}`)
  console.log(`  sites created: ${siteCreateSuccesses}\n`)

}

console.log(`\nImported ${siteData.length} sites.\n`)
begin()
