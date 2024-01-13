import {handleBooting, handleRequest} from "@app/shared/boot-utils";
import {PropertyModule} from "./property.module";

export async function handler(event, context,callback) {
    return await handleRequest(event,context,callback,PropertyModule);
}

handleBooting(PropertyModule);
