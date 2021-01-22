'use strict';
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

function removeIssueLinkInMarkdown(content, issue_number, plugConfig) {
    const {insert_link_in_markdown: { template }} = plugConfig;
    return template ? content.replace(insertTemplateFormat(template, issue_number), '') : content;
}

function insertTemplateFormat(template, issue_number) {
    return nunjucks.renderString(template, {issue_number});
    // return template.replace(/\{\{issue_number\}\}/g, issue_number);
}

function insertIssueLinkInMarkdown(item, issue_number, hexo, plugConfig) {
    const { source_dir } = hexo;
    const {insert_link_in_markdown: {position = 'end', template}} = plugConfig;
    if (!template) return;
    const linkTmp = insertTemplateFormat(template, issue_number)
    if (!item.raw.includes(linkTmp)) {
        const newContent = position === 'end' ? `${item.raw}\n\n${linkTmp}` : `${linkTmp}\n\n${item.raw}`;
        const filePath = path.join(source_dir, item.source);
        fs.writeFileSync(filePath, newContent);
    }
}

function insertIssueLinkInHtml(content, issue_number, plugConfig) {
    const {insert_link_in_html: {position = 'end', template}} = plugConfig;
    if(!template) return;
    const linkTmp = insertTemplateFormat(template, issue_number);
    if(!content.replace(/\s/g, '').includes(linkTmp.replace(/\s/g, ''))){
        return position === 'end' ? `${content}\n\n${linkTmp}` : `${linkTmp}\n\n${content}`;
    }
    return false;
}

module.exports = {
    removeIssueLinkInMarkdown,
    insertIssueLinkInMarkdown,
    insertIssueLinkInHtml,
}