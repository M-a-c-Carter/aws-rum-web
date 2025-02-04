"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLCPSupported = exports.httpStatusText = exports.getResourceFileType = exports.shuffle = exports.performanceKey = exports.InitiatorType = exports.ResourceType = void 0;
var ResourceType;
(function (ResourceType) {
    ResourceType["OTHER"] = "other";
    ResourceType["STYLESHEET"] = "stylesheet";
    ResourceType["DOCUMENT"] = "document";
    ResourceType["SCRIPT"] = "script";
    ResourceType["IMAGE"] = "image";
    ResourceType["FONT"] = "font";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType
 */
var InitiatorType;
(function (InitiatorType) {
    /**
     * IMAGES
     * PerformanceResourceTiming with initiatorType=Input must be an image
     * Per MDN docs: "if the request was initiated by an <input> element of type image.""
     */
    InitiatorType["IMG"] = "img";
    InitiatorType["IMAGE"] = "image";
    InitiatorType["INPUT"] = "input";
    /**
     * DOCUMENTS
     */
    InitiatorType["IFRAME"] = "iframe";
    InitiatorType["FRAME"] = "frame";
    /**
     * SCRIPTS
     */
    InitiatorType["SCRIPT"] = "script";
    /**
     * STYLESHEETS
     */
    InitiatorType["CSS"] = "css";
})(InitiatorType = exports.InitiatorType || (exports.InitiatorType = {}));
/**
 * Creates key to link a RumEvent to the PerformanceEntry that it is sourced from
 * e.g. performanceKey(ResourceEvent) === performanceKey(PerformanceResourceTiming).
 * There is some worry of collision when startTime or duration are zero, such as when
 * resources are cached. But timestamps have not been observed to be zero in these cases.
 */
var performanceKey = function (details) {
    return [details.startTime, details.duration].join('#');
};
exports.performanceKey = performanceKey;
var extensions = [
    {
        name: ResourceType.STYLESHEET,
        list: ['css', 'less']
    },
    {
        name: ResourceType.DOCUMENT,
        list: ['htm', 'html', 'ts', 'doc', 'docx', 'pdf', 'xls', 'xlsx']
    },
    {
        name: ResourceType.SCRIPT,
        list: ['js']
    },
    {
        name: ResourceType.IMAGE,
        list: [
            'ai',
            'bmp',
            'gif',
            'ico',
            'jpeg',
            'jpg',
            'png',
            'ps',
            'psd',
            'svg',
            'tif',
            'tiff'
        ]
    },
    {
        name: ResourceType.FONT,
        list: ['fnt', 'fon', 'otf', 'ttf', 'woff']
    }
];
var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var v = a[i];
        a[i] = a[j];
        a[j] = v;
    }
};
exports.shuffle = shuffle;
var getResourceFileType = function (url, initiatorType) {
    var ext = ResourceType.OTHER;
    if (url) {
        var filename = url.substring(url.lastIndexOf('/') + 1);
        var extension_1 = filename
            .substring(filename.lastIndexOf('.') + 1)
            .split(/[?#]/)[0];
        extensions.forEach(function (type) {
            if (type.list.indexOf(extension_1) > -1) {
                ext = type.name;
            }
        });
    }
    /**
     * Resource name sometimes does not have the correct file extension names due to redirects.
     * In these cases, they are mislablled as "other". In these cases, we can infer the correct
     * fileType from the initiator.
     */
    if (initiatorType && ext === ResourceType.OTHER) {
        switch (initiatorType) {
            case InitiatorType.IMAGE:
            case InitiatorType.IMG:
            case InitiatorType.INPUT:
                ext = ResourceType.IMAGE;
                break;
            case InitiatorType.IFRAME:
            case InitiatorType.FRAME:
                ext = ResourceType.DOCUMENT;
                break;
            case InitiatorType.SCRIPT:
                ext = ResourceType.SCRIPT;
                break;
            case InitiatorType.CSS:
                ext = ResourceType.STYLESHEET;
                break;
        }
    }
    return ext;
};
exports.getResourceFileType = getResourceFileType;
/* Helpers */
exports.httpStatusText = {
    '0': 'Abort Request',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Required',
    '413': 'Request Entry Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': 'I"m a teapot',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
/** Checks at runtime if the web vitals package will record LCP
 * If PerformanceAPI ever changes this API, or if WebVitals package implements a polyfill,
 * then this needs to be updated
 *
 * Reference code from web vitals package:
 * https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/observe.ts#L46
 * Discussion for context:
 * https://github.com/aws-observability/aws-rum-web/pull/448#issuecomment-1734314463
 */
var isLCPSupported = function () {
    return PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint');
};
exports.isLCPSupported = isLCPSupported;
