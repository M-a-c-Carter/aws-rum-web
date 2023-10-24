import { InternalPlugin } from '../InternalPlugin';
export declare const WEB_VITAL_EVENT_PLUGIN_ID = "web-vitals";
export declare class WebVitalsPlugin extends InternalPlugin {
    constructor();
    private resourceEventIds;
    private navigationEventId?;
    private cacheLCPCandidates;
    enable(): void;
    disable(): void;
    configure(config: any): void;
    protected onload(): void;
    private handleEvent;
    private handleLCP;
    private handleCLS;
    private handleFID;
}
