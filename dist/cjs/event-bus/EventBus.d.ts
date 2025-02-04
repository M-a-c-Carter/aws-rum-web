export declare type Subscriber = (message: any) => void;
export declare enum Topic {
    EVENT = "event"
}
/** A topic-based event bus to facilitate communication between plugins */
export default class EventBus<T = Topic> {
    private subscribers;
    subscribe(topic: T, subscriber: Subscriber): void;
    unsubscribe(topic: T, subscriber: Subscriber): boolean;
    dispatch(topic: T, message: any): void;
}
