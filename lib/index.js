'use strict';
const moment = require('moment');
const GithubApi = require('./githubApi');
const {issueDataBuilder} = require('./utils');
const nunjucks = require('nunjucks');


module.exports = async function () {
    const hexo = this;
    const plugConfig = hexo.config.auto_issue || {};
    const githubApi = new GithubApi(plugConfig);
    githubApi.init();
    hexo.log.i('fetching issues that have been published on github, please wait...');
    const allissue = await githubApi.fetchAllIssues() || [];
    hexo.log.i(`fetched ${allissue.length} issues`);
    await hexo.call('generate');
    const sort_by = plugConfig.sort_by || 'date';
    const allPosts = hexo.locals.getters.posts().data.filter(item => !item.skipIssue).sort((a, b) => a[sort_by].isSameOrBefore(b[sort_by]) ? -1 : 1);
    for (const item of allPosts) {
        const {issueData, gitalkId} = issueDataBuilder(item, hexo);
        const exixtedIssue = allissue.filter(item => plugConfig.withGitalk ? item.labels.some(label => label.name === gitalkId) : item.title === issueData.title);
        let res;
        try {
            if (exixtedIssue && exixtedIssue.length) {
                const issue = exixtedIssue[0];
                if (moment(item.updated).isAfter(moment(issue.updated))) {
                    hexo.log.i('updating', item.title);
                    res = await githubApi.updateIssue({...issueData, issue_number: issue.issue_number});
                } else {
                    hexo.log.i('skiped', item.title);
                }
            } else {
                hexo.log.i('pubshing', item.title);
                res = await githubApi.createIssue(issueData);
            }
            await new Promise((resolved) => {
                setTimeout(resolved, plugConfig.delay || 2000);
            });
        } catch (e) {
            hexo.log.e('error', e);
        }
    }
}