let channelID = 'xqc';
let live = false;
let platformSwitchBtn = document.getElementById('platformSwitch');


async function checkStream(channel) {
    let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
    let data = await response.json();
    if(response.status === 200){
        if(data.livestream.is_live == true){
            return setLive();
        } else { return setOffline()}
    }
};

function setLive() {
    live = true;
};

function setOffline() {
    live = false;
};