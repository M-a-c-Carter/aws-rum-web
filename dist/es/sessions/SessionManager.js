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
import { storeCookie, getCookie } from '../utils/cookies-utils';
import { v4 } from 'uuid';
import { UAParser } from 'ua-parser-js';
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from '../utils/constants';
export var NIL_UUID = '00000000-0000-0000-0000-000000000000';
export var UNKNOWN = 'unknown';
export var DESKTOP_DEVICE_TYPE = 'desktop';
export var WEB_PLATFORM_TYPE = 'web';
export var SESSION_START_EVENT_TYPE = 'com.amazon.rum.session_start_event';
export var RUM_SESSION_START = 'rum_session_start';
export var RUM_SESSION_EXPIRE = 'rum_session_expire';
/**
 * The session handler handles user id and session id.
 *
 * A session is the {user id, session id} tuple which groups events that occur on a single browser over a continuous
 * period of time. A session begins when no session exists or the last session has expired. If user id does not exist,
 * session handler will assign a new one and store it in cookie. If session id does not exist or has expired, session
 * handler will assign a new one and store it in cookie. Session handler detects user interactions and updates session
 * id expiration time.
 */
var SessionManager = /** @class */ (function () {
    function SessionManager(appMonitorDetails, config, record, pageManager) {
        this.appMonitorDetails = appMonitorDetails;
        this.config = config;
        this.record = record;
        this.pageManager = pageManager;
        // Initialize the session to the nil session
        this.session = {
            sessionId: NIL_UUID,
            record: this.sample(),
            eventCount: 0
        };
        // Initialize or restore the user
        this.initializeUser();
        // Collect the user agent and domain
        this.collectAttributes();
        // Set custom session attributes
        this.addSessionAttributes(this.config.sessionAttributes);
        // Attempt to restore the previous session
        this.getSessionFromCookie();
    }
    /**
     * Returns the session ID. If no session ID exists, one will be created.
     */
    SessionManager.prototype.getSession = function () {
        if (this.session.sessionId === NIL_UUID) {
            // The session does not exist. Create a new one.
            this.createSession();
        }
        else if (this.session.sessionId !== NIL_UUID &&
            new Date() > this.sessionExpiry) {
            // The session has expired. Create a new one.
            this.createSession();
        }
        return this.session;
    };
    SessionManager.prototype.getAttributes = function () {
        return this.attributes;
    };
    /**
     * Adds custom session attributes to the session's attributes
     *
     * @param sessionAttributes object containing custom attribute data in the form of key, value pairs
     */
    SessionManager.prototype.addSessionAttributes = function (sessionAttributes) {
        this.attributes = __assign(__assign({}, sessionAttributes), this.attributes);
    };
    SessionManager.prototype.getUserId = function () {
        if (this.useCookies()) {
            return this.userId;
        }
        return NIL_UUID;
    };
    SessionManager.prototype.incrementSessionEventCount = function () {
        this.session.eventCount++;
        this.renewSession();
    };
    SessionManager.prototype.initializeUser = function () {
        var userId = '';
        this.userExpiry = new Date();
        this.userExpiry.setDate(this.userExpiry.getDate() + this.config.userIdRetentionDays);
        if (this.config.userIdRetentionDays <= 0) {
            // Use the 'nil' UUID when the user ID will not be retained
            this.userId = '00000000-0000-0000-0000-000000000000';
        }
        else if (this.useCookies()) {
            userId = this.getUserIdCookie();
            this.userId = userId ? userId : v4();
            this.createOrRenewUserCookie(userId, this.userExpiry);
        }
        else {
            this.userId = v4();
        }
    };
    SessionManager.prototype.createOrRenewSessionCookie = function (session, expires) {
        if (btoa) {
            storeCookie(this.sessionCookieName(), btoa(JSON.stringify(session)), this.config.cookieAttributes, undefined, expires);
        }
    };
    SessionManager.prototype.createOrRenewUserCookie = function (userId, expires) {
        storeCookie(USER_COOKIE_NAME, userId, this.config.cookieAttributes, undefined, expires);
    };
    SessionManager.prototype.getUserIdCookie = function () {
        return getCookie(USER_COOKIE_NAME);
    };
    SessionManager.prototype.getSessionFromCookie = function () {
        if (this.useCookies()) {
            var cookie = getCookie(this.sessionCookieName());
            if (cookie && atob) {
                try {
                    this.session = JSON.parse(atob(cookie));
                    this.pageManager.resumeSession(this.session.page);
                }
                catch (e) {
                    // Error decoding or parsing the cookie -- ignore
                }
            }
        }
    };
    SessionManager.prototype.storeSessionAsCookie = function () {
        if (this.useCookies() && this.config.userIdRetentionDays > 0) {
            this.createOrRenewUserCookie(this.userId, this.userExpiry);
        }
        if (this.useCookies()) {
            // Set the user cookie in case useCookies() has changed from false to true.
            this.createOrRenewSessionCookie(this.session, this.sessionExpiry);
        }
    };
    SessionManager.prototype.createSession = function () {
        this.session = {
            sessionId: v4(),
            record: this.sample(),
            eventCount: 0
        };
        this.session.page = this.pageManager.getPage();
        this.sessionExpiry = new Date(new Date().getTime() + this.config.sessionLengthSeconds * 1000);
        this.storeSessionAsCookie();
        this.record(this.session, SESSION_START_EVENT_TYPE, {
            version: '1.0.0'
        });
    };
    SessionManager.prototype.renewSession = function () {
        this.sessionExpiry = new Date(new Date().getTime() + this.config.sessionLengthSeconds * 1000);
        this.session.page = this.pageManager.getPage();
        this.storeSessionAsCookie();
    };
    SessionManager.prototype.collectAttributes = function () {
        var ua = new UAParser(navigator.userAgent).getResult();
        this.attributes = {
            browserLanguage: navigator.language,
            browserName: ua.browser.name ? ua.browser.name : UNKNOWN,
            browserVersion: ua.browser.version ? ua.browser.version : UNKNOWN,
            osName: ua.os.name ? ua.os.name : UNKNOWN,
            osVersion: ua.os.version ? ua.os.version : UNKNOWN,
            // Possible device types include {console, mobile, tablet, smarttv, wearable, embedded}. If the device
            // type is undefined, there was no information indicating the device is anything other than a desktop,
            // so we assume the device is a desktop.
            deviceType: ua.device.type ? ua.device.type : DESKTOP_DEVICE_TYPE,
            // This client is used exclusively in web applications.
            platformType: WEB_PLATFORM_TYPE,
            domain: window.location.hostname
        };
    };
    /**
     * Returns true when cookies should be used to store user ID and session ID.
     */
    SessionManager.prototype.useCookies = function () {
        return navigator.cookieEnabled && this.config.allowCookies;
    };
    /**
     * Returns {@code true} when the session has been selected to be recorded.
     */
    SessionManager.prototype.sample = function () {
        return Math.random() < this.config.sessionSampleRate;
    };
    SessionManager.prototype.sessionCookieName = function () {
        if (this.config.cookieAttributes.unique) {
            return "".concat(SESSION_COOKIE_NAME, "_").concat(this.appMonitorDetails.id);
        }
        return SESSION_COOKIE_NAME;
    };
    return SessionManager;
}());
export { SessionManager };
