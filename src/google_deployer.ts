import pathFn from 'path'
import { google, Auth as googleAuth } from 'googleapis'
import Axios from 'axios'
import HttpsProxyAgent from "https-proxy-agent"

import { GoogleKeys } from './utils/interface'
import Hexo from './utils/hexo'
import { projectPrefix } from './utils/utils'

export const deployer = async (args: Hexo) => {
  const { config, log, base_dir } = args
  const { url_submission, url } = config
  const { urlArr, count: baseCount, sitemap, proxy } = url_submission
  let { key, count }: { key: string, count: number } = url_submission.channels?.google
  const logPrefix = projectPrefix.concat('(\x1b[3mgoogle\x1b[23m) ')

  if (count === undefined) {
    log.warn(logPrefix.concat("The number of submitted entries for Google Search is not set, and the default value will be used for submission."))
  }
  count = Math.min(count || baseCount, urlArr.length)
  log.warn(logPrefix.concat('The number of entries submitted by Google Search has been set to \x1b[1m', String(count), '\x1b[22m'))

  let axios = Axios.create()
  let parsedGoogleKey: GoogleKeys
  try {
    parsedGoogleKey = require(pathFn.join(base_dir, key)) || JSON.parse(process.env.GOOGLE_KEY || '{}')
  } catch (error) {
    log.error(logPrefix.concat('Google key file not exist, cancel submission. '))
    return
  }

  if (proxy !== '') {
    let httpsAgent = HttpsProxyAgent(proxy)
    axios = Axios.create({
      proxy: false,
      httpsAgent
    })
    process.env.HTTPS_PROXY = proxy
    process.env.HTTP_PROXY = proxy
  }

  log.info(logPrefix.concat("Start submit urlList to google engine..."))

  const boundary = '===============' + randomRangeNumber(1000000000, 9999999999) + '=='
  let data = ''
  urlArr.slice(0, count).forEach((line: string) => {
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

  let tokens: googleAuth.Credentials | undefined = {}

  try {
    // Part.1 Indexing API
    const jwtClient = new google.auth.JWT(
      parsedGoogleKey.client_email,
      undefined,
      parsedGoogleKey.private_key,
      ["https://www.googleapis.com/auth/indexing"],
      undefined
    )
    tokens = await authorize(jwtClient)
  } catch (error: any) {
    log.error(logPrefix.concat('Submit to google engine authorize error: \x1b[31m', error.message, '\x1b[39m'))
    return
  }

  try {
    let options = {
      url: 'https://indexing.googleapis.com/batch',
      method: "POST",
      headers: {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
        'Authorization': 'bearer ' + tokens?.access_token
      },
      data: data,
      validateStatus: (status: number) => {
        return status <= 400
      }
    }
    let response = await axios.request(options)
    let message = ''
    if (response.status === 200) {
      message = message.concat('success')
    } else {
      message = message.concat('failed: [\x1b[31m', response.data.error.message, '\x1b[39m]')
    }
    log.info(logPrefix.concat("Submit to google engine ", message))
  } catch (error: any) {
    log.error(logPrefix.concat('Submit to google engine error: \x1b[31m', error, '\x1b[39m'))
  }

  try {
    // Part.2 Google Ping https://www.google.com/ping?sitemap=
    let sitemap_options = {
      url: '/ping?sitemap='.concat(url.concat('/', sitemap)),
      baseURL: 'https://www.google.com'
    }

    let response = await axios.request(sitemap_options)
    if (response.status === 200) {
      log.info(logPrefix.concat("Google Sitemap Notification Received."))
    }
  } catch (error: any) {
    log.error(logPrefix.concat('Submit to google sitmap engine error: \x1b[31m', error.message, '\x1b[39m'))
  }
}

const randomRangeNumber = (minNumber: number, maxNumber: number) => {
  let range = maxNumber - minNumber
  let random = Math.random()
  return minNumber + Math.round(random * range)
}

const authorize = (jwtClient: googleAuth.JWT) => {
  return new Promise<googleAuth.Credentials | undefined>((resolve, reject) => {
    jwtClient.authorize((err: Error | null, tokens?: googleAuth.Credentials) => {
      if (err !== null) return reject(err)
      resolve(tokens)
    })
  })
}