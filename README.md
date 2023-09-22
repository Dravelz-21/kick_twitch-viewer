# Kick and Twitch viewer
Webpage with embedded Twitch & Kick player and chat

[DEMO](https://kick-twitch-viewer.netlify.app)

## Features

- Channel change button top left.
- Automatically switch stream if Kick stream either goes live or offline. (checks the same username that is entered in the prompt.)
- 3rd party chat supports 7TV,BTTV,FFZ emotes.
- Remember selected channel on page load.
- Enter /?channel={channel}&quality={720p60}&volume={0.5} to change channel, quality, volume on page load. Not all 3 prompt is required. Quality change only works with the Twitch player Kick didn't implement this feature yet in their player.
- Early Portrait mode for mobile devices (CSS help welcome). 
- Load [Monstercat](https://twitch.tv/monstercat) stream if no stream is selected.


## Why

Kick's webpage is very heavy, this project aims to minimise cpu usage by embedding the player and making the chat experience better without any 3rd party extension. 

Keep in mind this is a very barebones project but it gets the job done.

## Install

Clone the repo and use a webserver to host it. Keep in mind the twitch player needs HTTPS parent to work except if on 127.0.0.1, use a self signed cert for it.

## Credits

[Giambaj](https://www.giambaj.it/) for the [Twitch chat overlay](https://www.giambaj.it/twitch/jchat/).

[Corard](https://github.com/Corard) for the [Kick chat overlay](https://corard.tv/projects/kick-chat).