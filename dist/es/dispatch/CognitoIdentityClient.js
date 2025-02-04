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
/* eslint-disable no-underscore-dangle */
import { HttpRequest } from '@aws-sdk/protocol-http';
import { responseToJson } from './utils';
import { IDENTITY_KEY } from '../utils/constants';
var METHOD = 'POST';
var CONTENT_TYPE = 'application/x-amz-json-1.1';
var PROTOCOL = 'https:';
// Targets
var GET_ID_TARGET = 'AWSCognitoIdentityService.GetId';
var GET_TOKEN_TARGET = 'AWSCognitoIdentityService.GetOpenIdToken';
var GET_CREDENTIALS_TARGET = 'AWSCognitoIdentityService.GetCredentialsForIdentity';
var CognitoIdentityClient = /** @class */ (function () {
    function CognitoIdentityClient(config) {
        var _this = this;
        this.getId = function (request) { return __awaiter(_this, void 0, void 0, function () {
            var getIdResponse, requestPayload, idRequest, getIdResponse_1, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getIdResponse = null;
                        try {
                            getIdResponse = JSON.parse(localStorage.getItem(IDENTITY_KEY));
                        }
                        catch (e) {
                            // Ignore -- we will get a new identity Id from Cognito
                        }
                        if (getIdResponse && getIdResponse.IdentityId) {
                            return [2 /*return*/, Promise.resolve(getIdResponse)];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        requestPayload = JSON.stringify(request);
                        idRequest = this.getHttpRequest(GET_ID_TARGET, requestPayload);
                        _a = responseToJson;
                        return [4 /*yield*/, this.fetchRequestHandler.handle(idRequest)];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [(_b.sent()).response])];
                    case 3:
                        getIdResponse_1 = (_b.sent());
                        try {
                            localStorage.setItem(IDENTITY_KEY, JSON.stringify({ IdentityId: getIdResponse_1.IdentityId }));
                        }
                        catch (e) {
                            // Ignore
                        }
                        return [2 /*return*/, getIdResponse_1];
                    case 4:
                        e_1 = _b.sent();
                        throw new Error("CWR: Failed to retrieve Cognito identity: ".concat(e_1));
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getOpenIdToken = function (request) { return __awaiter(_this, void 0, void 0, function () {
            var requestPayload, tokenRequest, response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        requestPayload = JSON.stringify(request);
                        tokenRequest = this.getHttpRequest(GET_TOKEN_TARGET, requestPayload);
                        return [4 /*yield*/, this.fetchRequestHandler.handle(tokenRequest)];
                    case 1:
                        response = (_a.sent()).response;
                        return [4 /*yield*/, responseToJson(response)];
                    case 2: return [2 /*return*/, (_a.sent())];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error("CWR: Failed to retrieve Cognito OpenId token: ".concat(e_2));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getCredentialsForIdentity = function (identityId) { return __awaiter(_this, void 0, void 0, function () {
            var requestPayload, credentialRequest, response, credentialsResponse, Credentials, AccessKeyId, Expiration, SecretKey, SessionToken, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        requestPayload = JSON.stringify({ IdentityId: identityId });
                        credentialRequest = this.getHttpRequest(GET_CREDENTIALS_TARGET, requestPayload);
                        return [4 /*yield*/, this.fetchRequestHandler.handle(credentialRequest)];
                    case 1:
                        response = (_a.sent()).response;
                        return [4 /*yield*/, responseToJson(response)];
                    case 2:
                        credentialsResponse = (_a.sent());
                        this.validateCredenentialsResponse(credentialsResponse);
                        Credentials = credentialsResponse.Credentials;
                        AccessKeyId = Credentials.AccessKeyId, Expiration = Credentials.Expiration, SecretKey = Credentials.SecretKey, SessionToken = Credentials.SessionToken;
                        return [2 /*return*/, {
                                accessKeyId: AccessKeyId,
                                secretAccessKey: SecretKey,
                                sessionToken: SessionToken,
                                expiration: new Date(Expiration * 1000)
                            }];
                    case 3:
                        e_3 = _a.sent();
                        throw new Error("CWR: Failed to retrieve credentials for Cognito identity: ".concat(e_3));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.validateCredenentialsResponse = function (cr) {
            if (cr &&
                cr.__type &&
                (cr.__type === 'ResourceNotFoundException' ||
                    cr.__type === 'ValidationException')) {
                // The request may have failed because of ValidationException or
                // ResourceNotFoundException, which means the identity Id is bad. In
                // any case, we invalidate the identity Id so the entire process can
                // be re-tried.
                localStorage.removeItem(IDENTITY_KEY);
                throw new Error("".concat(cr.__type, ": ").concat(cr.message));
            }
        };
        this.getHttpRequest = function (target, payload) {
            return new HttpRequest({
                method: METHOD,
                headers: {
                    'content-type': CONTENT_TYPE,
                    'x-amz-target': target
                },
                protocol: PROTOCOL,
                hostname: _this.hostname,
                body: payload
            });
        };
        this.hostname = "cognito-identity.".concat(config.region, ".amazonaws.com");
        this.fetchRequestHandler = config.fetchRequestHandler;
    }
    return CognitoIdentityClient;
}());
export { CognitoIdentityClient };
