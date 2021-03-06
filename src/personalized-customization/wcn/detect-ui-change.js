const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const execSync = require('child_process').execSync; // 同步子进程
const shellUtil = require('../../../utils/shell');
const { wcxUIDetect } = require('../../../utils/enums');
const logUtil = require('../../../utils/log');
const { validateUIProxy } = require('../../../utils/config-vlidator');

// 检测UI变动
module.exports = async function detectUIChange() {
    logUtil.log('elfincmd pc detectUI start');
    // 获取到配置文件
    /**
     * uiRepoAddress UI仓库地址
     * proxy UI仓库文件映射
     * branch UI仓库分支名
     */
    const config = shellUtil.requireFileFromScriptRoot(wcxUIDetect);
    if (!config) {
        return logUtil.error('请设置配置文件: elfincmd pc');
    }
    validateUIProxy(config);
    if (!fs.existsSync(config.uiRepoAddress)) {
        return logUtil.error(`UI工程目录: ${config.uiRepoAddress}不存在，请检查配置项`);
    }
    // 进入到UI仓库
    shell.cd(config.uiRepoAddress);
    logUtil.log(`进入UI工程目录: 【${path.resolve(process.cwd(), './')}】`);

    const branch = config.branch || 'master';
    const diffStr = execSync(`git diff --stat ${branch} origin/${branch}`).toString().trim();
    const diffArr = diffStr.match(/dist.*(.json|.wxml|.wxss|.js)/g);
    logUtil.log(`获取 【${branch}】 分支文件diff`);

    let related = '';
    let unRelated = '';
    for (const item of diffArr) {
        const proxy = config.proxy.find(e => e.source === item);
        if (proxy) {
            const desc = proxy.desc ? `【${proxy.desc}】` : '';
            related += `业务文件: ${proxy.target} ${desc}| UI文件: ${config.uiRepoAddress}/${item}\n`;
        } else {
            unRelated += `UI文件: ${config.uiRepoAddress}/${item} \n`;
        }
    }
    logUtil.log('以下文件存在变动，请及时同步');
    logUtil.logGreen(related.trim());
    logUtil.log('以下文件存在变动,但未建立关联，请及时同步');
    logUtil.logGreen(unRelated.trim());

    logUtil.log('elfincmd pc detectUI end');
};
