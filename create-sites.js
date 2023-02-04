'use strict'
// modules
const rest = require('axios')

// import token and org to import to
const apiToken = require('./token.json')
const orgId = require('./orgs.json').importOrg
const templates = require('./templates.json')
const siteData = require('./sites.json')
const siteGroups = require('./site-groups.json')

// variables
var restReqConfig = { headers: { Authorization: `Token ${apiToken.token1}` }}
var siteCreateAttempts = 0
var siteCreateSuccesses = 0
var siteCreateFailures = 0

// site create function
async function createSite(site) {

  siteCreateAttempts++

  try {
    // POST https://api.mist.com/api/v1/orgs/${orgId}/sites to create new site
    let newSite = await rest.post(`https://api.mist.com/api/v1/orgs/${orgId}/sites`, site, restReqConfig)
    // PUT https://api.mist.com/api/v1/sites/${siteId}/setting to update site settings
    await rest.put(`https://api.mist.com/api/v1/sites/${newSite.data.id}/setting`, {vars:site.vars}, restReqConfig)

    siteCreateSuccesses++
    console.log(`'${newSite.data.name}' site create success!`)

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
      timezone: site.timezone,
      vars : {
        RegionID : `${site.network2ndOctet}`,
        SiteID : `${site.network3rdOctet}`
      }
    }

    // match and set template based on site type
    if (templates[site.type]) {
      siteConfig = {
        ...siteConfig,
        ...templates[site.type]
      }
    }

    // match and set sitegroups based on region
    if (siteGroups[site.region]) {
      siteConfig.sitegroup_ids = [ siteGroups[site.region] ]
    }
    
    await createSite(siteConfig)
    // console.log(siteConfig)
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
