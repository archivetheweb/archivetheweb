// IMAGES
import arweave from "../public/ar.png";
import monkey from "../public/monkey.png";
import apple from "../public/apple.png";
import door from "../public/door.png";
import fire from "../public/fire.png";
import opinions from "../public/opinions.png";
import unpaid from "../public/unpaid.png";
import magnifyingGlass from "../public/magnifying_glass.png";
import safe from "../public/safe.png";
import puzzle from "../public/puzzle.png";
import eth from "../public/eth.png";
import svg from "../public/copy.svg";
import faqImage from "../public/faq.png";
import gh from "../public/github.png";
import diagram from "../public/diagram.png";
import openArchive from "../public/open_archive.png";
import mainHeader from "../public/main_header.png";
import library from "../public/page_break.png";

import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Image from "next/image";
import { useState } from "react";
import { isValidUrl, Toast } from "../components/utils";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [toastMessage, setToastMessage] = useState(<></>);

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

  const handleCopyArClick = (e: any) => {
    navigator.clipboard.writeText(e.target.childNodes[0].data);

    setToastMessage(
      <span>
        <b>Arweave</b> address copied!
      </span>
    );
  };

  const handleCopyEthClick = (e: any) => {
    navigator.clipboard.writeText(e.target.childNodes[0].data);
    setToastMessage(
      <span>
        <b>ETH</b> address copied!
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Toast message={toastMessage} />
      <div className="grow ">
        <Header className="px-16 pb-16" />
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row md:flex-col   px-16">
            <div>
              <div className="text-funpurple text-2xl font-bold ">
                Archive what matters to you
              </div>
              <h1 className="text-7xl font-bold">
                An open & permanent public web archive <u>for everyone</u>
              </h1>
              <p className="py-6 text-xl text-lightgrey">
                Archive the Web is an open and decentralized backup of the world
                wide web. You can set up long term archiving of websites,
                tweets, articles and more.
              </p>
              <div className="flex gap-4">
                <br />
                <br />
                <br />
                <br />
                {/* <input
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
                </button> */}
              </div>
            </div>
            <div className="flex justify-center items-center p-16">
              <Image
                src={mainHeader}
                className="max-h-full"
                // height={413}
                // width={353}
                style={{ maxHeight: "413px", maxWidth: "353px" }}
                alt="man fetching book in library"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center content-center items-center w-full h-32 bg-gradient-to-r from-funbrightpurple via-funmidpurple to-funpurple">
          {/* <div className="grid grid-cols-7" hidden={true}>
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
          </div>*/}
        </div>
        <div className="flex text-center w-full justify-center px-16 py-8 text-3xl font-bold">
          The average website is{" "}
          <span className="px-2 text-[#9FC5FF]">altered</span> or{" "}
          <span className="px-2 text-[#FF7170]"> deleted</span> after{" "}
          <span className="px-2 text-funmidpurple">92 days.</span>
        </div>

        <div className="grid grid-cols-2 px-16 gap-8 ">
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={monkey}
              style={{ height: "100px", width: "100px" }}
              alt="monkey"
            />
            <div>
              <div className="font-bold pb-1">Content is censored</div>
              <div className="text-lightgrey">
                As of December 15, 2022 Chinese social media and web video
                platforms must approve all news-related comments before they go
                online and step up training for censors to keep out “harmful”
                content.
              </div>
            </div>
          </div>
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={opinions}
              alt="opinions"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Opinions change</div>
              <div className="text-lightgrey">
                In 2013, ten years’ worth of British Conservative Party speeches
                and press releases were abruptly deleted from their website.
              </div>
            </div>
          </div>
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={door}
              alt="door"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Organizations close</div>
              <div className="text-lightgrey">
                Companies can shut down and lose the data you entrusted them to
                keep as well as their own websites and information.
              </div>
            </div>
          </div>
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={apple}
              alt="apple"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Links rot</div>
              <div className="text-lightgrey">
                As of 2013, 49% of hyperlinks cited in United States Supreme
                Court decisions no longer worked.
              </div>
            </div>
          </div>
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={unpaid}
              alt="wallet"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Hosting is unpaid</div>
              <div className="text-lightgrey">
                Hosting services can be left unpaid and content abandoned.
              </div>
            </div>
          </div>
          <div className="flex border rounded-md p-8 gap-4">
            <Image
              src={fire}
              alt="fire"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Servers go down</div>
              <div className="text-lightgrey">
                In 2019, MySpace mysteriously lost 12 years of music uploads,
                totalling 50+ million songs from 14 million artists.
              </div>
            </div>
          </div>
        </div>
        <Image className="w-full py-16" src={library} alt="library" />

        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div>
            <div className="text-3xl font-bold pb-8">
              Introducing an open archive
            </div>
            <div className="text-lightgrey">
              Archive the Web is an open source website archiving tool that
              allows users to set up automated website archiving stored on
              Arweave. Our mission at Archive the Web is to help create a
              decentralized backup of the world wide web.
              <br /> <br />
              It is open by default, you simply need to select the content you
              want to include.
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "398px", maxWidth: "398px" }}
              src={openArchive}
              alt="open archive"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "398px", maxWidth: "398px" }}
              src={safe}
              alt="safe"
            />
          </div>
          <div>
            <a id="how_it_works" />

            <div className="text-3xl font-bold pb-8">How it works</div>

            <div className="text-lightgrey pb-2 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">1</span>{" "}
              Find a website you want to archive
            </div>
            <div className="text-lightgrey pb-2 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">2</span>{" "}
              Select a duration and frequency for website snapshots
            </div>
            <div className="text-lightgrey pb-8 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">3</span>{" "}
              Pay the storage fee. Multiple payment methods available.
            </div>
            <div className="text-lightgrey pb-2">
              That’s all! Snapshots will be automatically taken until the
              prepayment has been completely used.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div>
            <div className="text-3xl font-bold pb-8">
              Archive what matters to you
            </div>
            <div className="text-lightgrey">
              This is an open archive for all to contribute to regardless of
              your political, religious or ideological beliefs. We hope that by
              working together, a diverse and unbiased set of information will
              be preserved here for future historical purposes.
              <br />
              <br />
              From news to important artworks to public facing governmental
              information, we believe that by working together, we can create a
              strong archive of our digital footprint.
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "398px", maxWidth: "398px" }}
              src={magnifyingGlass}
              alt="magnifying glass"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "398px", maxWidth: "398px" }}
              src={diagram}
              alt="diagram"
            />
          </div>
          <div>
            <div className="text-3xl font-bold pb-8">Built to last</div>
            <div className="text-lightgrey">
              All website snapshots taken are stored on the permaweb which
              exists on the Arweave network.
              <br />
              <br /> This network charges an upfront fee or an “endowment” to
              have data added to the network. The fee is calculated so that the
              data is estimated to be stored for a period of at least 200 years.{" "}
              <br />
              <br />
              People or “nodes” are incentivized to store data saved on the
              network with rewards issued by Arweave in their native currency,
              AR. After XX years, no new AR will be issued and nodes will be
              paid by the endowment fees the network has accrued.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div>
            <a id="faq" />

            <div className="text-3xl font-bold pb-2">
              Frequently Asked Questions
            </div>
            <div className="text-lightgrey">
              {faq.map((x) => (
                <>
                  <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium text-[#000000]">
                      {x.question}
                    </div>
                    <div className="collapse-content">
                      <p>{x.answer}</p>
                    </div>
                  </div>
                  <div className="divider m-0  before:bg-[#000000] after:bg-[#000000]"></div>
                </>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "398px", maxWidth: "398px" }}
              src={faqImage}
              alt="faq"
            />
          </div>
        </div>
        <a id="contribute" />

        <div className="grid grid-cols-2 px-16 gap-4 justify-center content-center w-full pb-16">
          <div>
            <div className="text-3xl font-bold pb-8">
              Help build Archive the Web
            </div>
            <div className="text-lightgrey">
              Archive the Web is an open source project. Anyone is welcome to
              contribute to the project. Start getting involved by visiting our
              github repository!
              <br />
              <br />
              <button
                onClick={() =>
                  window.open("https://github.com/archivetheweb/archivetheweb")
                }
                className="btn btn-outline  text-funpurple hover:bg-funpurple/75 border-funpurple h-16 "
              >
                <Image src={gh} height={24} width={24} alt="github" />
                <span className="pl-2">Github</span>
              </button>
            </div>
            <div className="text-3xl font-bold pb-8 pt-10">
              Donate to Archive the Web
            </div>
            <div className="text-lightgrey">
              Another way you can contribute to Archive the Web is by donating
              to support the platform’s open source development. Any donation is
              greatly appreciated. Our ETH and AR addresses are included below.
            </div>
            <br />
            <br />
            <div className="flex justify-center content-center items-center gap-2 border rounded-lg p-2 border-[#D9D9D9]">
              <button className="flex flex-row w-full items-center">
                <Image
                  src={eth}
                  style={{ width: "12px", height: "18px" }}
                  alt="eth"
                />
                <div
                  className="grow text-center text-lightgrey"
                  onClick={handleCopyEthClick}
                >
                  0x9655443B0DBA59d9125d2fEC98f84f4c9c0460BE
                </div>
                <Image className=" " src={svg} alt="copy eth address" />
              </button>
            </div>
            <br />
            <div className="flex justify-center content-center items-center gap-2 border rounded-lg p-2 border-[#D9D9D9]">
              <button
                className="flex flex-row w-full items-center"
                onClick={handleCopyArClick}
              >
                <Image
                  src={arweave}
                  style={{ width: "16px", height: "16px" }}
                  alt="eth"
                />
                <div
                  id="ar_address"
                  className="grow text-center text-lightgrey"
                >
                  7BOgKhQMI3rxhTZRBqazmCY6AiSFN3etX_5w91Ks7sQ
                </div>
                <Image
                  className=" "
                  style={{ width: "18px", height: "21px" }}
                  src={svg}
                  alt="copy arweave address"
                />
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxWidth: "348px", maxHeight: "348px" }}
              src={puzzle}
              alt="puzzle"
            />
          </div>
        </div>
      </div>
      <Footer />;
    </div>
  );
}

const faq = [
  { question: "How does Archive the Web work?", answer: "Like this" },
  { question: "What can I store? ", answer: "Like this" },
  { question: "How do you save data permanently?", answer: "Like this" },
  {
    question: "Why do I have to pay and how is the cost calculated?",
    answer: "Like this",
  },
  {
    question: "What is Archive the Web’s content moderation policy? ",
    answer: "Like this",
  },
];
