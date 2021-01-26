'use strict'
const {Octokit} = require("@octokit/rest");

class GithubApi {
    constructor(options) {
        this.repo = options.repo;
        this.owner = options.owner;
        this.auth = options.auth || process.env.GITHUB_TOKEN;
        this.userAgent = options.userAgent;
    }

    init() {
        this.octokit = new Octokit({
            auth: this.auth,
            userAgent: this.userAgent || 'hexo-auto-issue',
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

    async createIssue(issueData) {
        const res = await this.octokit.issues.create({
            owner: this.owner,
            repo: this.repo,
            ...issueData,
        });
        return res;
    }

    async updateIssue(issueData) {
        const res = await this.octokit.issues.update({
            owner: this.owner,
            repo: this.repo,
            ...issueData,
        })
        return res;
    }
}

module.exports = GithubApi;