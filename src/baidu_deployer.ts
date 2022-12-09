import axios from 'axios'

import Hexo from './utils/hexo'
import { projectPrefix, defaultTimeOut } from './utils/utils'

export const deployer = async (args: Hexo) => {
  const { config, log } = args
  const { url_submission, url } = config
  const { urlList, urlArr, count: baseCount } = url_submission
  let { token, count } = url_submission.channels?.baidu
  token = token || process.env.BAIDU_TOKEN
  const logPrefix = projectPrefix.concat('(\x1b[3mbaidu\x1b[23m) ')
  axios.defaults.timeout = defaultTimeOut

  if (count === undefined) {
    log.warn(logPrefix.concat("The number of submitted entries for Baidu Search is not set, and the default value will be used for submission."))
  }
  count = Math.min(count || baseCount, urlArr.length)
  log.warn(logPrefix.concat('The number of entries submitted by Baidu Search has been set to \x1b[1m', String(count), '\x1b[22m'))

  log.info(logPrefix.concat("Start submit urlList to baidu engine..."))

  const target = "/urls?site=" + url + "&token=" + token
  // Success
  /*
  *  {
          "remain":99998,
          "success":2,
          "not_same_site":[],
          "not_valid":[]
      }
  */
  // Failed
  /*
  *  {
          "error":401,
          "message":"token is not valid"
      }
  */
  try {
    let response = await axios.create().request({
      url: target,
      method: 'POST',
      baseURL: 'http://data.zz.baidu.com',
      headers: {
        'Content-type': 'text/plain'
      },
      data: urlList
    })

    let message = ''
    const respJson = response.data
    if (response.status === 200) {
      const { remain } = respJson
      let quota = ''.concat(`\x1b[3${remain >= urlArr.length ? '2' : '1'}m`, remain, '\x1b[39m')
      message = message.concat('success: [success: \x1b[32m', respJson.success, '\x1b[39m, remain: ', quota)
    } else {
      message = message.concat('failed: [', respJson.message)
    }
    log.info(logPrefix.concat("Submit to baidu engine ", message, ']'))
  } catch (error: any) {
    log.error(logPrefix.concat('Submit to baidu engine error: [', error.message, ']'))
  }
}
