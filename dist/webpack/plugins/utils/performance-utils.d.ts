import { ResourceType } from '../../utils/common-utils';
export declare const defaultIgnore: (entry: PerformanceEntry) => boolean;
export declare type PartialPerformancePluginConfig = {
    eventLimit?: number;
    ignore?: (event: PerformanceEntry) => any;
    recordAllTypes?: ResourceType[];
    sampleTypes?: ResourceType[];
};
export declare type PerformancePluginConfig = {
    eventLimit: number;
    ignore: (event: PerformanceEntry) => any;
    recordAllTypes: ResourceType[];
    sampleTypes: ResourceType[];
};
export declare const defaultPerformancePluginConfig: {
    eventLimit: number;
    ignore: (entry: PerformanceEntry) => boolean;
    recordAllTypes: ResourceType[];
    sampleTypes: ResourceType[];
};
