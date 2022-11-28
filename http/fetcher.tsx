import { TupleType } from "typescript";
import useSWR from "swr";

export const fetcher = (...args: any) =>
  // @ts-ignore
  fetch(...(args as any)).then((res) => res.json());

export function fetchPrice() {
  const { data, error } = useSWR(
    `https://api.redstone.finance/prices?symbol=AR&provider=redstone&limit=1`,
    fetcher
  );

  let price = "";
  if (data) {
    price = data[0].value;
  }

  return {
    price: price,
    isLoading: !error && !data,
    isError: error,
  };
}
