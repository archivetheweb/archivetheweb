import React, { useContext, useEffect, useState } from "react";
import { Container } from "../components/container";

import { useRouter } from "next/router";
import { isValidUrl } from "../components/utils";
import moment from "moment";
import ConnectorContext from "../context/connector";
import { ArchiveInfo } from "../types/types";

export default function Explore() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  const { contract } = useContext(ConnectorContext);

  const [data, setData] = useState({
    data: [] as ArchiveInfo[],
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    (async () => {
      let state = await contract.currentState();
      // TODO make this more performant

      let res: ArchiveInfo[] = [];
      for (let url in state.archives) {
        let urlArchive = state.archives[url];
        let last_archived_timestamp = Object.keys(urlArchive).reduce((a, b) => {
          if (+a > +b) {
            return a;
          }
          return b;
        });

        res.push({
          screenshot_tx: "./example_screenshot.png",
          title: "TODO",
          url: url,
          last_archived_timestamp: +last_archived_timestamp,
          archived_total: Object.keys(urlArchive).length,
        } as ArchiveInfo);
      }
      setData({ data: res, isLoading: false, isError: false });
    })();
  }, []);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    setURL({
      url: e.currentTarget.value,
      valid: isValidUrl(e.currentTarget.value),
    });
  };

  const handleClick = () => {
    if (!urlInfo.valid) {
      return;
    }

    router.push(`/explore?url=${urlInfo.url}`);
  };

  {
  }
  return (
    <Container>
      <div className="flex flex-col pt-8">
        <div
          className="hero w-full "
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(21, 0, 34, 0.69) 0%, rgba(10, 0, 124, 0.345) 100%),url('./library.png')",
          }}
        >
          <div className="hero-content text-center text-[#FFFFFF] py-24  ">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold ">
                Search for archived websites
              </h1>
              <p className="py-6">
                Archive the Web is an open and decentralized backup of the world
                wide web. Search for websites, tweets, articles and more.
              </p>

              <div className="flex gap-4 ">
                <input
                  type="text"
                  value={urlInfo.url}
                  onChange={handleURL}
                  onKeyDown={(e) =>
                    e.key === "Enter" && urlInfo.valid && handleClick()
                  }
                  placeholder="Search for archived websites by URL (ex. www.bbc.com)"
                  className="input input-bordered w-full h-16 shadow-lg text-[#000000]"
                />

                <button
                  disabled={!urlInfo.valid}
                  onClick={handleClick}
                  style={{ borderRadius: "5px" }}
                  className="btn bg-[#C0ACFF] text-[#FFFFFF] normal-case hover:bg-funpurple/75 border-none h-16 "
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-16">
          <div className="flex flex-row w-full">
            <div className="w-full">
              <div className="text-2xl">Explore archive</div>
              <div className="text-lightgrey">
                See which websites have been archived so far.{" "}
              </div>
            </div>
            <div className="btn normal-case bg-[#FFFFFF] border-extralightgrey p-4 hover:bg-[#FFFFFF] hover:outline-none hover:border-extralightgrey justify-end text-lightgrey">
              Recently Added
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pt-8 gap-4">
            {!data.isLoading &&
              data.data.map((x, i) => {
                return (
                  <div className="card max-w-96 bg-base-100 shadow-xl" key={i}>
                    <figure>
                      <img src={x.screenshot_tx} alt={x.title} />
                    </figure>
                    <div className="card-body p-4">
                      <div className="card-title text-lg">{x.title}</div>
                      <div className="text-lightgrey">
                        <i>{x.url}</i>
                      </div>
                      <div className="text-lightgrey">
                        <i>
                          Last archived:{" "}
                          {moment(x.last_archived_timestamp * 1000).format(
                            "MMMM D YYYY [at] HH:mm:ss"
                          )}
                        </i>
                      </div>
                      <div className="card-actions justify-end">
                        <button
                          onClick={() => router.push(`/url?url=${x.url}`)}
                          className="btn w-full bg-[#FFFFFF] text-funpurple border border-funpurple hover:bg-funpurple/75 normal-case"
                        >
                          View all snapshots
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Container>
  );
}