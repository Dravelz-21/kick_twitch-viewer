var channelID = 'xqc';
let live = false;
let alreadySwitched = false;
let platformSwitchBtn = document.getElementById('platformSwitch');
let parentURL = "twitch-viewer-demo.netlify.app"; // for the demo page
// let parentURL = "127.0.0.1"; // for local developement

function selectChannel() {
    let alert = prompt("Channel selector", "xqc");
    console.log("Channel selected");
    channelID = alert
    document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channelID}&enableExtensions=false&muted=false&parent=${parentURL}&player=popout&quality=720p60&volume=0.2`;
    document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channelID}&bots=true&hide_commands=true&size=1&font=2`;
};

selectChannel();

async function checkStream(channel) {
    try {
        let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
        console.log("[INFO] Check started...")
        let data = await response.json();
        if(response.status === 200){
            if(data.livestream.is_live == true){
                console.log("[INFO] Live on KICK");
                return setLive();
            }
        };
        } catch (err ) {
            console.log("[INFO] Not Live on KICK")
            return setOffline(); 
    }
};

function setLive() {
    live = true;
};

function setOffline() {
    live = false;
};

function switchPlatform() {
    if(platformSwitchBtn.getAttribute('current') === 'twitch') {
        document.getElementById('twitch-player').src = `https://player.kick.com/${channelID}?autoplay=true&muted=false&allowfullscreen=true`;
        document.getElementById('twitch-chat').src = `https://kick-chat.corard.tv/v1/chat?user=${channelID}&font-size=Small&stroke=Off&animate=false&badges=true&commands=false&bots=false`;
        platformSwitchBtn.setAttribute("current", "kick");
        platformSwitchBtn.style.opacity = 0;
        alreadySwitched = true;
    } else if(platformSwitchBtn.getAttribute('current') === 'kick') {
        document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channelID}&enableExtensions=false&muted=false&parent=${parentURL}&player=popout&quality=720p60&volume=0.2`;
        document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channelID}&bots=true&hide_commands=true&size=1&font=2`;
        platformSwitchBtn.setAttribute("current", "twitch");
        platformSwitchBtn.style.opacity = 0;
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
}, 10000);

