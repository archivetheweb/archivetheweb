import useSWR from "swr";

// TODO make this "permanent" by using the data feed from arweave.
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

export function fetchArchivedForURL(url: string) {
  let exampleInfo = {
    screenshot_tx: "./example_screenshot.png",
    title: "BBC Webpage",
    url: url,
    last_archived_timestamp: 1669816063,
    // TODO change this
    // contributions: {
    //   amount: "0.12",
    //   currency: "AR",
    // },
    archived_info: [
      {
        arweave_tx: "AsdeER_dftsfewWDFGwGWEWE3234fWEF#@",
        timestamp: 1669816063,
        uploader_address: "BBBBBBBBBBBBBBBBBBBBBBBB",
      },
      {
        arweave_tx: "AsdeER_dftsfewWDFGwGWEWE3234fWEF#@",
        timestamp: 1669816063,
        uploader_address: "BBBBBBBBBBBBBBBBBBBBBBBB",
      },
      {
        arweave_tx: "AsdeER_dftsfewWDFGwGWEWE3234fWEF#@",
        timestamp: 1669816063,
        uploader_address: "BBBBBBBBBBBBBBBBBBBBBBBB",
      },
    ],
  };

  return { data: exampleInfo, isLoading: false, isError: false };
}
