const ig = require('instagram-scraping');
const cheerio = require('cheerio'); // npm install cheerio
const request = require('request'); // npm install request
const fs = require('fs')
const readlineSync = require('readline-sync');


var userName = readlineSync.question('For what tag we scrape');


var download = function(uri, filename, callback){
  request.head(uri, async function(err, res, body){
    console.log('content-type:', res);
    console.log('content-length:', res);

    await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

ig.scrapeTag(userName).then(result => {
  console.log(result.medias.length)
  for (var i = 0; i < result.medias.length; i++) {

        if (result.medias[i].is_video) {
          
        var URL = 'https://www.instagram.com/p/'+result.medias[i].shortcode; 
        
        request(URL, async function (error, response, body) {

          const $ = await cheerio.load(body);
          const videoTag = $('meta[property="og:video"]').attr('content'); // through meta tag
          let fileName = videoTag.substr(-10) + '.mp4'

          /*

            HERE YOU CAN INSERT VIDEOS IN DATABAE

          */


          download(videoTag, './public/videos/'+fileName, function(){
            console.log('done')
          })
        });


        }else {

          let fileName = result.medias[i].display_url.substr(-10) + '.png'

          /*

            HERE YOU CAN INSERT IMAGES IN DATABAE

          */

          download(result.medias[i].display_url, './public/images/'+fileName, function(){
            console.log('done')
          })
        }
  }
});