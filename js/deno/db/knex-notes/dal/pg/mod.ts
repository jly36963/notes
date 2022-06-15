import ninjas from "./ninjas.ts";
import jutsus from "./jutsus.ts";
import { Jutsu, Ninja } from "../../types/mod.ts";

export interface PGDAL {
  ninjas: {
    get: (id: string) => Promise<Ninja | undefined>;
    insert: (
      ninja: Pick<Ninja, "firstName" | "lastName" | "age">,
    ) => Promise<Ninja | undefined>;
    update: (id: string, updates: Partial<Ninja>) => Promise<Ninja | undefined>;
    del: (id: string) => Promise<Ninja | undefined>;
    associateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
    disassociateJutsu: (ninjaId: string, jutsuId: string) => Promise<void>;
    getNinjaWithJutsus: (ninjaId: string) => Promise<Ninja | undefined>;
  };
  jutsus: {
    get: (id: string) => Promise<Jutsu | undefined>;
    insert: (
      jutsu: Pick<Jutsu, "name" | "chakraNature" | "description">,
    ) => Promise<Jutsu | undefined>;
    update: (id: string, updates: Partial<Jutsu>) => Promise<Jutsu | undefined>;
    del: (id: string) => Promise<Jutsu | undefined>;
  };
}

export const pgdal: PGDAL = {
  ninjas,
  jutsus,
};
