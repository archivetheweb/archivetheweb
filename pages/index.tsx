import { Header } from "../components/header";
import { Footer } from "../components/footer";
import arweave from "../public/ar.png";
import mainHeader from "../public/main_header.png";
import Image from "next/image";
import { useState } from "react";
import { isValidUrl } from "../components/utils";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });

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

    router.push(`/save?url=${urlInfo.url}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header className="px-24" />
      <div className="grow ">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row md:flex-col-reverse px-8">
            <div>
              <div className="text-funpurple text-2xl font-bold ">
                Archive what matters to you
              </div>
              <h1 className="text-7xl font-bold">
                An open & permanent public web archive <u>for everyone</u>
              </h1>
              <p className="py-6 text-xl">
                Archive the Web is an open and decentralized backup of the world
                wide web. You can set up long term archiving of websites,
                tweets, articles and more.
              </p>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={urlInfo.url}
                  onChange={handleURL}
                  onKeyDown={(e) =>
                    e.key === "Enter" && urlInfo.valid && handleClick()
                  }
                  placeholder="Enter a website to save (ex. www.bbc.com)"
                  className="input input-bordered w-full h-16 shadow-lg"
                />

                <button
                  disabled={!urlInfo.valid}
                  onClick={handleClick}
                  className="btn bg-funpurple text-[#FFFFFF] hover:bg-funpurple/75 border-none h-16 "
                >
                  Save a Website
                </button>
              </div>
            </div>
            <Image src={mainHeader} className="" alt="library" />
          </div>
        </div>
        <div className="flex justify-center content-center items-center w-full h-32 bg-gradient-to-r from-funbrightpurple via-funmidpurple to-funpurple">
          <div className="grid grid-cols-7">
            <div className="text-[#FFFFFF] p-4 text-center">
              Sites recently snapshotted
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
            <div className="">
              <Image src={arweave} alt="alt" />
            </div>
          </div>
        </div>
      </div>
      <Footer />;
    </div>
  );
}
