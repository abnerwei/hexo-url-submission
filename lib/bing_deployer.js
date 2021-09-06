var pathFn = require('path');
var fs = require('fs');
var request = require('request');

module.exports = function (args) {
    const { config, log } = this;
    const { url_submission, url } = config;
    const extName = 'url_submission: ';

    const { bing_token, urls_path, channel } = url_submission;

    const token = bing_token || process.env.BING_TOKEN;

    let urls = []

    if ('' === token || channel.indexOf('bing') === -1) {
        log.error(extName.concat("Bing submiter off."))
        return
    }

    try {
        let UrlsFile = pathFn.join(this.public_dir, urls_path)
        let urls = fs.readFileSync(UrlsFile, 'utf8').split(/[(\r\n)\r\n]+/)
        urls.forEach((item, index) => {
            if (!item) {
                urls.splice(index, 1);
            }
        })
        urls = Array.from(new Set(urls));
    } catch (error) {
        log.error(extName.concat('Extract url file failed.'))
    }

    log.info(extName.concat("Submitting urls to bing engine..."))

    var target = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=" + token;
    request({
        url: target,
        method: 'POST',
        json: {
            "siteUrl": url,
            "urlList": urls
        }
    }, function (error, response, body) {
        if (!error) {
            // Success 200
            /*
            *  {
                    "d": null
                }
            */
            // Failed 400
            /*
            *   {
                    ErrorCode: 2,
                    Message: 'ERROR!!! Quota remaining for today: 10, Submitted: 32'
                }
            */
            let message = ''
            if (response.statusCode === 200) {
                message = message.concat('success')
            } else {
                message = message.concat('failed: [', response.body.Message, ']')
            }
            log.info(extName.concat("Submit to bing engine ", message));
            return
        }
        log.error(extName.concat('Submit to bing engine error: ', error))
    })
};