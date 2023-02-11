'use strict'
// modules
const rest = require('axios')

// import token
const apiToken = require('./token.json').token

const siteData = require('./sites-ipam.json')

// variables
var restReqConfig = { headers: { token: apiToken }}

// get subnets
async function getSubnets(){
  try {

    let subnets = await rest.get('http://fremont.reidlab.com:8088/api/automation/subnets', restReqConfig)
    console.log(subnets.data)

  } catch (error) {
    
    console.error(error)

  }
}

// create subnet
/*
Example subnet object:
    {
      subnet: '172.28.0.0',
      mask: '24',
      sectionId: '1',
      description: 'branch1',
      linked_subnet: null,
      firewallAddressObject: null,
      vrfId: null,
      masterSubnetId: '18',
      allowRequests: '0',
      vlanId: null,
      showName: '1',
      device: null,
      pingSubnet: '0',
      discoverSubnet: '0',
      resolveDNS: '0',
      DNSrecursive: '0',
      DNSrecords: '0',
      nameserverId: '0',
      scanAgent: '0',
      customer_id: null,
      isFolder: '0',
      isFull: '0',
      isPool: '0',
      threshold: '0',
      location: []
    }
*/
async function createSubnet(subnet){
  try {

    let subnets = await rest.post('http://fremont.reidlab.com:8088/api/automation/subnets', subnet, restReqConfig)
    return(subnets.data)

  } catch (error) {
    
    console.error(error)

  }
}

async function generateSites(){

  for (const site of siteData) {

    // create parent subnet
    let parentNetwork = {
      subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.0`,
      mask: '24',
      sectionId: '1',
      description: site.name,
      linked_subnet: null,
      firewallAddressObject: null,
      vrfId: null,
      masterSubnetId: '18',
      allowRequests: '0',
      vlanId: null,
      showName: '1',
      device: null,
      pingSubnet: '0',
      discoverSubnet: '0',
      resolveDNS: '0',
      DNSrecursive: '0',
      DNSrecords: '0',
      nameserverId: '0',
      scanAgent: '0',
      customer_id: null,
      isFolder: '0',
      isFull: '0',
      isPool: '0',
      threshold: '0',
      location: []
    }

    let parent = await createSubnet(parentNetwork)
    //console.log(parent)

    // create child subnets
    let childNetworks = [
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.0`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch Corp Users`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '3',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.32`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch Tellers`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '4',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.64`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch Advisors`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '5',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.96`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch Managers`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '6',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.128`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} ATM`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '7',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.160`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Voice`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '8',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.192`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch IoT`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '9',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      },
      {
        subnet: `10.${site.network2ndOctet}.${site.network3rdOctet}.224`,
        mask: '27',
        sectionId: '1',
        description: `${site.name} Branch Server`,
        linked_subnet: null,
        firewallAddressObject: null,
        vrfId: null,
        masterSubnetId: parent.id,
        allowRequests: '0',
        vlanId: '10',
        showName: '1',
        device: null,
        pingSubnet: '0',
        discoverSubnet: '0',
        resolveDNS: '0',
        DNSrecursive: '0',
        DNSrecords: '0',
        nameserverId: '0',
        scanAgent: '0',
        customer_id: null,
        isFolder: '0',
        isFull: '1',
        isPool: '1',
        threshold: '0',
        location: []
      }
    ]

    for (const childNetwork of childNetworks) {
      let child = await createSubnet(childNetwork)
      console.log(child)
    }
  }
}


//getSubnets()
generateSites()