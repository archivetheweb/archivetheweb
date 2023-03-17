import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import { isValidUrl, processURL } from "../components/utils";
import ConnectorContext from "../context/connector";
import { ArchiveSubmission } from "../bindings/ts/View";
import moment from "moment";
import axios from "axios";

type ArchiveSubmissionOrNull = ArchiveSubmission | null;

export default function Replay() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ ts: "", url: "", valid: false });
  const { contract } = useContext(ConnectorContext);
  const [data, setData] = useState({
    data: null as ArchiveSubmissionOrNull,
    isLoading: true,
    isError: false,
    sourceURL: "",
  });
  const [listURL, setListURL] = useState(false);

  useEffect(() => {
    let url = router.query.url as string;
    let ts = router.query.ts as string;

    if (url && ts && isValidUrl(url)) {
      setURL({ url, valid: true, ts });

      (async () => {
        try {
          let result = await contract.archivesByURLAndTimestamp({
            url: url,
            timestamp: +ts,
          });

          // this is to play well with firefox
          let source = await axios.head(
            `https://arweave.net/${result.archive.arweaveTx}/data.warc`
          );

          setData({
            data: result.archive,
            isLoading: false,
            isError: false,
            sourceURL: source.request.responseURL,
          });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [router, contract]);

  return (
    <div>
      {data.data === null ? (
        <div></div>
      ) : (
        <div className="flex flex-col h-screen w-full ">
          <div
            className="grid grid-cols-2 md:grid-cols-3 p-8 items-center w-full  border-b border-[#00000033] "
            style={{ color: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="flex gap-8  ">
              <div className="flex justify-center content-center items-center">
                <Link href={"/"}>
                  <Image
                    src={logo}
                    alt="logo"
                    style={{
                      maxHeight: "41px",
                      maxWidth: "140px",
                      minHeight: "30px",
                      minWidth: "100px",
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-col  ">
              <div>
                Snapshot taken:{" "}
                <span className="font-bold">
                  {moment(data.data?.timestamp * 1000).format(
                    "MMMM D YYYY [at] HH:mm:ss"
                  )}
                </span>
              </div>
              <div>
                Snapshot of:{" "}
                <Link
                  className="underline"
                  href={data.data?.fullUrl}
                  target="_blank"
                >
                  {data.data?.fullUrl}
                </Link>
              </div>
              <div>
                <Link
                  className="underline"
                  href={
                    "https://viewblock.io/arweave/tx/" + data.data?.arweaveTx
                  }
                  target="_blank"
                >
                  View on Arweave
                </Link>{" "}
                <div>
                  {" "}
                  <div className="flex gap-3">
                    <span>List URLs</span>
                    <input
                      type="checkbox"
                      className="toggle bg-funpurple"
                      checked={listURL}
                      onClick={() => setListURL(!listURL)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" justify-end hidden md:flex">
              <Link
                href={`/url?url=${urlInfo.url}`}
                className="btn w-fit justify-end bg-funpurple normal-case  text-[#FFFFFF] hover:bg-funpurple/75 border-none"
              >
                See all snapshots of this site
              </Link>
            </div>
          </div>

          <div className="w-full h-full flex justify-center flex-col items-center ">
            <replay-web-page
              source={data.sourceURL}
              url={listURL ? "" : processURL(data.data.fullUrl)}
              embed="replayonly"
              replayBase="./replay/"
            ></replay-web-page>
          </div>
        </div>
      )}
    </div>
  );
}
