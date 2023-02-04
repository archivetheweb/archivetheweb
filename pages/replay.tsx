import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import { isValidUrl } from "../components/utils";
import Script from "next/script";
import ConnectorContext from "../context/connector";
import { ArchiveSubmission } from "../bindings/ts/View";

type ArchiveSubmissionOrNull = ArchiveSubmission | null;

export default function Replay() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ ts: "", url: "", valid: false });
  const { contract } = useContext(ConnectorContext);
  const [data, setData] = useState({
    data: null as ArchiveSubmissionOrNull,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    let url = router.query.url as string;
    let ts = router.query.ts as string;

    console.log(ts, url);

    if (url && ts && isValidUrl(url)) {
      setURL({ url, valid: true, ts });

      (async () => {
        try {
          let result = await contract.archivesByURLAndTimestamp({
            url: url,
            timestamp: +ts,
          });
          console.log(result.archive);

          setData({ data: result.archive, isLoading: false, isError: false });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-full">
      <Script strategy="beforeInteractive" src="./ui.js" />
      <div
        className="grid grid-cols-2 md:grid-cols-3 p-8 items-center w-full"
        style={{ color: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="flex gap-8 ">
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
            <span className="font-bold">November 1, 2022 at 8:00PM GMT</span>
          </div>
          <div>
            Snapshot of:{" "}
            <Link className="underline" href={"https://www.bbc.com"}>
              https://www.bbc.com
            </Link>
          </div>
          <div>
            <Link className="underline" href={"https://viewblock.com"}>
              View on Arweave
            </Link>{" "}
          </div>
        </div>
        <div className=" justify-end hidden md:flex">
          <div
            onClick={() => router.push("/explore")}
            className="btn w-fit justify-end bg-funpurple normal-case  text-[#FFFFFF] hover:bg-funpurple/75 border-none"
          >
            See all snapshots of this site
          </div>
        </div>
      </div>

      <div className="w-full h-full flex justify-center flex-col items-center">
        <replay-web-page
          source="https://arweave.net/Pc0bvlWuS97mEIyaLmP8pZi9J3dQF9mQsbs1dMJgOtM/data.warc"
          url="https://www.wikipedia.org"
          embed="replayonly"
          replayBase="./"
        ></replay-web-page>
      </div>
    </div>
  );
}
