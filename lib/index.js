'use strict';
const crypto = require('crypto');
const moment = require('moment');
const GithubApi = require('./githubApi');
const {insertIssueLinkInMarkdown, insertIssueLinkInHtml} = require('./utils');


module.exports = async function (locals) {
    const hexo = this;
    const plugConfig = hexo.config.auto_issue || {};
    const updatePost = [];
    const githubApi = new GithubApi(plugConfig);
    githubApi.init();
    const allissue = await githubApi.fetchAllIssues();
    // console.log('pro', process.env );
    const url_for = hexo.extend.helper.get('url_for').bind(hexo);
    for (const item of locals.posts.data) {
        const str = url_for(item.path);
        const gitalkId = crypto.createHash('md5').update(str).digest('hex');
        const exixtedIssue = allissue.filter(item => item.labels.some(label => label.name === gitalkId));
        const labels = Array.from(new Set([...item.tags.data.map(item => item.name), ...item.categories.data.map(item => item.name), gitalkId]));
        let issue_number;
        let res;
        try {
            if (exixtedIssue && exixtedIssue.length) {
                const issue = exixtedIssue[0];
                issue_number = issue.number;
                if (moment(item.updated).isAfter(moment(issue.updated))) {
                    console.log('updating', item.title);
                    res = await githubApi.updateIssue(item, {gitalkId, labels, issue_number: issue.number});
                } else {
                    console.log('skiped', item.title);
                }
            } else {
                console.log('pubshing', item.title);
                res = await githubApi.createIssue(item, {gitalkId, labels})
            }
        } catch (e) {
            console.log('error', e);
        }
        issue_number = issue_number || (res && res.number);
        if (issue_number && plugConfig.insert_link_in_markdown) {
            insertIssueLinkInMarkdown(item, issue_number, hexo, plugConfig);
        }
        if (issue_number && plugConfig.insert_link_in_html) {
            const content = insertIssueLinkInHtml(item.content, issue_number, plugConfig);
            if (content) {
                updatePost.push({
                    path: item.path,
                    layout: 'post',
                    data: {...item, content}
                })
            }
        }
    }
    return updatePost;
    // const {data} = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    //         owner: 'buxuku',
    //         repo: 'guestbook',
    //         labels: 'test,ok'
    //     })

    // const created = await octokit.issues.create({
    //     owner: 'buxuku',
    //     repo: 'guestbook',
    //     title: 'title3',
    //     body: '## title **bold** [link](https://github.com/)',
    //     labels: ['test', 'ok'],
    // });
    // console.log('data', data);
    // console.log('created', created );
}