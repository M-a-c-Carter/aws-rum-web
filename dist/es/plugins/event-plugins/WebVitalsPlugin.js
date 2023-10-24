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
import { InternalPlugin } from '../InternalPlugin';
import { onCLS, onFID, onLCP } from 'web-vitals/attribution';
import { CLS_EVENT_TYPE, FID_EVENT_TYPE, LCP_EVENT_TYPE, PERFORMANCE_NAVIGATION_EVENT_TYPE, PERFORMANCE_RESOURCE_EVENT_TYPE } from '../utils/constant';
import { Topic } from '../../event-bus/EventBus';
import { ResourceType, performanceKey, isLCPSupported } from '../../utils/common-utils';
export var WEB_VITAL_EVENT_PLUGIN_ID = 'web-vitals';
var WebVitalsPlugin = /** @class */ (function (_super) {
    __extends(WebVitalsPlugin, _super);
    function WebVitalsPlugin() {
        var _this = _super.call(this, WEB_VITAL_EVENT_PLUGIN_ID) || this;
        _this.resourceEventIds = new Map();
        _this.cacheLCPCandidates = isLCPSupported();
        _this.handleEvent = function (event) {
            switch (event.type) {
                // lcp resource is either image or text
                case PERFORMANCE_RESOURCE_EVENT_TYPE:
                    var details = event.details;
                    if (_this.cacheLCPCandidates &&
                        details.fileType === ResourceType.IMAGE) {
                        _this.resourceEventIds.set(performanceKey(event.details), event.id);
                    }
                    break;
                case PERFORMANCE_NAVIGATION_EVENT_TYPE:
                    _this.navigationEventId = event.id;
                    break;
            }
        };
        return _this;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.enable = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.disable = function () { };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    WebVitalsPlugin.prototype.configure = function (config) { };
    WebVitalsPlugin.prototype.onload = function () {
        var _this = this;
        this.context.eventBus.subscribe(Topic.EVENT, this.handleEvent); // eslint-disable-line @typescript-eslint/unbound-method
        onLCP(function (metric) { return _this.handleLCP(metric); });
        onFID(function (metric) { return _this.handleFID(metric); });
        onCLS(function (metric) { return _this.handleCLS(metric); });
    };
    WebVitalsPlugin.prototype.handleLCP = function (metric) {
        var _a, _b;
        var a = metric.attribution;
        var attribution = {
            element: a.element,
            url: a.url,
            timeToFirstByte: a.timeToFirstByte,
            resourceLoadDelay: a.resourceLoadDelay,
            resourceLoadTime: a.resourceLoadTime,
            elementRenderDelay: a.elementRenderDelay
        };
        if (a.lcpResourceEntry) {
            var key = performanceKey(a.lcpResourceEntry);
            attribution.lcpResourceEntry = this.resourceEventIds.get(key);
        }
        if (this.navigationEventId) {
            attribution.navigationEntry = this.navigationEventId;
        }
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.record(LCP_EVENT_TYPE, {
            version: '1.0.0',
            value: metric.value,
            attribution: attribution
        });
        // teardown
        (_b = this.context) === null || _b === void 0 ? void 0 : _b.eventBus.unsubscribe(Topic.EVENT, this.handleEvent); // eslint-disable-line
        this.resourceEventIds.clear();
        this.navigationEventId = undefined;
    };
    WebVitalsPlugin.prototype.handleCLS = function (metric) {
        var _a;
        var a = metric.attribution;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.record(CLS_EVENT_TYPE, {
            version: '1.0.0',
            value: metric.value,
            attribution: {
                largestShiftTarget: a.largestShiftTarget,
                largestShiftValue: a.largestShiftValue,
                largestShiftTime: a.largestShiftTime,
                loadState: a.loadState
            }
        });
    };
    WebVitalsPlugin.prototype.handleFID = function (metric) {
        var _a;
        var a = metric.attribution;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.record(FID_EVENT_TYPE, {
            version: '1.0.0',
            value: metric.value,
            attribution: {
                eventTarget: a.eventTarget,
                eventType: a.eventType,
                eventTime: a.eventTime,
                loadState: a.loadState
            }
        });
    };
    return WebVitalsPlugin;
}(InternalPlugin));
export { WebVitalsPlugin };
