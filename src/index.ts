import Hexo from "./utils/hexo";

import deployer from "./utils/deployer";
import generator from './generator';

hexo.config.url_submission = Object.assign({
  enable: true,
  type: 'all',
  prefix: ['post'],
  ignore: [],
  channels: {},
  count: 100,
  proxy: '',
  urls_path: 'submit_url.txt',
  sitemap: 'sitemap.xml'
}, hexo.config.url_submission)

const pluginConfig = hexo.config.url_submission

if (pluginConfig?.enable) {
  hexo.extend.generator.register('submission_generator', (locals: Hexo.Site) => {
    return generator(locals, hexo)
  }) // generator
  hexo.extend.deployer.register('url_submission', async (args: Hexo.extend.Deployer.Config) => {
    await deployer(hexo)
  })
}