var pathFn = require('path');
var fs = require('fs');
var { google } = require("googleapis");
var request = require('request');

module.exports = function (args) {
    const { config, log } = this;
    const { url_submission, url } = config;
    const extName = 'url_submission: ';

    const { google_key, urls_path, channel, sitemap, proxy } = url_submission;
    let key = {}
    let urls = []
    try {
        key = require(pathFn.join(this.base_dir, google_key)) || JSON.parse(process.env.GOOGLE_KEY);
    } catch (error) {
        log.error(extName.concat('Google key file not exist.'))
        return
    }

    if (proxy !== '') {
        process.env.HTTPS_PROXY = proxy
        process.env.HTTP_PROXY = proxy
    }

    if (0 === Object.keys(key).length || channel.indexOf('google') === -1) {
        log.error(extName.concat("Google submiter off."))
        return
    }

    try {
        let UrlsFile = pathFn.join(this.public_dir, urls_path)
        urls = fs.readFileSync(UrlsFile, 'utf8').split(/[(\r\n)\r\n]+/)
        urls.forEach((item, index) => {
            if (!item) {
                urls.splice(index, 1)
            }
        })
        urls = Array.from(new Set(urls))
    } catch (error) {
        log.error(extName.concat('Extract url file failed.'))
        return
    }

    log.info(extName.concat("Submitting urls to google engine..."))

    // Part.1 Indexing API
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ["https://www.googleapis.com/auth/indexing"],
        null
    );

    const items = urls
        .filter(x => x)
        .map(line => {
            return {
                'Content-Type': 'application/http',
                body:
                    'POST /v3/urlNotifications:publish HTTP/1.1\n' +
                    'Content-Type: application/json\n\n' +
                    JSON.stringify({
                        url: line,
                        type: 'URL_UPDATED',
                    }),
            };
        });
      
    jwtClient.authorize(function(err, tokens) {
        if (err) {
            log.error(extName.concat('Submit to google engine error: ', err))
            return
        }
        let options = {
            url: 'https://indexing.googleapis.com/batch',
            method: "POST",
            headers: {
                'Content-Type': 'multipart/mixed; '
            },
            auth: { "bearer": tokens.access_token },
            multipart: items
        };
        request(options, function (error, response, body) {
            if (!error) {
                let message = ''
                if (response.statusCode === 200) {
                    message = message.concat('success')
                } else {
                    message = message.concat('failed: [', response.error.message, ']')
                }
                log.info(extName.concat("Submit to google engine ", message));
                return
            }
            log.error(extName.concat('Submit to google engine error: ', error))
        });
    });

    // Part.2 Google Ping https://www.google.com/ping?sitemap=
    request('https://www.google.com/ping?sitemap='.concat(url.concat('/', sitemap)), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            log.info(extName.concat("Google Sitemap Notification Received"))
        }
    })

};