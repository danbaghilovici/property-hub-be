import {Controller, Get, Logger, NotFoundException, Param, ParseIntPipe} from '@nestjs/common';
import { AgentService } from './agent.service';
import {Observable, tap} from "rxjs";
import {Agent} from "../../../libs/shared/src/entities/agent.entity";

@Controller("agents")
export class AgentController {

  private readonly logger = new Logger(AgentController.name);
  constructor(private readonly agentService: AgentService) {}


  @Get()
  getAgents(): Observable<Agent[]> {
    return this.agentService.getAllAgents();
  }

  @Get(":id")
  getAgent(@Param('id',ParseIntPipe) id: number):Observable<Agent>{
    this.logger.log(`Received ${id} as ${typeof id}`);
    return this.agentService.getAgentById(id)
        .pipe(tap((value)=>{
          if (!value) throw new NotFoundException()
        }));
  }
}
