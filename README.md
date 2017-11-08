# game-recommending-bot

## Install Deps

1. Install yarn
1. Install modules: `yarn`

## Local Development

`API_KEY=123456 STEAM_API_KEY=<value> yarn dev`

### Local Dev with Discord Relay for end-to-end testing

Start this repo using the command above.
Bring up a local copy of [Discord Relay](https://github.com/jmoseley/discord-relay).

Add a webhook to discord relay using your bot token, `http://localhost:4000/message/new` and a header `x-api-key` with a value `123456`.
