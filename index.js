/* global hexo*/
'use strict';

hexo.config.url_submission = Object.assign({
    enable: true,
    type: 'latest', // latest or all( latest: modified pages; all: posts & pages)
    channel: ['baidu', 'bing', 'google'], // included channels are `baidu`, `google`, `bing`
    prefix: ['post', 'wiki'],
    count: 10,
    proxy: '',
    urls_path: 'submit_url.txt', // the file wait for submission
    baidu_token: '',
    bing_token: '',
    google_key: '',
    sitemap: '' // whereis it
}, hexo.config.url_submission)

const config = hexo.config.url_submission

if (!config.enable) {
    return;
}


hexo.extend.deployer.register('us_baidu_deployer', require('./lib/baidu_deployer')) // baidu api deployer
hexo.extend.deployer.register('us_bing_deployer', require('./lib/bing_deployer')) // bing api deployer
hexo.extend.deployer.register('us_google_deployer', require('./lib/google_deployer')) // google api deployer

hexo.extend.generator.register('us_url_generator', require('./lib/generator')) // generator
