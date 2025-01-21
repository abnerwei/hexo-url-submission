'use strict';

import pathFn from 'path';
import fs from 'fs';

import Hexo from "./utils/hexo";
import { projectPrefix, isMatchUrl } from './utils/utils'
import { UrlSubmission } from './utils/interface';

export default (locals: Hexo.Site, hexo: Hexo): Hexo.extend.Generator.Return => {
  const { config, log, source_dir } = hexo;
  const url_submission: UrlSubmission = config.url_submission;
  const { type: generatorType, count, urls_path, prefix, ignore } = url_submission;
  log.info(projectPrefix.concat("Start generating url list..."))
  let pages = locals.pages.toArray().concat(...locals.posts.toArray() as Hexo.Locals.Page[])
  let urls = pages.map((post: Hexo.Locals.Page) => {
    return {
      "date": post.updated || post.date,
      "permalink": post.permalink,
      "source": post.source
    }
  }).sort(function (a: any, b: any) {
    return b.date - a.date
  }).slice(0, count).filter((post) => { // filter matching prefix
    const url = new URL(post.permalink)
    return (prefix.length === 0 ? true : prefix.filter(k => url.pathname.startsWith(k)).length > 0)
      && (ignore.length === 0 ? true : ignore.filter(k => isMatchUrl(url.pathname, k)).length === 0)
  })

  if ('latest' === generatorType) {
    try {
      urls = urls.filter((post) => {
        const pageFile = fs.statSync(pathFn.join(source_dir, post.source))
        return new Date(pageFile.mtime).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
      })
      if (urls.length == 0) {
        log.info(projectPrefix.concat("The url_submission type is set to 'latest', but there is no pages updated today!"))
        log.info(projectPrefix.concat("Therefore submit_url.txt will not be generated."))
      }
    } catch (error: any) {
      log.error(projectPrefix.concat("Read file meta failed, error is: ", error.message))
      return { path: '', data: '' }
    }
  }
  let urlsMap = urls.map(post => post.permalink).join('\n')

  if (urls.length > 0) {
    log.info(projectPrefix.concat("Page urls will generate into file named \x1b[90m" + urls_path + "\x1b[39m"))
  } else {
    log.info(projectPrefix.concat("No matching pages found!"))
    return { path: '', data: '' }
  }
  return {
    path: urls_path,
    data: urlsMap
  };
}
