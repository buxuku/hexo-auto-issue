const fs = require('fs');
const path = require('path');

hexo.extend.console.register('issue', 'auto publish to issue', require('./lib'));
