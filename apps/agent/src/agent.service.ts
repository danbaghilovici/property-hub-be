import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Agent} from "@entities/agent";
import {defer, Observable, tap} from "rxjs";

@Injectable()
export class AgentService {

  private readonly logger = new Logger(AgentService.name);

  constructor(
      @InjectRepository(Agent) private readonly agentRepository: Repository<Agent>
  ) {
  }
  getAllAgents(): Observable<Agent[]> {
    return defer(()=>this.agentRepository.find())
  }

  getAgentById(id:number):Observable<Agent>{
    return defer(()=>this.agentRepository.findOneBy({id:id}))
        .pipe(tap((value)=>this.logger.log(value)));
  }
}
