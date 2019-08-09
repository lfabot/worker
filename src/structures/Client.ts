import { Amqp } from "@spectacles/brokers";
import { Client as Cache } from "@spectacles/cache";
import { QueryObject } from "@spectacles/rest/typings/structures/Query";
import { Pool } from "pg";
import HashMap from "./HashMap";

export default class LFAClient {
    public brandColor: number;
    public commands: HashMap;
    public packages: string[];
    public prefix: string;

    public constructor(
        public readonly broker: Amqp,
        public readonly cache: Cache,
        public readonly pg: Pool,
        public readonly rest: QueryObject
    ) {

    }

    public capitalize(string: string) {
        return string.replace(
            /\w\S*/g,
            txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
    }
}
