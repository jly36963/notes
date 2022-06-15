import { PGDAL, pgdal } from "./pg/mod.ts";

export interface Providers {
  pgdal: PGDAL;
}

export const providers: Providers = {
  pgdal,
};
