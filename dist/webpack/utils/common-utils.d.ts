export declare enum ResourceType {
    OTHER = "other",
    STYLESHEET = "stylesheet",
    DOCUMENT = "document",
    SCRIPT = "script",
    IMAGE = "image",
    FONT = "font"
}
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/initiatorType
 */
export declare enum InitiatorType {
    /**
     * IMAGES
     * PerformanceResourceTiming with initiatorType=Input must be an image
     * Per MDN docs: "if the request was initiated by an <input> element of type image.""
     */
    IMG = "img",
    IMAGE = "image",
    INPUT = "input",
    /**
     * DOCUMENTS
     */
    IFRAME = "iframe",
    FRAME = "frame",
    /**
     * SCRIPTS
     */
    SCRIPT = "script",
    /**
     * STYLESHEETS
     */
    CSS = "css"
}
/**
 * A PerformanceEntry or RumEvent that is sourced from the PerformanceAPI
 */
export interface HasLatency {
    startTime: DOMHighResTimeStamp;
    duration: DOMHighResTimeStamp;
}
/**
 * Creates key to link a RumEvent to the PerformanceEntry that it is sourced from
 * e.g. performanceKey(ResourceEvent) === performanceKey(PerformanceResourceTiming).
 * There is some worry of collision when startTime or duration are zero, such as when
 * resources are cached. But timestamps have not been observed to be zero in these cases.
 */
export declare const performanceKey: (details: HasLatency) => string;
export declare const shuffle: (a: any[]) => void;
export declare const getResourceFileType: (url: string, initiatorType?: string) => ResourceType;
export declare const httpStatusText: {
    '0': string;
    '200': string;
    '201': string;
    '202': string;
    '203': string;
    '204': string;
    '205': string;
    '206': string;
    '300': string;
    '301': string;
    '302': string;
    '303': string;
    '304': string;
    '305': string;
    '306': string;
    '307': string;
    '400': string;
    '401': string;
    '402': string;
    '403': string;
    '404': string;
    '405': string;
    '406': string;
    '407': string;
    '408': string;
    '409': string;
    '410': string;
    '411': string;
    '412': string;
    '413': string;
    '414': string;
    '415': string;
    '416': string;
    '417': string;
    '418': string;
    '500': string;
    '501': string;
    '502': string;
    '503': string;
    '504': string;
    '505': string;
};
export interface RumLCPAttribution {
    element?: string;
    url?: string;
    timeToFirstByte: number;
    resourceLoadDelay: number;
    resourceLoadTime: number;
    elementRenderDelay: number;
    lcpResourceEntry?: string;
    navigationEntry?: string;
}
/** Checks at runtime if the web vitals package will record LCP
 * If PerformanceAPI ever changes this API, or if WebVitals package implements a polyfill,
 * then this needs to be updated
 *
 * Reference code from web vitals package:
 * https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/observe.ts#L46
 * Discussion for context:
 * https://github.com/aws-observability/aws-rum-web/pull/448#issuecomment-1734314463
 */
export declare const isLCPSupported: () => boolean;
