# Hexo-url-submission

`Welcome to make valuable comments and Star`

[![GitHub stars](https://img.shields.io/github/stars/abnerwei/hexo-url-submission.svg?style=social)](https://github.com/abnerwei/hexo-url-submission/stargazers)     [![GitHub forks](https://img.shields.io/github/forks/abnerwei/hexo-url-submission.svg?style=social)](https://github.com/abnerwei/hexo-url-submission/network/members) 


[![NPM version](https://badge.fury.io/js/hexo-url-submission.svg)](https://www.npmjs.com/package/hexo-url-submission)
![GitHub top language](https://img.shields.io/github/languages/top/abnerwei/hexo-url-submission.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/abnerwei/hexo-url-submission.svg) 
![GitHub repo size](https://img.shields.io/github/repo-size/abnerwei/hexo-url-submission.svg)
![GitHub](https://img.shields.io/github/license/abnerwei/hexo-url-submission.svg)
![platforms](https://img.shields.io/badge/platform-win32%20%7C%20win64%20%7C%20linux%20%7C%20osx-brightgreen.svg)
[![GitHub issues](https://img.shields.io/github/issues/abnerwei/hexo-url-submission.svg)](https://github.com/abnerwei/hexo-url-submission/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/abnerwei/hexo-url-submission.svg)](https://github.com/abnerwei/hexo-url-submission/issues?q=is%3Aissue+is%3Aclosed)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/abnerwei/hexo-url-submission.svg)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/abnerwei/hexo-url-submission.svg)
![GitHub contributors](https://img.shields.io/github/contributors/abnerwei/hexo-url-submission.svg)

## Roadmap
[Roadmap, plan, milestone](https://github.com/abnerwei/hexo-url-submission/projects/1)

## Documentation
[Read More](https://abnerwei.com/wiki/url-submission/)

## Donate

Hexo-URL-Submssion is used to submit site URLs to major search engines, including Google, Bing, and Baidu, to improve the speed and quality of sites included in search engines.

These three major search engines have occupied 98% of the global search engine market share (except Yandex Ru). Later, I will support api submission for more search engines.

As of August 2021, Google: 92.05%, Bing: 2.45%, Yahoo!: 1.5%, Baidu: 1.39%, Yandex: 1.21%, DuckDuckGo: 0.63%.

In China, [Baidu](https://baidu.com), [360](https://so.com), [Shenma](https://m.sm.cn/) (only app), [Toutiao](https://www.toutiao.com/), [Sogou](https://www.sogou.com/) and other search engines occupy a dominant position

## Quick start

### 1. Install
```
npm install --save hexo-url-submission
```

or

```
yarn add hexo-url-submission
```

### 2. Edit hexo _config.yml
#### (1) hexo-url-submission

> You can use environment variables in your local or CI/CD tools to safely store tokens

```yaml
url_submission:
   enable: true
   type: 'latest' # latest or all( latest: modified pages; all: posts & pages)
   channel: ['baidu', 'bing', 'google'] # Included channels are `baidu`, `google`, `bing`
   prefix: ['/post', '/wiki'] # URL prefix
   count: 10 # Submit limit
   proxy: '' # Set the proxy used to submit urls to Google
   urls_path: 'submit_url.txt' # URL list file path
   baidu_token: '' # Baidu private key
   bing_token: '' # Bing private key
   google_key: '' # Google key path (e.g. `google_key.json` or `data/google_key.json`)
   sitemap: '' # Sitemap path(e.g. the url is like this https://abnerwei.com/baidusitemap.xml, you can fill in `baidusitemap.xml`)
```

#### (2) deploy
```yaml
deploy:
  - type: us_baidu_deployer
  - type: us_bing_deployer
  - type: us_google_deployer
```

### 3. good job
Run:
```shell
   hexo clean && hexo g && hexo d
```
enjoy it!

success response:
```shell
INFO  Deploying: us_baidu_deployer
INFO  submission_url: Submitting urls to baidu engine...
INFO  Deploy done: ws_baidu_deployer
INFO  submission_url: Submit to baidu engine: [ success: 32, remain: 2780 ]
INFO  Deploying: us_bing_deployer
INFO  submission_url: Submitting urls to bing engine...
INFO  Deploy done: ws_bing_deployer
INFO  submission_url: Submit to bing engine success
INFO  Deploying: us_google_deployer
INFO  submission_url: Submitting urls to google engine...
INFO  Deploy done: ws_google_deployer
INFO  submission_url: Submit to google engine success
```
