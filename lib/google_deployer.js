const pathFn = require('path')
const fs = require('fs')
const {google} = require('googleapis')
const Axios = require('axios')
const HttpsProxyAgent = require("https-proxy-agent")

module.exports = function (args) {
    const { config, log } = this
    const { url_submission, url } = config
    const extName = 'url_submission: '
    let axios = Axios.create()
    const { google_key, urls_path, channel, sitemap, proxy } = url_submission
    let key = {}
    let urls = []
    try {
        key = require(pathFn.join(this.base_dir, google_key)) || JSON.parse(process.env.GOOGLE_KEY)
    } catch (error) {
        log.error(extName.concat('Google key file not exist.'))
        return
    }

    if (proxy !== '') {
        let httpsAgent = new HttpsProxyAgent(proxy)
        axios = Axios.create({
            proxy: false,
            httpsAgent
        })
        process.env.HTTPS_PROXY = proxy
        process.env.HTTP_PROXY = proxy
    }

    if (0 === Object.keys(key).length || channel.indexOf('google') === -1) {
        log.error(extName.concat("Google submitter off."))
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
    )
    const boundary = '===============' + randomRangeNumber(1000000000, 9999999999) + '=='
    let data = ''
    urls.forEach(line => {
        let body = JSON.stringify({
            url: line,
            type: 'URL_UPDATED',
        })
        data += '\r\n' + 
            '--' + boundary + '\n' +
            'Content-Type: application/http \n' + 
            'Content-Transfer-Encoding: binary \n' +
            '\r\n' +
            'POST /v3/urlNotifications:publish \n' +
            'Content-Type: application/json \n' +
            'accept: application/json \n' +
            'Content-Length: ' + body.length + '\n' +
            '\r\n' +
            body
    })
        
    jwtClient.authorize(function(err, tokens) {
        if (err) {
            log.error(extName.concat('Submit to google engine authorize error: ', err.message))
            return
        }
        let options = {
            url: 'https://indexing.googleapis.com/batch',
            method: "POST",
            headers: {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
                'Authorization': 'bearer ' + tokens.access_token
            },
            data: data,
            validateStatus: function (status) {
                return status <= 400
            }
        }
        axios.request(options).then(function (response) {
            let message = ''
            if (response.status === 200) {
                message = message.concat('success')
            } else {
                message = message.concat('failed: [', response.data.error.message, ']')
            }
            log.info(extName.concat("Submit to google engine ", message))
        }).catch(function (error) {
            log.error(extName.concat('Submit to google engine error: ', error))
        })
    })

  // Part.2 Google Ping https://www.google.com/ping?sitemap=
	let sitemap_options = {
		url: '/ping?sitemap='.concat(url.concat('/', sitemap)),
		baseURL: 'https://www.google.com'
	}
	
	axios.request(sitemap_options)
    .then(function (response) {
      if (response.status === 200) {
				log.info(extName.concat("Google Sitemap Notification Received"))
      }
    })
    .catch(function (error){
			log.error(extName.concat('Submit to google sitmap engine error: ', error))
    })
}

var randomRangeNumber = function(minNumber, maxNumber) {
    let range = maxNumber - minNumber
    let random = Math.random()
    return minNumber + Math.round(random * range)
}
