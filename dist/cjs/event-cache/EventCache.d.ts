import { Session } from '../sessions/SessionManager';
import { Config } from '../orchestration/Orchestration';
import { PageAttributes } from '../sessions/PageManager';
import { AppMonitorDetails, UserDetails, RumEvent } from '../dispatch/dataplane';
import EventBus, { Topic } from '../event-bus/EventBus';
/**
 * A cache which stores events generated by telemetry plugins.
 *
 * The event cache stores meta data and events until they are dispatched to the
 * data plane. The event cache removes the oldest event once the cache is full
 * and a new event is added.
 */
export declare class EventCache {
    private eventBus;
    private appMonitorDetails;
    private config;
    private events;
    private sessionManager;
    private pageManager;
    private enabled;
    private installationMethod;
    /**
     * @param applicationDetails Application identity and version.
     * @param batchLimit The maximum number of events that will be returned in a batch.
     * @param eventCacheSize  The maximum number of events the cache can contain before dropping events.
     * @param sessionManager  The sessionManager returns user id, session id and handles session timeout.
     * @param pageManager The pageManager returns page id.
     */
    constructor(applicationDetails: AppMonitorDetails, config: Config, eventBus?: EventBus<Topic>);
    /**
     * The event cache will record new events or new meta data.
     */
    enable(): void;
    /**
     * The event cache will not record new events or new meta data. Events and
     * meta data which are already in the cache will still be accessible.
     */
    disable(): void;
    /**
     * Update the current page interaction for the session.
     */
    recordPageView: (payload: string | PageAttributes) => void;
    /**
     * Add an event to the cache and reset the session timer.
     *
     * If the session is being recorded, the event will be recorded.
     * If the session is not being recorded, the event will not be recorded.
     *
     * @param type The event schema.
     */
    recordEvent: (type: string, eventData: object) => void;
    /**
     * Returns the current session (1) if a session exists and (2) if the
     * current URL is allowed. Returns undefined otherwise.
     */
    getSession: () => Session | undefined;
    /**
     * Returns true if there are one or more events in the cache.
     */
    hasEvents(): boolean;
    /**
     * Removes and returns the next batch of events.
     */
    getEventBatch(): RumEvent[];
    /**
     * Returns an object containing the AppMonitor ID and application version.
     */
    getAppMonitorDetails(): AppMonitorDetails;
    /**
     * Returns an object containing the session ID and user ID.
     */
    getUserDetails(): UserDetails;
    /**
     * Set custom session attributes to add them to all event metadata.
     *
     * @param payload object containing custom attribute data in the form of key, value pairs
     */
    addSessionAttributes(sessionAttributes: {
        [k: string]: string | number | boolean;
    }): void;
    /**
     * Add a session start event to the cache.
     */
    private recordSessionInitEvent;
    private canRecord;
    /**
     * Add an event to the cache.
     *
     * @param type The event schema.
     */
    private addRecordToCache;
    /**
     * Returns {@code true} if the current url matches one of the allowedPages
     * and does not match any of the deniedPages; returns {@code false}
     * otherwise.
     */
    private isCurrentUrlAllowed;
}
