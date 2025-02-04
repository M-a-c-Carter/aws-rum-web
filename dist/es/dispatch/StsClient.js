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
import { HttpRequest } from '@aws-sdk/protocol-http';
import { responseToString } from './utils';
var METHOD = 'POST';
var CONTENT_TYPE = 'application/x-www-form-urlencoded';
var PROTOCOL = 'https:';
var ACTION = 'AssumeRoleWithWebIdentity';
var VERSION = '2011-06-15';
var StsClient = /** @class */ (function () {
    function StsClient(config) {
        var _this = this;
        this.assumeRoleWithWebIdentity = function (request) { return __awaiter(_this, void 0, void 0, function () {
            var requestObject, encodedBody, STSRequest, response, xmlResponse, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        requestObject = __assign(__assign({}, request), { Action: ACTION, Version: VERSION });
                        encodedBody = new URLSearchParams(Object.entries(requestObject)).toString();
                        STSRequest = new HttpRequest({
                            method: METHOD,
                            headers: {
                                'content-type': CONTENT_TYPE,
                                host: this.hostname
                            },
                            protocol: PROTOCOL,
                            hostname: this.hostname,
                            body: encodedBody
                        });
                        return [4 /*yield*/, this.fetchRequestHandler.handle(STSRequest)];
                    case 1:
                        response = (_a.sent()).response;
                        return [4 /*yield*/, responseToString(response)];
                    case 2:
                        xmlResponse = _a.sent();
                        return [2 /*return*/, {
                                accessKeyId: xmlResponse
                                    .split('<AccessKeyId>')[1]
                                    .split('</AccessKeyId>')[0],
                                secretAccessKey: xmlResponse
                                    .split('<SecretAccessKey>')[1]
                                    .split('</SecretAccessKey>')[0],
                                sessionToken: xmlResponse
                                    .split('<SessionToken>')[1]
                                    .split('</SessionToken>')[0],
                                expiration: new Date(xmlResponse
                                    .split('<Expiration>')[1]
                                    .split('</Expiration>')[0])
                            }];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error("CWR: Failed to retrieve credentials from STS: ".concat(e_1));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.hostname = "sts.".concat(config.region, ".amazonaws.com");
        this.fetchRequestHandler = config.fetchRequestHandler;
    }
    return StsClient;
}());
export { StsClient };
