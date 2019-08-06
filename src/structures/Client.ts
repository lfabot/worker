import { Amqp } from "@spectacles/brokers";
import { Client as Cache } from "@spectacles/cache";
import { Pool } from "pg";
import HashMap from "./HashMap";

export default class LFAClient {
    public brandColor: number;
    public prefix: string;
    public packages: string[];

    public constructor(
        public readonly broker: Amqp,
        public readonly cache: Cache,
        public commands: HashMap,
        public readonly pg: Pool
    ) {

    }

    public capitalize(string: string) {
        return string.replace(
            /\w\S*/g,
            txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
    }
}
