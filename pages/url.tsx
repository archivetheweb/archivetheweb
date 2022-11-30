import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../components/container";
import info from "../public/info.png";

import { useRouter } from "next/router";
import { isValidUrl } from "../components/utils";
import moment from "moment";

export default function ArchivePage() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  useEffect(() => {
    let url = router.query.url as string;
    let valid = isValidUrl(url);
    if (url && valid) {
      setURL({ url: url, valid });
    } else if (url && !valid) {
      router.push("/");
    }
  }, [router, router.query.url]);

  return (
    <Container>
      <div className="w-full p-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap4">
          <div className="p-4 md:p-8">
            <div className="flex flex-col items-center  aspect-video w-full">
              <iframe className="h-full shadow-2xl w-full " src={urlInfo.url} />
            </div>
          </div>
          <div className="flex flex-col gap-4 p-8">
            <div className="text-2xl ">Al Jazeera</div>
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
          </div>
        </div>
      </div>
    </Container>
  );
}
