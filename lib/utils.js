'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nunjucks = require('nunjucks');

const TPL_TITLE = '{{ title }}';
const TPL_BODY = '{{ _content }}';
const TPL_LABELS = "{{ tags.data|join(',', 'name') }},{{ categories.data|join(',', 'name') }}";

function issueDataBuilder(item, hexo) {
    const issueData = {};
    const {
        template: {body = TPL_BODY, title = TPL_TITLE, labels = TPL_LABELS} = {},
        withGitalk
    } = hexo.config.auto_issue || {};
    issueData.title = nunjucks.renderString(title, {...item});
    issueData.body = nunjucks.renderString(body, {...item});
    let allLabels = nunjucks.renderString(labels, {...item});
    allLabels = Array.from(new Set(allLabels.split(',').filter(item => !!item)));
    let gitalkId;
    if (withGitalk) {
        const url_for = hexo.extend.helper.get('url_for').bind(hexo);
        const str = url_for(item.path);
        gitalkId = crypto.createHash('md5').update(str).digest('hex');
        allLabels.push(gitalkId);
    }
    issueData.labels = allLabels;
    return {issueData, gitalkId};
}

module.exports = {
    issueDataBuilder,
}