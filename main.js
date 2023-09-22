var channelID = ''; // channel ID for building the player and chat
let volume = 0.5; // can be "0.1" to "1" for the twitch player
let quality = "720p60";
let live = false; // true if live on Kick.com
let alreadySwitched = false; // false if on twitch player true if on Kick.com player
var kickCheck = 2000; // how often the live check updates for Kick.com (ms)
let platformSwitchBtn = document.getElementById('platformSwitch'); // was a button to change to Kick, now used for determining if player is Twitch or Kick (this is a bad implementation)
let channelBtn = document.getElementById('channelSelector'); 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
document.body.onload = nullCheck;
// Parent url needed for the twitch player embed
let parentURL = "kick-twitch-viewer.netlify.app"; // for the demo page
// let parentURL = "127.0.0.1"; // for local developement

// fuction to check if the channel is live on Kick.com through the API every 2s
async function checkStream(channel) {
    try {
        let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
        // console.log("[INFO] Check started...")
        let data = await response.json();
        if(response.status === 200){
            if(data.livestream.is_live == true){
                return setLive();
            }
        };
        } catch (err ) {
            return setOffline(); 
    }
};

function setLive() {
    live = true;
    // console.log("[INFO] Live on KICK");
};

function setOffline() {
    live = false;
    // console.log("[INFO] Not Live on KICK")
};


// current ui builder solution
function switchPlatform() {
    if(platformSwitchBtn.getAttribute('current') === 'twitch') { // if on Twitch switch to Kick
        buildKick(channelID);
    } else if(platformSwitchBtn.getAttribute('current') === 'kick') { // if on Kick switch to Twitch
        buildTwitch(channelID, quality, volume)
    }
}


function platformCheck() {
    checkStream(channelID);
    if(live){
        if(!alreadySwitched){
            switchPlatform();
        }
    } else if(!live){
        if(alreadySwitched){
            switchPlatform();
        }
    }
}

setInterval(() => {
    platformCheck();
}, kickCheck);


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie() {

    let channel = getCookie("channel");
    if(channel != null || channel != "null"){
        buildTwitch(channel, quality);
        nullCheck();
    } else {
        let selectedChannel = prompt("Set Channel", "xqc");
        channelID = selectedChannel;
        buildTwitch(selectedChannel, quality);
        setCookie("channel", channel, 365);
        nullCheck();
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = `name; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
function channelSelector() {
    deleteCookie("channel=")
    let channel = prompt("Set Channel", "xqc");
    setCookie("channel", channel, 365);
    checkCookie();
}

function buildTwitch(channel, quality, volume) {
    document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channel}&enableExtensions=false&parent=${parentURL}&player=popout&quality=${quality}&volume=${volume}&muted=false`;
    document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channel}&bots=true&hide_commands=true&size=1&font=2`;
    platformSwitchBtn.setAttribute("current", "twitch");
    alreadySwitched = false;
    channelID = channel;
}

function buildKick(channel) {
    document.getElementById('twitch-player').src = `https://player.kick.com/${channel}?autoplay=true&muted=false&allowfullscreen=true`;
    document.getElementById('twitch-chat').src = `https://kick-chat.corard.tv/v1/chat?user=${channel}&font-size=Small&stroke=Off&animate=false&badges=true&commands=false&bots=false`;
    platformSwitchBtn.setAttribute("current", "kick");
    alreadySwitched = true;
    channelID = channel;
}


function checkQuery() {
    let channelQuery = urlParams.get("channel");
    let volume = urlParams.get("volume");
    let quality = urlParams.get("quality");
    channelID = channelQuery;
    if(channelQuery == "" || channelQuery == null){
        let c = getCookie("channel");
        channelQuery = c;
        channelID = c;
    }
    if(volume == "" || volume == null || volume == "null") {
        volume = 1;
    };
    if(quality == "" || quality == null || volume == "null") {
        quality = "720p60";
    } else if(quality == "best") {
        quality = "chunked";
    }

    buildTwitch(channelID, quality, volume);
}

if( queryString == "" || queryString == null || queryString == "null") {
    checkCookie();
} else if( queryString != "") {
    checkQuery();
}


async function nullCheck(){
    if(channelID == null || channelID == "null" || channelID == ""){
    buildTwitch("monstercat", "360p30", "0.5")
    }
}