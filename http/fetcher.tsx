import useSWR from "swr";
import { BUNDLR_URL, MB } from "../components/utils";

// TODO make this "permanent" by using the data feed from arweave.
export const fetcher = (...args: any) =>
  // @ts-ignore
  fetch(...(args as any)).then((res) => res.json());

export function fetchArweaveMarketPrice() {
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

export function fetchBundlrPrice() {
  const { data, error } = useSWR(`${BUNDLR_URL}/price/arweave/${MB}`, fetcher);

  let price = "";
  if (data) {
    price = data;
  }

  return {
    price: price,
    isLoading: !error && !data,
    isError: error,
  };
}
