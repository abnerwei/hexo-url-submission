import axios from 'axios'
import urlParser from 'url'

import Hexo from './utils/hexo'
import { projectPrefix, defaultTimeOut } from './utils/utils'

export const deployer = async (args: Hexo) => {
  const { config, log } = args
  const { url_submission, url } = config
  const { urlList, urlArr, count: baseCount } = url_submission
  let { user, token, count } = url_submission.channels?.shenma
  token = token || process.env.SHENMA_TOKEN
  const logPrefix = projectPrefix.concat('(\x1b[3mshenma\x1b[23m) ')
  axios.defaults.timeout = defaultTimeOut

  if (count === undefined) {
    log.warn(logPrefix.concat("The number of submitted entries for ShenMa Search is not set, and the default value will be used for submission."))
  }
  user = user || process.env.SHENMA_USER
  count = Math.min(count || baseCount, urlArr.length)
  log.warn(logPrefix.concat('The number of entries submitted by ShenMa Search has been set to \x1b[1m', String(count), '\x1b[22m'))

  if (typeof (user) !== 'string' || typeof (token) !== 'string') {
    log.warn(logPrefix.concat("Shenme engine config check invalid, cancel submission."))
    return
  }

  log.info(logPrefix.concat("Start submit urlList to shenma engine..."))

  const target = "/push?site=" + urlParser.parse(url).host + "&user_name=" + user + "&resource_name=mip_add&token=" + token
  // Success
  /*
  *  {
          "returnCode" : 200, //接收成功，但需要进一步校验提交的内容是否正确
          "errorMsg" : ""
      }
  */
  // Failed
  /*
  *  {
          "returnCode" : 201, // 201: token不合法 202: 当日流量已用完 400: 请求参数有误 500: 服务器内部错误
          "errorMsg" : ""
      }
  */
  try {
    let response = await axios.create().request({
      url: target,
      baseURL: 'https://data.zhanzhang.sm.cn',
      method: 'POST',
      headers: {
        'Content-type': 'text/plain'
      },
      data: urlList
    })
    let message = ''
    const respJson = response.data
    if (response.status === 200) {
      switch (respJson.returnCode) {
        case 200:
          message = message.concat('success.')
          break
        default:
          message = message.concat('failed: [\x1b[31m', respJson.errorMsg, '\x1b[39m]')
      }
    } else {
      message = message.concat('failed: [\x1b[31m shenme submission server is down! \x1b[39m]')
    }
    log.info(logPrefix.concat("Submit to shenma engine ", message))
  } catch (error: any) {
    log.error(logPrefix.concat('Submit to shenma engine error: [\x1b[31m', error, '\x1b[39m]'))
  }
}
