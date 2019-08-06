import Collection from "collection";
import LFAClient from "./Client";
import { Command } from "./Command";

export default class HashMap extends Collection<string, Command> {
    public static get [Symbol.species]() {
      return Collection;
    }
    public aliases: Collection<string, Command>;
    public cooldowns: Collection<string, Collection<string, number>>;

    public constructor(client: LFAClient) {
      super();

      Object.defineProperty(this, "client", { value: client });
      this.aliases = new Collection();
      this.cooldowns = new Collection();
    }

    public clear(): void {
      super.clear();
      this.aliases.clear();
    }

    public delete(name: string): boolean {
      const command: Command = this.get(name);
      if (!command) {
        return false;
      }
      super.delete(command.name);
      if (command.aliases && command.aliases.length) {
        for (const alias of command.aliases) {
          this.aliases.delete(alias);
        }
      }

      return true;
    }

    public get(name: string): Command {
      return super.get(name) || this.aliases.get(name);
    }

    public has(name: string): boolean {
      return super.has(name) || this.aliases.has(name);
    }

    public add(command: Command): Command {
      super.set(command.name, command);
      if (command.aliases && command.aliases.length) {
        for (const alias of command.aliases) {
          this.aliases.set(alias, command);
        }
      }

      return command;
    }
  }
