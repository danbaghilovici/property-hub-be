import {handleBooting, handleRequest} from "@app/shared/boot-utils";
import {AuthModule} from "./auth.module";

export async function handler(event, context,callback) {
  return await handleRequest(event,context,callback,AuthModule);
}

handleBooting(AuthModule);
