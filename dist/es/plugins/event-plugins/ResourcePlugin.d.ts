import { InternalPlugin } from '../InternalPlugin';
import { PartialPerformancePluginConfig } from '../utils/performance-utils';
export declare const RESOURCE_EVENT_PLUGIN_ID = "resource";
/**
 * This plugin records resource performance timing events generated during every page load/re-load.
 */
export declare class ResourcePlugin extends InternalPlugin {
    private config;
    private resourceObserver;
    private eventCount;
    constructor(config?: PartialPerformancePluginConfig);
    enable(): void;
    disable(): void;
    performanceEntryHandler: (list: PerformanceObserverEntryList) => void;
    recordPerformanceEntries: (list: PerformanceEntryList) => void;
    recordResourceEvent: ({ name, startTime, initiatorType, duration, transferSize }: PerformanceResourceTiming) => void;
    protected onload(): void;
}
