const rewireMobX = require('react-app-rewire-mobx');
const path = require('path');

/* config-overrides.js */
module.exports = function override(config, env) {
    config = rewireMobX(config, env);
    config.resolve.alias = {
        mobx: path.resolve(__dirname, 'node_modules/mobx')
    };
    return config;
}