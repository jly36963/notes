import moment from "moment";

declare const BrandSym: unique symbol;
type Brand<K, T> = K & { [BrandSym]: T };

const ISO_DATE_FORMAT = "YYYY-MM-DD";

type IsoDate = Brand<string, "IsoDate">;

function assertIsoDate(value: string): asserts value is IsoDate {
  if (!moment(value, ISO_DATE_FORMAT, true).isValid()) {
    throw Error(`Invalid ISO Date: ${value}`);
  }
}
function useIsoDate(value: IsoDate) {
  console.log(value);
}

function main() {
  const dashDate: string = "2025-01-01";

  // @ts-expect-error: string does not extend IsoDate
  useIsoDate(dashDate);

  // Cheating TS with the `as` keyword
  useIsoDate(dashDate as IsoDate);

  // Safe to use after assertion function
  assertIsoDate(dashDate);
  useIsoDate(dashDate);
}

main();
