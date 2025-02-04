"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcePlugin = exports.RESOURCE_EVENT_PLUGIN_ID = void 0;
var InternalPlugin_1 = require("../InternalPlugin");
var common_utils_1 = require("../../utils/common-utils");
var constant_1 = require("../utils/constant");
var performance_utils_1 = require("../utils/performance-utils");
exports.RESOURCE_EVENT_PLUGIN_ID = 'resource';
var RESOURCE = 'resource';
/**
 * This plugin records resource performance timing events generated during every page load/re-load.
 */
var ResourcePlugin = /** @class */ (function (_super) {
    __extends(ResourcePlugin, _super);
    function ResourcePlugin(config) {
        var _this = _super.call(this, exports.RESOURCE_EVENT_PLUGIN_ID) || this;
        _this.performanceEntryHandler = function (list) {
            _this.recordPerformanceEntries(list.getEntries());
        };
        _this.recordPerformanceEntries = function (list) {
            var recordAll = [];
            var sample = [];
            list.filter(function (e) { return e.entryType === RESOURCE; })
                .filter(function (e) { return !_this.config.ignore(e); })
                .forEach(function (event) {
                var _a = event, name = _a.name, initiatorType = _a.initiatorType;
                var type = (0, common_utils_1.getResourceFileType)(name, initiatorType);
                if (_this.config.recordAllTypes.includes(type)) {
                    recordAll.push(event);
                }
                else if (_this.config.sampleTypes.includes(type)) {
                    sample.push(event);
                }
            });
            // Record all events for resources in recordAllTypes
            recordAll.forEach(function (r) {
                return _this.recordResourceEvent(r);
            });
            // Record events from resources in sample until we hit the resource limit
            (0, common_utils_1.shuffle)(sample);
            while (sample.length > 0 && _this.eventCount < _this.config.eventLimit) {
                _this.recordResourceEvent(sample.pop());
                _this.eventCount++;
            }
        };
        _this.recordResourceEvent = function (_a) {
            var _b;
            var name = _a.name, startTime = _a.startTime, initiatorType = _a.initiatorType, duration = _a.duration, transferSize = _a.transferSize;
            var pathRegex = /.*\/application\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/events/;
            var entryUrl = new URL(name);
            if (entryUrl.host === _this.context.config.endpointUrl.host &&
                pathRegex.test(entryUrl.pathname)) {
                // Ignore calls to PutRumEvents (i.e., the CloudWatch RUM data
                // plane), otherwise we end up in an infinite loop of recording
                // PutRumEvents.
                return;
            }
            if ((_b = _this.context) === null || _b === void 0 ? void 0 : _b.record) {
                var eventData = {
                    version: '1.0.0',
                    initiatorType: initiatorType,
                    startTime: startTime,
                    duration: duration,
                    fileType: (0, common_utils_1.getResourceFileType)(name, initiatorType),
                    transferSize: transferSize
                };
                if (_this.context.config.recordResourceUrl) {
                    eventData.targetUrl = name;
                }
                _this.context.record(constant_1.PERFORMANCE_RESOURCE_EVENT_TYPE, eventData);
            }
        };
        _this.config = __assign(__assign({}, performance_utils_1.defaultPerformancePluginConfig), config);
        _this.eventCount = 0;
        _this.resourceObserver = new PerformanceObserver(_this.performanceEntryHandler);
        return _this;
    }
    ResourcePlugin.prototype.enable = function () {
        if (this.enabled) {
            return;
        }
        this.enabled = true;
        this.resourceObserver.observe({
            type: RESOURCE,
            buffered: true
        });
    };
    ResourcePlugin.prototype.disable = function () {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;
        this.resourceObserver.disconnect();
    };
    ResourcePlugin.prototype.onload = function () {
        // We need to set `buffered: true`, so the observer also records past
        // resource entries. However, there is a limited buffer size, so we may
        // not be able to collect all resource entries.
        this.resourceObserver.observe({
            type: RESOURCE,
            buffered: true
        });
    };
    return ResourcePlugin;
}(InternalPlugin_1.InternalPlugin));
exports.ResourcePlugin = ResourcePlugin;
