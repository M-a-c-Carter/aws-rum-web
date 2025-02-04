"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPerformancePluginConfig = exports.defaultIgnore = void 0;
var common_utils_1 = require("../../utils/common-utils");
var defaultIgnore = function (entry) {
    return entry.entryType === 'resource' &&
        (!/^https?:/.test(entry.name) ||
            /^(fetch|xmlhttprequest)$/.test(entry.initiatorType));
};
exports.defaultIgnore = defaultIgnore;
exports.defaultPerformancePluginConfig = {
    eventLimit: 10,
    ignore: exports.defaultIgnore,
    recordAllTypes: [
        common_utils_1.ResourceType.DOCUMENT,
        common_utils_1.ResourceType.SCRIPT,
        common_utils_1.ResourceType.STYLESHEET,
        common_utils_1.ResourceType.FONT
    ],
    sampleTypes: [common_utils_1.ResourceType.IMAGE, common_utils_1.ResourceType.OTHER]
};
