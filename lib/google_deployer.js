const pathFn = require('path')
const fs = require('fs')
const {google} = require('googleapis')
let Axios = require('axios')
const HttpsProxyAgent = require("https-proxy-agent")

module.exports = function (args) {
  const { config, log } = this
  const { url_submission, url } = config
  const extName = 'url_submission: '

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
	  const httpsAgent = new HttpsProxyAgent(proxy)
	  Axios = Axios.create({
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

  const items = urls
      .filter(x => x)
      .map(line => {
				  let body = JSON.stringify({
					  url: line,
					  type: 'URL_UPDATED',
				  })
          return {
              'Content-Type': 'application/http',
              'Content-Transfer-Encoding': 'binary',
              body:
                  'POST /v3/urlNotifications:publish \n' +
                  'Content-Type: application/json\n' +
                  'Content-Length: ' + body.length +'\n\n' +
                  body,
          }
      })
	
  jwtClient.authorize(function(err, tokens) {
    if (err) {
        log.error(extName.concat('Submit to google engine authorize error: ', err.message))
        return
    }
    let options = {
			url: '/batch',
      baseURL: 'https://indexing.googleapis.com',
      method: "POST",
      headers: {
				'Content-Type': 'multipart/mixed',
        'Authorization': 'bearer ' + tokens.access_token
      },
      data: items
    }
    Axios.request(options).then(function (response) {
        let message = ''
        if (response.status === 200) {
	        message = message.concat('success')
        } else {
	        const respJson = JSON.parse(response.data)
	        message = message.concat('failed: [', respJson.error.message, ']')
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
	
	Axios.request(sitemap_options)
    .then(function (response) {
      if (response.status === 200) {
				log.info(extName.concat("Google Sitemap Notification Received"))
      }
    })
    .catch(function (error){
			log.error(extName.concat('Submit to google engine error: ', error))
    })
}
