import {GatewayModule} from "./gateway.module";
import { Logger} from "@nestjs/common";

import {handleBooting, handleRequest,
} from "@app/shared/boot-utils";

const mockedEvent ={
    "version": "2.0",
    "routeKey": "GET /gateway",
    "rawPath": "/dev/gateway",
    "rawQueryString": "",
    "headers": {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-length": "0",
        "host": "p8pvn1dm46.execute-api.eu-central-1.amazonaws.com",
        "postman-token": "8bb35776-e8ea-472c-a54e-e7d16bab94d6",
        "user-agent": "PostmanRuntime/7.35.0",
        "x-amzn-trace-id": "Root=1-6596a108-2da98b1f23ab203f26e22723",
        "x-forwarded-for": "82.78.167.146",
        "x-forwarded-port": "443",
        "x-forwarded-proto": "https"
    },
    "requestContext": {
        "accountId": "767755967459",
        "apiId": "p8pvn1dm46",
        "domainName": "p8pvn1dm46.execute-api.eu-central-1.amazonaws.com",
        "domainPrefix": "p8pvn1dm46",
        "http": {
            "method": "GET",
            "path": "/dev/gateway",
            "protocol": "HTTP/1.1",
            "sourceIp": "82.78.167.146",
            "userAgent": "PostmanRuntime/7.35.0"
        },
        "requestId": "RA4Zbh5JFiAEJog=",
        "routeKey": "GET /gateway",
        "stage": "dev",
        "time": "04/Jan/2024:12:14:00 +0000",
        "timeEpoch": 1704370440813
    },
    "isBase64Encoded": false
}

const mockedContext={
    "callbackWaitsForEmptyEventLoop": true,
    "functionVersion": "33",
    "functionName": "property_hub-gateway-dev",
    "memoryLimitInMB": "512",
    "logGroupName": "/aws/lambda/property_hub-gateway-dev",
    "logStreamName": "2024/01/04/[33]1dbfabfc639343fe9669e7660a8b995b",
    "invokedFunctionArn": "arn:aws:lambda:eu-central-1:767755967459:function:property_hub-gateway-dev:property_hub-alias-gateway-dev",
    "awsRequestId": "b3b51dd0-f106-4f88-93b2-6dcf4f2d53e0"
}

export async function handler(event, context,callback) {
    return await handleRequest(event,context,callback,GatewayModule);
}

handleBooting(GatewayModule);
