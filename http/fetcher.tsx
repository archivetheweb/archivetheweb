import useSWR from "swr";
import { BUNDLR_URL, calculateUploadPrice, MB } from "../components/utils";

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

export function fetchPricePerMB() {
  const { data: usdPriceData, error: usdPriceError } = useSWR(
    `https://api.redstone.finance/prices?symbol=AR&provider=redstone&limit=1`,
    fetcher
  );
  const { data: bundlrPricePerWinston, error: bundlrPricePerWinstonError } =
    useSWR(`${BUNDLR_URL}/price/arweave/${MB}`, fetcher);

  let usdPrice = usdPriceData ? usdPriceData[0].value : "";
  let bundlrPrice = bundlrPricePerWinston || "";

  let pricePerMB = { usd: "", winston: "" };
  if (usdPrice && bundlrPrice) {
    pricePerMB = calculateUploadPrice(bundlrPrice, 1, usdPrice);
  }
  return {
    usdPrice: usdPrice,
    pricePerMB: pricePerMB,
    bundlrPrice: bundlrPrice,
    bundlrPriceError: bundlrPricePerWinstonError,
    priceError: usdPriceError,
    isLoading:
      !bundlrPricePerWinstonError &&
      !usdPriceError &&
      (!usdPriceData || !bundlrPricePerWinston),
    isError: bundlrPricePerWinston || usdPriceError,
  };
}
