'use strict'
const {Octokit} = require("@octokit/rest");
const { removeIssueLinkInMarkdown } = require('./utils');

class GithubApi {
    constructor(options) {
        this.auth = options.auth;
        this.repo = options.repo;
        this.owner = options.owner;
        this.auth = options.auth || process.env.GITHUB_TOKEN;
        this.userAgent = options.userAgent;
        this.plugConfig = options;
    }

    init() {
        this.octokit = new Octokit({
            auth: this.auth,
            // auth: '1c65bf2aa5755ce918257b286fc879673be1e423',
            userAgent: this.userAgent || 'hexo-auto-issue',
            // log: {
            //     debug: console.log,
            //     info: console.info,
            //     warn: console.warn,
            //     error: console.error
            // },
        });
    }

    async fetchAllIssues() {
        const data = await this.octokit
            .paginate("GET /repos/{owner}/{repo}/issues", {
                owner: this.owner,
                repo: this.repo,
            });
        return data;
    }

    async createIssue(item, {gitalkId, labels}) {
        const res = await this.octokit.issues.create({
            owner: this.owner,
            repo: this.repo,
            labels,
            title: item.title,
            body: item.content,
        });
        return res;
    }
    async updateIssue(item, {gitalkId, labels, issue_number}) {
        const res = await this.octokit.issues.update({
            owner: this.owner,
            repo: this.repo,
            labels,
            title: item.title,
            body: removeIssueLinkInMarkdown(item._content, issue_number, this.plugConfig),
            issue_number
        })
        return res;
    }
}

module.exports = GithubApi;