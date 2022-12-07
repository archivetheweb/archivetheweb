import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import info from "../public/info.png";
import chevron from "../public/chevron.png";
import { useRouter } from "next/router";
import { isValidUrl } from "../components/utils";
import moment from "moment";
import CustomIframe from "../components/iframe";
import { fetchArchivedForURL, fetchPrice } from "../http/fetcher";
import plus from "../public/plus.png";
import saveWhite from "../public/save_white.png";
import Countdown from "react-countdown";
import Script from "next/script";
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

export default function ArchivePage() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [data, setData] = useState(null as any);
  let { price, isLoading } = fetchPrice();
  let [nextSnap, setNextSnap] = useState(0);

  useEffect(() => {
    let url = router.query.url as string;
    let valid = isValidUrl(url);
    if (url && valid) {
      setURL({ url: url, valid });
      let { data } = fetchArchivedForURL(url);
      setData(data);
    } else if (url && !valid) {
      router.push("/");
    }
    return () => {};
  }, [router, router.query.url]);

  return (
    <Container>
      <Script strategy="beforeInteractive" src="./ui.js" />
      <div className="w-full p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap4">
          <div className="p-4 md:p-8">
            <div className="flex flex-col items-center  aspect-video w-full h-full">
              {/* <CustomIframe
                className="h-full shadow-2xl w-full "
                src={urlInfo.url}
              >
                <></>
              </CustomIframe> */}
              {/* //@ts-ignore */}
              <replay-web-page
                source="https://arweave.net/Pc0bvlWuS97mEIyaLmP8pZi9J3dQF9mQsbs1dMJgOtM/data.warc"
                url="https://www.wikipedia.org"
                embed="default"
                replayBase="./"
              ></replay-web-page>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-8">
            {data ? (
              <>
                <div className="text-2xl ">{data.title}</div>
                <div className="">
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline "
                  >
                    {data.url}
                  </a>
                </div>
                <div className="grid grid-cols-2 p-6 border border-extralightgrey rounded ">
                  <div className="flex flex-col">
                    <div className="text-lightgrey">Snapshots taken</div>
                    <div className="text-lightgrey">Most recent snapshot</div>
                  </div>
                  <div>
                    <div>{data.snapshots_taken}</div>
                    <div>
                      <a className="underline" href="">
                        {moment(data.last_archived_timestamp * 1000).format(
                          "MMMM D YYYY [at] HH:mm:ss"
                        )}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="flex flex-col gap-4  border border-extralightgrey rounded">
                    <div className="text-lg p-6 border-b border-extralightgrey">
                      {" "}
                      Next Snapshot
                    </div>
                    <div className="p-6 ">
                      <Countdown date={data.next_snapshot_timestamp * 1000} />
                    </div>
                    <div className="p-6 ">
                      {data.snapshot_remaining} snapshots remaining
                    </div>
                    <div className="px-6 pb-6">
                      <button
                        // disabled={!urlInfo.valid}
                        // onClick={handleClick}
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
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 border border-extralightgrey rounded">
                    <div className="p-6 border-b border-extralightgrey ">
                      Contributions
                    </div>
                    <div className="p-6 ">
                      {data.contributions.amount} {data.contributions.currency}
                    </div>
                    <div className="p-6 ">
                      {isLoading
                        ? ""
                        : `USD $${
                            Math.round(
                              +price * +data.contributions.amount * 100
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
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl ">{urlInfo.url}</div>
                <div className="">
                  <a
                    href={urlInfo.url}
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
                    It costs $0.007 USD to archive a website permanently.{" "}
                  </div>
                  <div>Would you like to archive this site now?</div>
                  <button
                    // disabled={!urlInfo.valid}
                    // onClick={handleClick}
                    style={{ borderRadius: "5px" }}
                    className="btn bg-[#C0ACFF] text-[#FFFFFF] normal-case hover:bg-funpurple/75 border-none h-16 "
                  >
                    Archive this site
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full ">
          <div className="w-full">
            <div className="border-b p-4 border border-extralightgrey ">
              Snapshot history
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="">
                    <th className="bg-[#FFFFFF] py-1">Date</th>
                    <th className="bg-[#FFFFFF] py-1">Time</th>
                    <th className="bg-[#FFFFFF] py-1"># Snapshots</th>
                    <th className="bg-[#FFFFFF] py-1">Sponsor</th>
                    <th className="bg-[#FFFFFF] py-1">Expand all</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.archived_info.map((x: any, i: number) => {
                      return (
                        <tr key={i}>
                          <td>
                            {moment(x.timestamp * 1000).format("MMMM DD, YYYY")}
                          </td>
                          <td>
                            {moment(x.timestamp * 1000).format("hh:mm:ss")}
                          </td>
                          <td>1</td>
                          <td>{x.archived_by}</td>
                          <td>
                            <button className="underline">
                              <div className="flex gap-2 items-center">
                                Expand all snapshots{" "}
                                <Image
                                  src={chevron}
                                  alt="chevron"
                                  style={{ height: "24px", width: "24px" }}
                                />
                              </div>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
