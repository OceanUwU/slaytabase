# ![](static/favicon.ico) slaytabase

invite the bot: https://discord.com/oauth2/authorize?client_id=961824443653574687&permissions=0&scope=bot

## steps for adding/updating mods

1. first time? clone this repo with `git clone https://github.com/OceanUwU/slaytabase --depth=1` (so that you don't download the entire commit history). otherwise just `git pull`
2. download and build the latest version of [my fork of modded spire exporter](https://github.com/OceanUwU/sts-exporter)
3. launch ModTheSpire with BaseMod, my SpireExporter, and the mod(s) you'd like to add/update
4. in SpireExporter's mod config, disable "export vanilla items", and enable "export images"
5. create a directory called `gamedata` in this repo
6. on a profile where no beta art is enabled, create an export and move the `export` directory it creates into `gamedata` in this repo (delete/rename the old `export` if there's already an existing one)
7. if you want to add additional information that's not directly found in item descriptions you may add it to `extraItems.js` (there is a template at the bottom, copy and paste that)
8. (requires [node.js v16+](https://nodejs.org/en/download/)) run `npm install` then `node alterExport.js` (this can take a while depending on how many files there are)

   - if the mod has a gigantic amount of art or if it has AI-generated art or it has art taken from external sources run the script with the `--no-images` flag i.e. `node alterExport.js --no-images`. if youre not sure whether you should do this or not just ask me
9. if you want your custom keywords to have emoji icons, add them to `emojis.js`
10. if the mod contains a character or a custom card colour, add data about them to `characters.js` (the number is a hex code converted to decimal)
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
