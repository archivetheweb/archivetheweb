import React, { useContext, useEffect, useState } from "react";
import { Container } from "../components/container";

import { useRouter } from "next/router";
import { isValidUrl } from "../components/utils";
import moment from "moment";
import ConnectorContext from "../context/connector";
import { ArchiveInfo } from "../bindings/ts/View";
import Image from "next/image";

export default function Explore() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  const { contract } = useContext(ConnectorContext);

  const [data, setData] = useState({
    data: [] as ArchiveInfo[],
    isLoading: true,
    isError: false,
  });
  enum Sorted {
    Title = 1,
    Timestamp = 2,
  }
  const [sorting, setSorting] = useState(Sorted.Title);

  useEffect(() => {
    (async () => {
      let result = await contract.archives({});
      setData({ data: result.archives, isLoading: false, isError: false });
    })();
  }, [contract]);

  useEffect(() => {
    let url = router.query.url as string;
    let valid = isValidUrl(url);
    if (url && valid) {
      setURL({ url: url, valid });
    }
    return () => {};
  }, [router, router.query.url]);

  useEffect(() => {
    if (sorting === Sorted.Timestamp) {
      setData({
        data: data.data.sort((a, b) => {
          if (a.lastArchivedTimestamp > b.lastArchivedTimestamp) {
            return -1;
          } else if (a.lastArchivedTimestamp < b.lastArchivedTimestamp) {
            return 1;
          } else {
            return 0;
          }
        }),
        isLoading: data.isLoading,
        isError: data.isError,
      });
    } else if (sorting === Sorted.Title) {
      setData({
        data: data.data.sort((a, b) => {
          if (a.title > b.title) {
            return 1;
          } else if (a.title < b.title) {
            return -1;
          } else {
            return 0;
          }
        }),
        isLoading: data.isLoading,
        isError: data.isError,
      });
    }
  }, [sorting, data.data]);

  const handleURL = (e: React.FormEvent<HTMLInputElement>) => {
    setURL({
      url: e.currentTarget.value,
      valid: isValidUrl(e.currentTarget.value),
    });
  };

  const handleRecentlyAdded = () => {
    if (sorting == Sorted.Timestamp) {
      setSorting(Sorted.Title);
    } else {
      setSorting(Sorted.Timestamp);
    }
  };

  const handleClearSearch = () => {
    setURL({ url: "", valid: false });
    router.push("/explore");
  };

  const handleSearch = () => {
    if (!urlInfo.valid) {
      return;
    }

    router.push(`/url?url=${urlInfo.url}`);
  };

  let filteredData = [] as ArchiveInfo[];
  if (data.data && !data.isLoading) {
    filteredData = data.data.filter((x) => {
      if (urlInfo.url && urlInfo.valid) {
        if (x.url == urlInfo.url) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
  }

  return (
    <Container>
      <div className="flex flex-col pt-8 ">
        <div
          className="hero w-full"
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
                    e.key === "Enter" && urlInfo.valid && handleSearch()
                  }
                  placeholder="Search for archived websites by URL (ex. www.bbc.com)"
                  className="input input-bordered w-full h-16 shadow-lg text-[#000000]"
                />

                <button
                  disabled={!urlInfo.valid}
                  onClick={handleSearch}
                  style={{ borderRadius: "5px" }}
                  className="btn bg-[#C0ACFF] text-[#FFFFFF] normal-case hover:bg-funpurple/75 border-none h-16 "
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          {data.isLoading ? (
            <div className="flex items-center justify-center h-48 loading btn bg-[#FFFFFF] border-none">
              Loading...
            </div>
          ) : (
            <div className="w-full p-8 md:p-16">
              <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0 ">
                <div className="w-full">
                  <div className="text-2xl">Explore archive</div>
                  <div className="text-lightgrey">
                    See which websites have been archived so far.{" "}
                  </div>
                </div>
                <div
                  onClick={() => handleRecentlyAdded()}
                  className="btn normal-case bg-[#FFFFFF] border-extralightgrey p-4 hover:bg-[#FFFFFF] hover:outline-none hover:border-extralightgrey justify-center md:justify-end text-lightgrey"
                >
                  Recently Added
                </div>
              </div>
              {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <div>No archive found</div>
                  <div
                    onClick={handleClearSearch}
                    className="btn normal-case bg-[#FFFFFF] border-extralightgrey p-4 hover:bg-[#FFFFFF] hover:outline-none hover:border-extralightgrey justify-center  text-lightgrey"
                  >
                    Clear search
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pt-8 gap-4">
                {filteredData.length > 0 &&
                  filteredData.map((x, i) => {
                    return (
                      <div
                        className="card max-w-96 bg-base-100 shadow-xl "
                        key={i}
                      >
                        <div>
                          <figure className="">
                            <Image
                              src={`https://arweave.net/${x.screenshotTx}`}
                              alt={x.title}
                              width={250}
                              height={250}
                            />
                          </figure>
                        </div>
                        <div className="card-body p-4">
                          <div className="card-title text-lg">
                            {x.title || "N/A"}
                          </div>
                          <div className="text-lightgrey">
                            <i>{x.url}</i>
                          </div>
                          <div className="text-lightgrey">
                            <i>
                              Last archived:{" "}
                              {moment(x.lastArchivedTimestamp * 1000).format(
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
          )}
        </div>
      </div>
    </Container>
  );
}
