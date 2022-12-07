import fs from 'fs'

import Hexo from './hexo'
import { readFileSync, projectPrefix } from './utils'

export default async (hexo: Hexo) => {
  let pluginConfig = hexo.config.url_submission
  // extract url file
  if (Object.keys(pluginConfig?.channels).length !== 0) {
    try {
      pluginConfig.urlList = readFileSync(hexo.public_dir, pluginConfig?.urls_path)
      pluginConfig.urlArr = pluginConfig.urlList.split(/[(\r\n)\r\n]+/)
    } catch (error) {
      hexo.log.error(projectPrefix.concat('Extract url file failed. Cancel inclusion submission...'))
      return
    }
  }

  for (let channel in pluginConfig?.channels) {
    let filePath = `./../${channel}_deployer.js`
    try {
      await (await import(filePath)).deployer(hexo)
    } catch (error) {
      hexo.log.error(projectPrefix.concat(`\x1b[31mParsing error, submission channel named \x1b[1m${channel}\x1b[22m does not support.\x1b[39m`))
    }
  }
}
