import Hexo from "./utils/hexo";

import deployer from "./utils/deployer";
import generator from './generator';

hexo.config.url_submission = Object.assign({
  enable: true,
  type: 'latest', // latest or all( latest: modified pages; all: posts & pages)
  prefix: ['post', 'wiki'],
  ignore: ['/post/aeebbcec/', '/post/a*'],
  channels: { // included channels are `baidu`, `google`, `bing`, `shenma`
    baidu: { count: 10, token: '' },
    bing: { count: 10, token: '' },
    shenma: { count: 10, user: '', token: '' },
    google: { count: 10, key: '' },
  },
  count: 10,
  proxy: '',
  urls_path: 'submit_url.txt', // the file wait for submission
  sitemap: '' // whereis it
}, hexo.config.url_submission)

const pluginConfig = hexo.config.url_submission

if (pluginConfig?.enable) {
  hexo.extend.generator.register('us_url_generator', (locals: Hexo.Site) => {
    return generator(locals, hexo)
  }) // generator
  hexo.extend.deployer.register('url_submission', async (args: Hexo.extend.Deployer.Config) => {
    await deployer(hexo)
  })
}