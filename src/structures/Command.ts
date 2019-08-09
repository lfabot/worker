import { Message } from "@spectacles/types";
import LFAClient from "./Client";

export abstract class RegisteredCommand implements Command {
    public aliases?: string[];
    public description?: string;
    public name: string;
    public ratelimit: number;
    public requiredRoles?: string[];
    public usage?: string;

    public constructor(public readonly client: LFAClient, info: Command) {
        this.aliases = info.aliases;
        this.description = info.description;
        this.name = info.name;
        this.requiredRoles = info.requiredRoles;
        this.usage = info.usage;
    }

    public checkPermission(message: Message) {
        return true;
    }

    public abstract async execute(message: Message);
}

export interface Command {
    aliases?: string[];
    description?: string;
    name: string;
    ratelimit?: number;
    requiredRoles?: string[];
    usage?: string;
}
