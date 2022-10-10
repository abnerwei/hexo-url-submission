const pathFn = require('path')
const fs = require('fs')
const axios = require('axios')

module.exports = function (args) {
    const { config, log } = this
    const { url_submission, url } = config
    const extName = 'url_submission: '

    const { bing_token, urls_path, channel } = url_submission

    const token = bing_token || process.env.BING_TOKEN

    let urls = []

    if ('' === token || channel.indexOf('bing') === -1) {
        log.error(extName.concat("Bing submitter off."))
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
    log.info(extName.concat("Submitting urls to bing engine..."))
	
	const target = "/webmaster/api.svc/json/SubmitUrlbatch?apikey=" + token
	axios.create().request({
		url: target,
		baseURL: 'https://ssl.bing.com',
        method: 'POST',
		headers: {'Content-Type': 'application/json'},
        data: {
            "siteUrl": url,
            "urlList": urls
        },
        validateStatus: function (status) {
            return status <= 400
        }
    }).then(function (response) {
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
                const respJson = response.data
        if (response.status === 200) {
            message = message.concat('success')
        } else {
            message = message.concat('failed: [', respJson.Message, ']')
        }
        log.info(extName.concat("Submit to bing engine ", message))
	}).catch(function (error) {
		log.error(extName.concat('Submit to bing engine error: ', error))
	})
}
