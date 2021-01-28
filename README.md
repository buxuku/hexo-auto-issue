# hexo-auto-issue
[![NPM version](https://badge.fury.io/js/hexo-auto-issue.svg)](https://www.npmjs.com/package/hexo-auto-issue)

##### [中文](./README_CN.md)

hexo plug auto publish articles  to github issue.

### features

* get github token from environment variable `GITHUB_TOKEN` or root _config.yml
* auto build gitalk id for labels
* `title`, `body`, `labels` template enabled
* custom skip article published to github issue
* sort enabled

### Installation

```shell
npm i hexo-auto-issue -S
```

### Options

Add or modify the following sections to you root _config.yml file

```yaml
auto-issue:
  owner: buxuku # your github owner
  repo: github-api # your github repo
  auth: xxxx # github token
  userAgent: hexo-auto-iissue # custom userAgent
  sort_by: date # data|updated default: data
  withGitalk: true # if true, will auto build a gitalk id labels. default: false
  delay: 2000 # delay time for each publish to prevent being judged as a robot. default: 2000 milliseconds
  template:
    title: {{title}} - buxuku's blog  # issue title template default: {{title}}
    body: |- # issue body template. default: {{ _content }}
      {{title}}
      {{_content}}
      this is test footer.
    labels: |- # issue labels template. default: {{ tags.data|join(',', 'name') }},{{ categories.data|join(',', 'name') }}
      {{ tags.data|join(',', 'name') }},{{ categories.data|join(',', 'name') }}
```

### Usage

The `skipIssue` parameter in ths post [Front-matter](https://hexo.io/docs/front-matter) will be used to filter this post publish to github issue;

```yaml
---
title: Hello World
date: 2021/1/17 20:46:25
skipIssue: true
---
```

run `hexo issue`, then this plug will publish or update your post to github issue;

### important

* if you set withGitalk is `true`, this plug will auto build gitalkId and add it to issue labels. And use it next time to judge whether the article has been published.
  
  It can also help you automatically initializing gitalk  
  
  if `false`, this plug can only judge whether it has been published by the title.

* the `title`, `body`, `labels` template is used the nunjucks template engine, so you can use the nunjucks template syntax.
  If you want to use multi-line text in the _config.yml, you can use `|`, `|+`, `|-`. read more [YAML Spec 1.2](http://www.yaml.org/spec/1.2/spec.html#id2760844) * 
  
* you can not delete the issue by api. so you should create a new repo for test.

* you should generate a github token for this plug. [generate new token](https://github.com/settings/tokens). if you use this plug by a travis ci, you should not put your token anywhere in your repo.
you should export it as a environment variable, like `export GITHUB_TOKEN=xxx`;
  
  if you use a travis ci (.com), you can add a secret environment variable like this:

```bash
brew install travis
travis login --pro --github-token xxxx 
travis encrypt --pro GITHUB_TOKEN="xxx" --add
```

#### read more

[encryption-keys/](https://docs.travis-ci.com/user/encryption-keys/)
  
### License

MIT