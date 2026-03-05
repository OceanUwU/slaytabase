# ![](static/favicon.ico) slaytabase

invite the bot: https://discord.com/oauth2/authorize?client_id=961824443653574687&permissions=0&scope=bot

## steps for adding/updating mods


### for slay the spire 1
1. download the latest version of [my fork of modded spire exporter](https://github.com/OceanUwU/sts-exporter/releases)
1. launch ModTheSpire with BaseMod, my SpireExporter, and the mod(s) you'd like to add/update
1. in SpireExporter's mod config, disable "export vanilla items", and enable "export images"
1. make sure your game is on a profile with no beta art enabled
### for slay the spire 2
1. download the latest version of [sts2-exporter](https://github.com/OceanUwU/sts2-exporter/releases) instead
1. launch the game with the mod
1. in the exporter config, disable "Export items from basegame", enable "Export images", set "Base card art type" to Regular, set "Upgraded card art type" to Beta, and disable "Include full texture dump"


### then...
1. first time? clone this repo with `git clone https://github.com/OceanUwU/slaytabase --depth=1` (so that you don't download the entire commit history). otherwise just `git pull`
1. create a directory called `gamedata` in this repo
1. create an export using the mod from your corresponding game version
1. move the `export` directory the mod creates into `gamedata` in this repo (delete/rename the old `export` if there's already an existing one)
1. if you want to add additional information that's not directly found in item descriptions you may add it to `extraItems.js` (there is a template at the bottom, copy and paste that)
1. (requires [node.js v16+](https://nodejs.org/en/download/)) run `npm install` then `node alterExport.js` (this can take a while depending on how many files there are)

   - if the mod has a gigantic amount of art or if it has AI-generated art or it has art taken from external sources run the script with the `--no-images` flag i.e. `node alterExport.js --no-images`. if youre not sure whether you should do this or not just ask me
9. if you want your custom keywords to have emoji icons, add them to `emojis.js`
10. if the mod contains a character or a custom card colour, add data about them to `characters-1.js` or `characters-2.js` depending on the game version (the number is a hex code converted to decimal)
11. make a pull request (make sure you aren't editing any of files of any other mods)

#### requirements for a mod being on the bot:

one of the following must be true:

- it's on the steam workshop
- you are the mod's author
- you have permission from the mod's author for it to be on slaytabase

also, all of the following must be true:

- the mod's author hasn't said something along the lines of "dont put my mod on there please"
- no extreme nsfw

## setup for running/developing the bot

1. `npm ci`
2. install [GraphicsMagick](http://www.graphicsmagick.org/download.html)
3. create `cfg.js` and paste the following in: `export default {"token":"jsdakfhajksdfh", "exportURL": "https://slay.ocean.lol", websitePort: 8622, "overriders": ["106068236000329728"], "mkswtKey": null, "feedbackChannel": "???", "workshopReleasesChannel": null, "packDiscussions": null}` and set `token` as your discord bot token and set `feedbackChannel` as the channel ID of a channel where you want the bot to send feedback messages (can be a thread channel)
4. `npx sequelize-cli db:migrate`
5. `npm start`
