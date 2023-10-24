import { HttpHandler } from '@aws-sdk/protocol-http';
import { Credentials } from '@aws-sdk/types';
interface OpenIdTokenResponse {
    IdentityId: string;
    Token: string;
}
interface GetIdResponse {
    IdentityId: string;
}
export declare type CognitoIdentityClientConfig = {
    fetchRequestHandler: HttpHandler;
    region?: string;
};
export declare class CognitoIdentityClient {
    private fetchRequestHandler;
    private hostname;
    constructor(config: CognitoIdentityClientConfig);
    getId: (request: {
        IdentityPoolId: string;
    }) => Promise<GetIdResponse>;
    getOpenIdToken: (request: {
        IdentityId: string;
    }) => Promise<OpenIdTokenResponse>;
    getCredentialsForIdentity: (identityId: string) => Promise<Credentials>;
    private validateCredenentialsResponse;
    private getHttpRequest;
}
export {};
