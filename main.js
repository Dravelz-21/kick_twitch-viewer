let channelID = 'xqc';
let live = false;
   
async function checkStream(channel) {
    let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
    let data = await response.json();
    if(response.status === 200){
        if(data.livestream.is_live == true){
            return setLive();
        } else { return setOffline()}
    }
}
