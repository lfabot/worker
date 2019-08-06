import { RegisteredCommand } from "../../structures";
import LFAClient from "../../structures/Client";

export default class PingCommand extends RegisteredCommand {
    public constructor(client: LFAClient) {
        super(client, {
            name: "ping",
            description: "Sample first command to test pings."
        });
    }

    public execute() {

    }
}
