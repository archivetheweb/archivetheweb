import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import info from "../public/info.png";
import chevron from "../public/chevron.png";
import { useRouter } from "next/router";
import {
  calculateUploadPriceWithDepth,
  isValidUrl,
  MB,
  shortenAddress,
} from "../components/utils";
import { fetchArweaveMarketPrice, fetchBundlrPrice } from "../http/fetcher";
import arrowTopRight from "../public/arrow_top_right.png";
import link from "../public/link.png";
import saveWhite from "../public/save_white.png";
import ConnectorContext from "../context/connector";
import {
  ArchivesByURLInfo,
  ArchivesByURLResult,
  ArchiveSubmission,
} from "../bindings/ts/View";
import moment from "moment";
import CustomIframe from "../components/iframe";
import { Depth } from "../components/types";
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
// import plus from "../public/plus.png";
// import Countdown from "react-countdown";

type Data = ArchivesByURLInfo | null;

interface GroupMap {
  [k: string]: ArchiveSubmission[];
}

interface GroupedData {
  data: GroupMap;
  groupedBy: string;
}

interface State {
  data: Data;
  groupedData: GroupedData;
  isLoading: boolean;
  isError: boolean;
}

export default function ArchivePage() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  const [data, setData] = useState({
    data: null as Data,
    groupedData: {} as GroupedData,
    isLoading: true,
    isError: false,
  } as State);
  const [toExpand, setToExpand] = useState("");
  const priceInfo = fetchArweaveMarketPrice();
  const bundlrPriceInfo = fetchBundlrPrice();
  // let [nextSnap, setNextSnap] = useState(0);
  const { contract, warp } = useContext(ConnectorContext);
  let [costPerSnapshot, setCostPerSnapshot] = useState({
    usd: "",
    winston: "",
  });

  useEffect(() => {
    if (!priceInfo.isLoading && !bundlrPriceInfo.isLoading) {
      (async () => {
        let arweaveFeeForMB = bundlrPriceInfo.price;
        setCostPerSnapshot(
          calculateUploadPriceWithDepth(
            +arweaveFeeForMB,
            Depth.PageOnly,
            +priceInfo.price
          )
        );
      })();
    }
  }, [
    priceInfo.price,
    priceInfo.isLoading,
    bundlrPriceInfo.isLoading,
    bundlrPriceInfo.price,
  ]);

  useEffect(() => {
    let url = router.query.url as string;
    if (!url) {
      return;
    }
    let valid = isValidUrl(url);
    if (url && valid) {
      setURL({ url: url, valid });
      (async () => {
        try {
          let result = await contract.archivesByURL({ url: url, count: 100 });

          let groupedArchives: GroupedData = { groupedBy: "date", data: {} };
          if (url.includes("twitter.com")) {
            groupedArchives = groupArchivesByTwitterHandle(result);
          } else {
            groupedArchives = groupArchivesByDate(result);
          }
          console.log(groupedArchives);
          setData({
            data: result.archives,
            groupedData: groupedArchives,
            isLoading: false,
            isError: false,
          });
        } catch (e: any) {
          console.error(e);
          setData({
            data: null as Data,
            groupedData: {} as GroupedData,
            isLoading: false,
            isError: false,
          });
        }
      })();
    }
    return () => {};
  }, [router.query.url, contract]);

  const groupArchivesByDate = (data: ArchivesByURLResult): GroupedData => {
    let groupedArchives: GroupedData = { groupedBy: "date", data: {} };
    for (let archive of data.archives.archivedInfo) {
      let ts = archive.timestamp;
      let dayFormatted = moment(ts * 1000).format("MMMM DD, YYYY");
      if (!groupedArchives.data[dayFormatted]) {
        groupedArchives.data[dayFormatted] = [archive];
      } else {
        groupedArchives.data[dayFormatted].push(archive);
      }
    }
    return groupedArchives;
  };

  const groupArchivesByTwitterHandle = (
    data: ArchivesByURLResult
  ): GroupedData => {
    let groupedArchives: GroupedData = { groupedBy: "twitter", data: {} };
    for (let archive of data.archives.archivedInfo) {
      // get twitter handle from full url
      let twitterHandle = archive.fullUrl.split("/")[3]; // https://twitter.com/username/status/1234567890
      if (!groupedArchives.data[twitterHandle]) {
        groupedArchives.data[twitterHandle] = [archive];
      } else {
        groupedArchives.data[twitterHandle].push(archive);
      }
    }
    return groupedArchives;
  };

  const getTimeKey = (timestamp: number): string => {
    return moment(timestamp * 1000).format("MMMM DD, YYYY");
  };

  const handleClick = () => {
    if (!urlInfo.valid) {
      return;
    }
    router.push("/save?url=https://" + urlInfo.url);
  };

  const createTableData = (
    url: string,
    data: ArchiveSubmission,
    total: number,
    key: number,
    expansion: boolean
  ) => {
    return (
      <tr key={key}>
        <td>
          <Link
            className="underline"
            href={`/replay?url=${url}&ts=${data.timestamp}`}
          >
            {getTimeKey(data.timestamp)}
          </Link>
        </td>
        <td>{moment(data.timestamp * 1000).format("HH:mm:ss")}</td>
        <td>{total === 0 || total}</td>
        <td>
          <Link
            target={"_blank"}
            className="underline"
            href={`https://viewblock.io/arweave/address/${data.uploaderAddress}`}
          >
            {shortenAddress(data.uploaderAddress)}
          </Link>
        </td>
        <td>
          {expansion
            ? data.options.depth === Depth.PageOnly
              ? "No"
              : "Yes"
            : ""}
        </td>
        <td>
          <div
            onClick={() => {
              let t = getTimeKey(data.timestamp);
              if (toExpand == t) {
                setToExpand("");
              } else {
                setToExpand(t);
              }
            }}
            className="flex gap-2 items-center "
          >
            {total === 0 ? (
              <div className="flex items-center gap-1">
                <Link
                  className="underline"
                  href={`/replay?url=${url}&ts=${data.timestamp}`}
                  target="_blank"
                >
                  View this snapshot
                </Link>
                <Image
                  src={arrowTopRight}
                  alt="arrowTopRight"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            ) : getTimeKey(data.timestamp) === toExpand ? (
              <div className="flex items-center underline">
                Collapse all snapshots{" "}
                <Image
                  src={chevron}
                  className="rotate-180"
                  alt="chevron"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center underline">
                Expand all snapshots{" "}
                <Image
                  src={chevron}
                  alt="chevron"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const createDateTimeTable = (data: State) => {
    return (
      <table className="table w-full border-b border border-extralightgrey">
        <thead>
          <tr className="border-b p-4 border border-extralightgrey">
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Date</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Time</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1"># Snapshots</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Uploader</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Linked Pages</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Expand all</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.keys(data.groupedData.data).map((x: string, i: number) => {
              // determine if we need to expand more here
              return (
                <>
                  {createTableData(
                    data.data?.url || "",
                    data.groupedData.data[x][0],
                    data.groupedData.data[x].length,
                    i,
                    false
                  )}
                  {toExpand === x &&
                    data.groupedData.data[x].map((elem, index) => {
                      return createTableData(
                        data.data?.url || "",
                        elem,
                        0,
                        index * 100,
                        true
                      );
                    })}
                </>
              );
            })}
        </tbody>
      </table>
    );
  };
  const createTwitterTable = (data: State) => {
    return (
      <table className="table w-full border-b border border-extralightgrey">
        <thead>
          <tr className="border-b p-4 border border-extralightgrey">
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Username</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Date</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Time</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1"># Snapshots</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Uploader</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Linked Pages</th>
            <th className="bg-[#FFFFFF] text-lightgrey py-1">Expand all</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.keys(data.groupedData.data).map((x: string, i: number) => {
              // determine if we need to expand more here
              return (
                <>
                  {createTwitterTableData(
                    data.data?.url || "",
                    data.groupedData.data[x][0],
                    data.groupedData.data[x].length,
                    i,
                    false
                  )}
                  {toExpand === x &&
                    data.groupedData.data[x].map((elem, index) => {
                      return createTwitterTableData(
                        data.data?.url || "",
                        elem,
                        0,
                        index * 100,
                        true
                      );
                    })}
                </>
              );
            })}
        </tbody>
      </table>
    );
  };

  const createTwitterTableData = (
    url: string,
    data: ArchiveSubmission,
    total: number,
    key: number,
    expansion: boolean
  ) => {
    let username = data.fullUrl.split("/")[3];
    return (
      <tr key={key}>
        <td>{username}</td>
        <td>
          <Link
            className="underline"
            href={`/replay?url=${url}&ts=${data.timestamp}`}
          >
            {getTimeKey(data.timestamp)}
          </Link>
        </td>
        <td>{moment(data.timestamp * 1000).format("HH:mm:ss")}</td>
        <td>{total === 0 || total}</td>
        <td>
          <Link
            target={"_blank"}
            className="underline"
            href={`https://viewblock.io/arweave/address/${data.uploaderAddress}`}
          >
            {shortenAddress(data.uploaderAddress)}
          </Link>
        </td>
        <td>
          {expansion
            ? data.options.depth === Depth.PageOnly
              ? "No"
              : "Yes"
            : ""}
        </td>
        <td>
          <div
            onClick={() => {
              if (toExpand == username) {
                setToExpand("");
              } else {
                setToExpand(username);
              }
            }}
            className="flex gap-2 items-center "
          >
            {total === 0 ? (
              <div className="flex items-center gap-1">
                <Link
                  className="underline"
                  href={`/replay?url=${url}&ts=${data.timestamp}`}
                  target="_blank"
                >
                  View this snapshot
                </Link>
                <Image
                  src={arrowTopRight}
                  alt="arrowTopRight"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            ) : getTimeKey(data.timestamp) === toExpand ? (
              <div className="flex items-center underline">
                Collapse all snapshots{" "}
                <Image
                  src={chevron}
                  className="rotate-180"
                  alt="chevron"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center underline">
                Expand all snapshots{" "}
                <Image
                  src={chevron}
                  alt="chevron"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                />
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Container>
      {data.isLoading ? (
        <div className="flex items-center justify-center h-full loading btn bg-[#FFFFFF] border-none">
          Loading....
        </div>
      ) : (
        <div className="w-full p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap4">
            {data.data === null ? (
              <div className="p-4 md:p-8">
                <div className="flex flex-col items-center  aspect-video w-full h-full">
                  <CustomIframe
                    className="h-full shadow-2xl w-full "
                    src={"https://" + urlInfo.url}
                  >
                    <></>
                  </CustomIframe>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-8">
                <div className="flex flex-col items-center  aspect-video w-full h-full">
                  <img
                    src={`https://arweave.net/` + data.data?.screenshotTx}
                    alt={data.data?.title}
                    width={750}
                    height={750}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 p-4 md:p-8">
              {data.data !== null ? (
                <>
                  <div className="text-2xl ">{data.data?.title}</div>
                  <div className="">
                    <a
                      href={"https://" + data.data?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline "
                    >
                      {data.data?.url}
                    </a>
                  </div>

                  <div className="grid grid-cols-2 p-6 border border-extralightgrey rounded ">
                    <div className="flex flex-col gap-2">
                      <div className="text-lightgrey">Snapshots taken</div>
                      <div className="text-lightgrey">Most recent snapshot</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>{data.data?.archivedInfo.length}</div>
                      <div>
                        <Link
                          className="underline"
                          href={`/replay?url=${data.data?.url}&ts=${data.data?.lastArchivedTimestamp}`}
                        >
                          {data.data
                            ? moment(
                                data.data?.lastArchivedTimestamp * 1000
                              ).format("MMMM D YYYY [at] HH:mm:ss")
                            : ""}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="grid  ">
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 "> */}
                    {/* <div className="flex flex-col gap-4  border border-extralightgrey rounded"> */}
                    {/* <div className="text-lg p-6 border-b border-extralightgrey">
                      {" "}
                      Next Snapshot
                    </div>
                    <div className="p-6 ">
                      <Countdown date={data.data.next_snapshot_timestamp * 1000} />
                    </div>
                    <div className="p-6 ">
                      {data.data.snapshot_remaining} snapshots remaining
                    </div> */}
                    <div className=" pb-6">
                      <button
                        // disabled={!urlInfo.valid}
                        onClick={() => {
                          router.push(`/save?url=https://${urlInfo.url}`);
                        }}
                        style={{ borderRadius: "5px" }}
                        className="btn w-full bg-[#C0ACFF] text-[#FFFFFF] normal-case hover:bg-funpurple/75 border-none h-16 "
                      >
                        <div className="flex justify-center items-center gap-2">
                          <div className="flex justify-center items-center gap-2">
                            <Image
                              src={saveWhite}
                              alt="save"
                              style={{ width: "24px", height: "24px" }}
                            />{" "}
                            <div className="">Take snapshot now</div>
                          </div>
                        </div>
                      </button>
                      {/* </div> */}
                    </div>

                    {/* TODO ADD THIS BACK */}
                    {/* <div className="flex flex-col gap-4 border border-extralightgrey rounded">
                    <div className="p-6 border-b border-extralightgrey ">
                      Contributions
                    </div>
                    <div className="p-6 ">
                      {data.data.contributions.amount} {data.data.contributions.currency}
                    </div>
                    <div className="p-6 ">
                      {isLoading
                        ? ""
                        : `USD $${
                            Math.round(
                              +price * +data.data.contributions.amount * 100
                            ) / 100
                          }`}
                    </div>
                    <div className="px-6 pb-6">
                      <button
                        // disabled={!urlInfo.valid}
                        // onClick={handleClick}
                        style={{ borderRadius: "5px" }}
                        className="btn w-full bg-[#FFFFFF] text-funpurple normal-case hover:bg-funpurple/75 border-extralightgrey h-16 "
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Image
                            src={plus}
                            alt="plus"
                            style={{ width: "14px", height: "14px" }}
                          />{" "}
                          <div>Contribute</div>
                        </div>
                      </button>
                    </div>
                  </div> */}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl ">{urlInfo.url}</div>
                  <div className="flex align-items gap-1 items-center">
                    <Image
                      style={{ width: "14px", height: "14px" }}
                      src={link}
                      alt={"link"}
                    />
                    <a
                      href={"https://" + urlInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline "
                    >
                      {urlInfo.url}
                    </a>
                  </div>
                  <div className="font-bold text-[#C7942A] p-6 rounded border  border-[#C7942A] bg-[#FFF9ED] mb-4">
                    This URL has not been archived yet.{" "}
                  </div>
                  <div className="flex flex-col gap-4 p-6 border border-extralightgrey rounded">
                    <div className="flex gap-4 items-center text-funpurple font-bold">
                      <Image
                        src={info}
                        alt="info 1"
                        style={{ width: "18px", height: "18px" }}
                      />
                      It costs on average ${costPerSnapshot.usd} USD to archive
                      a website permanently.{" "}
                    </div>
                    <div>Would you like to archive this site now?</div>
                    <button
                      // disabled={!urlInfo.valid}
                      onClick={handleClick}
                      style={{ borderRadius: "5px" }}
                      className="btn bg-[#8B66FF] text-[#FFFFFF] normal-case hover:bg-funpurple/75 border-none h-16 "
                    >
                      Archive this site
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          {data.data !== null ? (
            <div className="flex w-full  ">
              <div className="w-full">
                <div className="border-b p-4 border border-extralightgrey ">
                  Snapshot history
                </div>
                {data.groupedData.groupedBy === "date"
                  ? createDateTimeTable(data)
                  : createTwitterTable(data)}
                <div className="overflow-x-auto"></div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Container>
  );
}
