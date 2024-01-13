
import { AgentModule } from './agent.module';
import {handleBooting, handleRequest} from "@app/shared/boot-utils";


export async function handler(event, context,callback) {
  return await handleRequest(event,context,callback,AgentModule);
}

handleBooting(AgentModule);
