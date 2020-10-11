#!/usr/bin/env node

var program = require('commander')
var version = require('../package.json').version
var cloneCommand = require('../src/clone')
var initCommand = require('../src/init')
var installCommand = require('../src/install')

program
    .version(version)
    .usage('<command> [options]')

program
    .command('clone <source>')
    .description('clone a repository into a newly created directory')
    .action((source) => {
        cloneCommand(source)
    })

program
    .command('init')
    .description('init depend repository')
    .action(() => {
        initCommand()
    })

program
    .command('install')
    .description('depend repository run npm install')
    .action(() => {
        installCommand()
    })

program
    .command('hooks <hookName> [options]')
    .description('depend repository run npm install')
    .action((hookName, options) => {
        console.log('clone command called', hookName, options)
    })
    .on('--help', function() {
        console.log('');
        console.log('hook-name:');
        console.log('  post-checkout');
        console.log('  pre-push');
        console.log('  post-merge');
        console.log('  reset-branch');
        console.log('');
    });

program.parse(process.argv)