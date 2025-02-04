"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPlaneClient = void 0;
var util_hex_encoding_1 = require("@aws-sdk/util-hex-encoding");
var signature_v4_1 = require("@aws-sdk/signature-v4");
var sha256_js_1 = require("@aws-crypto/sha256-js");
var protocol_http_1 = require("@aws-sdk/protocol-http");
var SERVICE = 'rum';
var METHOD = 'POST';
var CONTENT_TYPE_JSON = 'application/json';
var CONTENT_TYPE_TEXT = 'text/plain;charset=UTF-8';
var REQUEST_PRESIGN_ARGS = { expiresIn: 60 };
var DataPlaneClient = /** @class */ (function () {
    function DataPlaneClient(config) {
        var _this = this;
        this.sendFetch = function (putRumEventsRequest) { return __awaiter(_this, void 0, void 0, function () {
            var options, request, httpResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHttpRequestOptions(putRumEventsRequest, CONTENT_TYPE_JSON)];
                    case 1:
                        options = _a.sent();
                        request = new protocol_http_1.HttpRequest(options);
                        if (!this.awsSigV4) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awsSigV4.sign(request)];
                    case 2:
                        request = (_a.sent());
                        _a.label = 3;
                    case 3:
                        httpResponse = this.config.fetchRequestHandler.handle(request);
                        return [2 /*return*/, httpResponse];
                }
            });
        }); };
        this.sendBeacon = function (putRumEventsRequest) { return __awaiter(_this, void 0, void 0, function () {
            var options, request, httpResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHttpRequestOptions(putRumEventsRequest, CONTENT_TYPE_TEXT)];
                    case 1:
                        options = _a.sent();
                        request = new protocol_http_1.HttpRequest(options);
                        if (!this.awsSigV4) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.awsSigV4.presign(request, REQUEST_PRESIGN_ARGS)];
                    case 2:
                        request = (_a.sent());
                        _a.label = 3;
                    case 3:
                        httpResponse = this.config.beaconRequestHandler.handle(request);
                        return [2 /*return*/, httpResponse];
                }
            });
        }); };
        this.getHttpRequestOptions = function (putRumEventsRequest, contentType) { return __awaiter(_this, void 0, void 0, function () {
            var serializedRequest, path, options, _a, _b, _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        serializedRequest = JSON.stringify(serializeRequest(putRumEventsRequest));
                        path = this.config.endpoint.pathname.replace(/\/$/, '');
                        options = {
                            method: METHOD,
                            protocol: this.config.endpoint.protocol,
                            headers: {
                                'content-type': contentType,
                                host: this.config.endpoint.host
                            },
                            hostname: this.config.endpoint.hostname,
                            path: "".concat(path, "/appmonitors/").concat(putRumEventsRequest.AppMonitorDetails.id),
                            body: serializedRequest
                        };
                        if (!this.awsSigV4) return [3 /*break*/, 2];
                        _a = [__assign({}, options)];
                        _d = {};
                        _b = [__assign({}, options.headers)];
                        _e = {};
                        _c = 'X-Amz-Content-Sha256';
                        return [4 /*yield*/, hashAndEncode(serializedRequest)];
                    case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_d.headers = __assign.apply(void 0, _b.concat([(_e[_c] = _f.sent(), _e)])), _d)]))];
                    case 2: return [2 /*return*/, options];
                }
            });
        }); };
        this.config = config;
        if (config.credentials) {
            this.awsSigV4 = new signature_v4_1.SignatureV4({
                applyChecksum: true,
                credentials: config.credentials,
                region: config.region,
                service: SERVICE,
                uriEscapePath: true,
                sha256: sha256_js_1.Sha256
            });
        }
    }
    return DataPlaneClient;
}());
exports.DataPlaneClient = DataPlaneClient;
var serializeRequest = function (request) {
    //  If we were using the AWS SDK client here then the serialization would be handled for us through a generated
    //  serialization/deserialization library. However, since much of the generated code is unnecessary, we do the
    //  serialization ourselves with this function.
    var serializedRumEvents = [];
    request.RumEvents.forEach(function (e) {
        return serializedRumEvents.push(serializeEvent(e));
    });
    var serializedRequest = {
        BatchId: request.BatchId,
        AppMonitorDetails: request.AppMonitorDetails,
        UserDetails: request.UserDetails,
        RumEvents: serializedRumEvents
    };
    return serializedRequest;
};
var serializeEvent = function (event) {
    return {
        id: event.id,
        // Dates must be converted to timestamps before serialization.
        timestamp: Math.round(event.timestamp.getTime() / 1000),
        type: event.type,
        metadata: event.metadata,
        details: event.details
    };
};
var hashAndEncode = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var sha256, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sha256 = new sha256_js_1.Sha256();
                sha256.update(payload);
                _a = util_hex_encoding_1.toHex;
                return [4 /*yield*/, sha256.digest()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()]).toLowerCase()];
        }
    });
}); };
