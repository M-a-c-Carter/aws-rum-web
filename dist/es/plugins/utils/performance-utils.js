import { ResourceType } from '../../utils/common-utils';
export var defaultIgnore = function (entry) {
    return entry.entryType === 'resource' &&
        (!/^https?:/.test(entry.name) ||
            /^(fetch|xmlhttprequest)$/.test(entry.initiatorType));
};
export var defaultPerformancePluginConfig = {
    eventLimit: 10,
    ignore: defaultIgnore,
    recordAllTypes: [
        ResourceType.DOCUMENT,
        ResourceType.SCRIPT,
        ResourceType.STYLESHEET,
        ResourceType.FONT
    ],
    sampleTypes: [ResourceType.IMAGE, ResourceType.OTHER]
};
