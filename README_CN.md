# hexo-auto-issue
[![NPM version](https://badge.fury.io/js/hexo-auto-issue.svg)](https://www.npmjs.com/package/hexo-auto-issue)

##### [English](./README.md)

自动将文章发布到github issue上面

### features

* 可以通过根目录下面的`_config.yml`配置文件或者环境变量`GITHUB_TOKEN`来获取github token;
* 可以自动添加gitalk id为标签
* `title`, `body`, `labels` 内容可以通过自定义模板来实现
* 可以自定义哪些文件不需要发布到issue上面去
* 支持排序

### 安装

```shell
npm i hexo-auto-issue -S
```

### 配置

在根目录下面的`_config.yml`文件中添加或者修改以下字段内容

```yaml
auto-issue:
  owner: buxuku # github拥有者 
  repo: github-api # 仓库名
  auth: xxxx # github token
  userAgent: hexo-auto-iissue # 自定义请求头
  sort_by: date # 文章排序 可选data|updated 默认t: data
  withGitalk: true # 如果为true, 将自动生成一个gitalkId的label, 默认: false
  template:
    title: {{title}} - buxuku's blog  # issue 标题模板 默认: {{title}}
    body: |- # issue 内容模板. 默认: {{ _content }}
      {{title}}
      {{_content}}
      blog link [{{title}}](https://blog.linxiaodong.com/{{path}})
    labels: |- # issue 标签模板. 默认: {{ tags.data|join(',', 'name') }},{{ categories.data|join(',', 'name') }}
      {{ tags.data|join(',', 'name') }},{{ categories.data|join(',', 'name') }}
```

### 使用

在 [Front-matter](https://hexo.io/docs/front-matter) 中的`skipIssue`参数可以用来过滤该文章是否发布到issue上面

```yaml
---
title: Hello World
date: 2021/1/17 20:46:25
skipIssue: true
---
```

运行 `hexo issue`, 接下来插件将会发布或者更新文章到issue上面;

### 重点

* 如果设置 `withGitalk` 为 `true`, 插件将会自动生成一个 `gitalkId` 将把它添加到标签上面. 并在下一次通过它来判断文章是否已经布过了. 
 
  它也能帮你实现gitalk的自动初始化.这样你不用每发一篇文章还需要手动初始化一下gitalk.
  
  如果为 `false`, 插件将只能通过标题来判断是否有发布过了.

* `title`, `body`, `labels` 模板使用的是 nunjucks 模板引擎, 所以你可以使用 nunjucks 模板语法.
  如果你想在`_config.yml`配置文件中使用多行内容, 你可以使用 `|`, `|+`, `|-`. 了解更多 [YAML Spec 1.2](http://www.yaml.org/spec/1.2/spec.html#id2760844)
  
* 你无法通过api来删除issue,所以你最好先创建个一个新的仓库来测试一下.

* 你需要在这里 [generate new token](https://github.com/settings/tokens) 为插件生成一个token. 如果你是通过tranvis ci工具来使用这个插件,你不应该把这个token放在你仓库的任何地方.
你应该把它导出为一个环境变量.就像`export GITHUB_TOKEN=xxx`这样.
  
  如果你使用的是travis ci (.com),你可以通过以下的操作方法来生成一个安全的环境变量
```bash
brew install travis
travis login --pro --github-token xxxx 
travis encrypt --pro GITHUB_TOKEN="xxx" --add
```  

#### 了解更多

[encryption-keys/](https://docs.travis-ci.com/user/encryption-keys/)

### License

MIT