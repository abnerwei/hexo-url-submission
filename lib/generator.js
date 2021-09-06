'use strict';

const pathFn = require('path');
const fs = require('fs');

module.exports = function (locals) {
    const { config, log } = this;
    const { url_submission } = config;
    const extName = 'url_submission: ';
    const { type: generatorType, count, urls_path, prefix} = url_submission;
    let urls = [].concat(locals.posts.toArray().concat(locals.pages.toArray()))
        .map(function (post) {
            return {
                "date": post.updated || post.date,
                "permalink": post.permalink,
                "source": post.source
            }
        })
        .sort(function (a, b) {
            return b.date - a.date
        })
        .slice(0, count)
        .filter((post) => { // filter matching prefix
            const url = new URL(post.permalink)
            return prefix.length === 0 ? true : prefix.filter(k => url.pathname.startsWith(k)).length > 0
        });

    if ('latest' === generatorType) {
        try {
            urls = urls.filter((post) => {
                const pageFile = fs.statSync(pathFn.join(this.source_dir, post.source))
                return new Date(pageFile.mtime).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
            })
        } catch (error) {
            log.error(extName.concat("Read file meta failed, error is: ", error))
            urls = []
        }
    }
    urls = urls.map(function (post) {
        return post.permalink
    })
    .join('\n');      
    
    if (urls.length > 0) {
        log.info(extName.concat("Page urls generated in " + urls_path + "\n" + urls));
    } else {
        log.info(extName.concat("No matching pages found!"))
        return
    }
    log.info(extName.concat("Submit all matching URLs to the search engine successfully!"))
    return {
        path: urls_path,
        data: urls
    };
}
