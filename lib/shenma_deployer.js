const pathFn = require('path')
const fs = require('fs')
const axios = require('axios')
const urlParser = require('url')

module.exports = function (args) {
  const { config, log } = this
  const { url_submission, url } = config
  const extName = 'url_submission: '

  const { shenma_token, shenma_user, urls_path, channel } = url_submission

  const token = shenma_token || process.env.SHENMA_TOKEN
  const user_name = shenma_user || process.env.SHENMA_USER

  let urls = ''

  if ('' === user_name || '' === token || channel.indexOf('shenma') === -1) {
      log.error(extName.concat("ShenMa submitter off."))
      return
  }

  try {
      let UrlsFile = pathFn.join(this.public_dir, urls_path)
      urls = fs.readFileSync(UrlsFile, 'utf8')
  } catch (error) {
      log.error(extName.concat('Extract url file failed.'))
      return
  }

  log.info(extName.concat("Submitting urls to shenma engine..."))
	
	const target = "/push?site=" + urlParser.parse(url).host + "&user_name=" + user_name + "&resource_name=mip_add&token=" + token
	axios.create().request({
		url: target,
		baseURL: 'https://data.zhanzhang.sm.cn',
    method: 'POST',
    headers: {
        'Content-type': 'text/plain'
    },
    data: urls
	}).then(function (response) {
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
		let message = ''
		const respJson = response.data
		if (response.status === 200) {
			switch (respJson.returnCode) {
				case 200:
					message = message.concat('success')
					break
				default:
					message = message.concat('failed: [', respJson.errorMsg, ']')
			}
		} else {
			message = message.concat('failed: [server is down!')
		}
		log.info(extName.concat("Submit to shenma engine ", message))
	}).catch(function (error) {
		log.error(extName.concat('Submit to shenma engine error: [', error, ']'))
	})
}
