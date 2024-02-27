import { MigrationInterface, QueryRunner } from "typeorm";
import {Agent} from "../libs/database/src/entities/agent.entity";
import {fsReadFile} from "ts-loader/dist/utils";
import {Property} from "../libs/database/src/entities/property.entity";
import {Logger} from "@nestjs/common";
import {Status} from "../libs/database/src/entities/status.entity";
import {Type} from "../libs/database/src/entities/type.entity";
import {plainToClass} from "class-transformer";
import {Feature} from "../libs/database/src/entities/feature.entity";

export class PopulatePropertyTable1706946822911 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulatePropertyTable1706946822911.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        const mockProperties:Property[] =
            (JSON.parse(fsReadFile("migrations/mock_properties.json")) as Record<any, any>[])
                .filter((x,i)=>i===0)
                .map(value=> {
                    if (!value) {return null;}
                    const p=new Property();
                    p.id=value['id'];
                    p.agent=value['agent'] as Agent;
                    p.title=value['title'];
                    p.desc=value['desc'];
                    p.propertyType=value['propertyType'] as Type
                    p.propertyStatuses=value['propertyStatus'] as Status[]
                    p.formattedAddress=value['city'];
                    p.featured=value['featured'];
                    p.features=value['features'] as Feature[];
                    p.bedrooms=value['bedrooms'];
                    p.bathrooms=value['bathrooms'];
                    p.garages=value['garages'];
                    p.yearBuilt=value['yearBuilt'];
                    p.published=value['published'];
                    p.lastUpdate=value['lastUpdate'];
                    p.views=value['views'];
                    return p;
                })
                .filter(p=>!!p);

        this.logger.debug("properties to be added",mockProperties);
        return queryRunner.manager.save(mockProperties).then();

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
