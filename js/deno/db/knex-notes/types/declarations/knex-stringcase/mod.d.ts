declare module "knex-stringcase" {
  // eslint-disable-next-line node/no-extraneous-import
  import { Conventions } from "stringcase";

  type StringcaseFn = (str: string) => string;
  type Stringcase = Conventions | StringcaseFn | (Conventions | StringcaseFn)[];

  interface IKnexStringCaseConfig {
    appStringcase?: Stringcase;
    dbStringcase?: Stringcase;
    beforePostProcessResponse?(
      result: any[] | object,
      queryContext: object,
    ): any[] | object;
    beforeWrapIdentifier?(value: string, queryContext: object): string;
    ignoreStringcase?(obj: object): boolean;
  }

  function knexStringcase<T>(config: T & IKnexStringCaseConfig): T;

  export = knexStringcase;
}

// thank you @eioo for this
