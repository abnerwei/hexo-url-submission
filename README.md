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

[![NPM](https://nodei.co/npm/hexo-url-submission.png)](https://nodei.co/npm/hexo-url-submission/)

## Roadmap
[Roadmap, plan, milestone](https://github.com/abnerwei/hexo-url-submission/projects/1)

## Donate

Hexo-URL-Submssion is used to submit site URLs to major search engines, including Google, Bing, ShenMa and Baidu, to improve the speed and quality of sites included in search engines.

These three major search engines have occupied 98% of the global search engine market share (except Yandex Ru). Later, I will support api submission for more search engines.

As of August 2021, Google: 92.05%, Bing: 2.45%, Yahoo!: 1.5%, Baidu: 1.39%, Yandex: 1.21%, DuckDuckGo: 0.63%.

In China, [Baidu](https://baidu.com), [360](https://so.com), [Shenma](https://m.sm.cn/) (only app), [Toutiao](https://www.toutiao.com/), [Sogou](https://www.sogou.com/) and other search engines occupy a dominant position


## Version record
- v1.0.0 feat: Support Baidu, Google, Bing url batch submission
- v1.0.1 fix(bing_deployer): local variables overwrite global variables and cause data errors 
- v1.0.2 feat(shenma): Support ShenMa Search Engine
- v1.0.3 improve(dep): improve package dep
- v1.0.4 improve(dep): remove deprecated dep
- v1.0.5 optimize(deployer): optimized deployer
- v1.0.6 optimize(dep): replace `request(deprecated)`
- v1.0.7 fix: Nodejs16+ DEP API & hexo 6.1 bug
- v1.0.9 optimize(google/bing): optimized google deployer 400, fixed bing deployer quote
- ⭐️v2.0.0 refactor: Added support for `ignore` parameters and wildcards, Channel parameters under independent control[#7](https://github.com/abnerwei/hexo-url-submission/issues/7)

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
   channels: # included channels are `baidu`, `google`, `bing`, `shenma`
     baidu:
       token: "" # Baidu Private Token
       count: 10 # Optional
     bing:
       token: "" # Bing Access Token
       count: 10 # Optional
     google:
       key: "google.json" # Google key path (e.g. `google_key.json` or `data/google_key.json`)
       count: 10 # Optional
     shenma:
       count: 10 # Optional
       user: "" # Username used when registering
       token: "" # ShenMa Private Key
   prefix: ['/post', '/wiki'] # URL prefix
   ignore: ["/post/a*", "/post/a?c"] # URL addresses that do not need to be submitted (wildcards are supported)
   count: 10 # Submit limit
   urls_path: 'submit_url.txt' # URL list file path
   sitemap: '' # Sitemap path(e.g. the url is like this https://abnerwei.com/baidusitemap.xml, you can fill in `baidusitemap.xml`)
```

#### (2) deploy
```yaml
deploy:
  - type: url_submission
```

### 3. good job
Run:
```shell
   hexo clean && hexo g && hexo d
```
enjoy it!

success response:
```shell
INFO  Deploying: url_submission
WARN  url_submission: (baidu) The number of submitted entries for Baidu Search is not set, and the default value will be used for submission.
WARN  url_submission: (baidu) The number of entries submitted by Baidu Search has been set to 37
INFO  url_submission: (baidu) Start submit urlList to baidu engine...
INFO  url_submission: (baidu) Submit to baidu engine success: [success: 37, remain: 2963]
WARN  url_submission: (bing) The number of submitted entries for Bing Search is not set. Continue to detect the remaining quota or the default value will be used for submission.
WARN  url_submission: (bing) The number of entries submitted by Bing Search has been set to 37
INFO  url_submission: (bing) Get bing engine remain, [daliy: 100, monthly: 2800]
INFO  url_submission: (bing) Start submit urlList to bing engine...
INFO  url_submission: (bing) Submit to bing engine success.
WARN  url_submission: (google) The number of submitted entries for Google Search is not set, and the default value will be used for submission.
WARN  url_submission: (google) The number of entries submitted by Google Search has been set to 37
INFO  url_submission: (google) Start submit urlList to google engine...
INFO  url_submission: (google) Submit to google engine success
INFO  url_submission: (google) Google Sitemap Notification Received.
WARN  url_submission: (shenma) The number of submitted entries for ShenMa Search is not set, and the default value will be used for submission.
WARN  url_submission: (shenma) The number of entries submitted by ShenMa Search has been set to 37
INFO  url_submission: (shenma) Start submit urlList to shenma engine...
INFO  url_submission: (shenma) Submit to shenma engine failed: [token illegal]
INFO  Deploy done: url_submission
```
