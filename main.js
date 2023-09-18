var channelID = '';
let live = false;
let alreadySwitched = false;
var kickCheck = 1000;
let platformSwitchBtn = document.getElementById('platformSwitch');
let channelBtn = document.getElementById('channelSelector');

let parentURL = "twitch-viewer-demo.netlify.app"; // for the demo page
// let parentURL = "127.0.0.1"; // for local developement


async function checkStream(channel) {
    try {
        let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
        // console.log("[INFO] Check started...")
        let data = await response.json();
        if(response.status === 200){
            if(data.livestream.is_live == true){
                // console.log("[INFO] Live on KICK");
                return setLive();
            }
        };
        } catch (err ) {
            // console.log("[INFO] Not Live on KICK")
            return setOffline(); 
    }
};

function setLive() {
    live = true;
    kickCheck = 10000;
};

function setOffline() {
    live = false;
    kickCheck = 10000;
};

function switchPlatform() {
    if(platformSwitchBtn.getAttribute('current') === 'twitch') {
        document.getElementById('twitch-player').src = `https://player.kick.com/${channelID}?autoplay=true&muted=false&allowfullscreen=true`;
        document.getElementById('twitch-chat').src = `https://kick-chat.corard.tv/v1/chat?user=${channelID}&font-size=Small&stroke=Off&animate=false&badges=true&commands=false&bots=false`;
        platformSwitchBtn.setAttribute("current", "kick");
        alreadySwitched = true;
    } else if(platformSwitchBtn.getAttribute('current') === 'kick') {
        document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channelID}&enableExtensions=false&muted=false&parent=${parentURL}&player=popout&quality=720p60&volume=0.2`;
        document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channelID}&bots=true&hide_commands=true&size=1&font=2`;
        platformSwitchBtn.setAttribute("current", "twitch");
        alreadySwitched = false;
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
    if (channel != "") {
        channelID = channel
        document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channel}&enableExtensions=false&muted=false&parent=${parentURL}&player=popout&quality=720p60&volume=0.2`;
        document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channel}&bots=true&hide_commands=true&size=1&font=2`;
    } else {
      channel = prompt("Set Channel", "xqc");
      if (channel != "" && channel != null) {
        channelID = channel
        document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channel}&enableExtensions=false&muted=false&parent=${parentURL}&player=popout&quality=720p60&volume=0.2`;
        document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channel}&bots=true&hide_commands=true&size=1&font=2`;
        setCookie("channel", channel, 365);
      }
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


function channelSelector() {
    document.cookie = "channel=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    let channel = prompt("Set Channel", "xqc");
    setCookie("channel", channel, 365);
    checkCookie();
}

checkCookie();
