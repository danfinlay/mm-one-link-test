var detect = require('detect-browser').detect
const qs = require('qs')
var isMobile = !!detectMobile()
const STORAGE_KEY = 'REDIRECT_INFO_LINK_DATA'

// Example URL:
// http://danfinlay.com/mm-onboard-test?a=https%3A%2F%2Fmetamask.io
// Should redirect to https://metamask.io


// Store links
const chromeLink = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
const firefoxLink = 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/'
const operaLink = 'https://addons.opera.com/en/extensions/details/metamask/'

if (typeof window.ethereum === 'undefined') {
  installMetaMask()
} else {
  redirectAndClose()
}

function installMetaMask() {
  const isMobile = detectMobile()
  if (isMobile) {
    render(`This proof of concept only handles desktop, Bruno's code would handle this.`)
  } else {
    storeRedirectInfo()
    openRelevantStore()
  }
}

function storeRedirectInfo() {
  const queryString = window.location.href.split('?')[1]
  const linkInfo = qs.parse(queryString)
  const serialized = JSON.stringify(linkInfo)
  localStorage[STORAGE_KEY] = serialized
  return serialized
}

function openRelevantStore() {
  const storeLink = getStoreLink()
  window.location.href = storeLink
}

function redirectAndClose() {
  const serializedLinkData = localStorage[STORAGE_KEY] || storeRedirectInfo()
  const linkData = JSON.parse(serializedLinkData)

  if ('a' in linkData) {
    render('We could call watchAsset here fyi, or redeem a token')
    const link = linkData.a
    window.location.href = link
  }
}

function render (text) {
  message.innerText = text
}

function getStoreLink (){
  const browser = detect()

  // Touch the web3 object to trigger Brave install prompt
  typeof window.web3

  switch (browser.name) {
    case 'firefox':
      return firefoxLink
      break
    case 'opera':
      return operaLink
      break
    default:
      return chromeLink
  }
}

function detectMobile() {
  return (
      navigator.userAgent.match(/Android/i)
   || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone/i)
   || navigator.userAgent.match(/iPad/i)
   || navigator.userAgent.match(/iPod/i)
   || navigator.userAgent.match(/BlackBerry/i)
   || navigator.userAgent.match(/Windows Phone/i)
  )
}
