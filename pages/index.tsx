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
import top from "../public/top.svg";

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
    <div className="flex flex-col h-screen w-fit">
      <Header className="px-16 pb-16" />
      <Toast message={toastMessage} />
      <button
        onClick={() => router.push("/")}
        className="btn btn-circle bg-[#FFFFFF] active:bg-funpurple hover:bg-funpurple  right-2 bottom-2 fixed"
      >
        <Image src={top} alt="top" />
      </button>
      <div className=" ">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row md:flex-col px-16">
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
                // className="max-h-full"
                // height={413}
                // width={353}
                style={{ maxHeight: "413px", maxWidth: "353px" }}
                alt="man fetching book in library"
              />
            </div>
          </div>
        </div>
        <div className=" w-full h-32 bg-gradient-to-r from-funbrightpurple via-funmidpurple to-funpurple">
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
        <div className="flex text-center w-full justify-center px-16 py-8 md:text-3xl lg:text-3xl sm:text-xl font-bold">
          <span className="flex-none">The average website is </span>
          <span className="px-2 text-[#9FC5FF] inline">altered</span> or{" "}
          <span className="px-2 text-[#FF7170]"> deleted</span> after{" "}
          <span className="flex-none px-2 text-funmidpurple">92 days.</span>
        </div>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-8 ">
          <div className="flex flex-col items-center sm:flex-row  border rounded-md p-8 gap-4">
            <Image
              src={monkey}
              style={{ height: "100px", width: "100px" }}
              alt="monkey"
            />
            <div>
              <div className="font-bold pb-1">Content is censored</div>
              <div className="text-lightgrey">
                Censorship occurs when governments or private groups suppress
                words, images and ideas that are “offensive” and impose this on
                others. For example, in China during the FIFA World Cup 2022,
                footage of maskless crowds in Qatar were{" "}
                <a
                  className="underline"
                  href="https://www.theguardian.com/world/2022/nov/28/china-censors-maskless-crowd-footage-in-world-cup-broadcasts"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  censored
                </a>{" "}
                from being aired as it contradicts the zero-covid lockdown
                protocols in place.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row border rounded-md p-8 gap-4">
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
                Their robots.txt files were also updated to stop search engines
                from being able to access the{" "}
                <a
                  className="underline"
                  href="https://www.vice.com/en/article/78xzmb/the-conservative-party-tried-to-delete-their-old-speeches-from-the-web"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  deleted files
                </a>
                .
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row border rounded-md p-8 gap-4">
            <Image
              src={door}
              alt="door"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Organizations close</div>
              <div className="text-lightgrey">
                Companies can shut down and lose the data you entrusted them to
                keep.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row border rounded-md p-8 gap-4">
            <Image
              src={apple}
              alt="apple"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Links rot</div>
              <div className="text-lightgrey">
                A 2022 study found that at least 66.5% of links to sites in the
                last{" "}
                <a
                  className="underline"
                  href="https://ahrefs.com/blog/link-rot-study/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  9 years are lost
                </a>
                . An earlier study from 2014 found that 70% of links in legal
                journals and 50% of URLs cited in{" "}
                <a
                  className="underline"
                  href="https://harvardlawreview.org/2014/03/perma-scoping-and-addressing-the-problem-of-link-and-reference-rot-in-legal-citations"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  U.S. Supreme Court decisions no longer worked.
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row border rounded-md p-8 gap-4">
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
          <div className="flex flex-col items-center sm:flex-row border rounded-md p-8 gap-4">
            <Image
              src={fire}
              alt="fire"
              style={{ height: "100px", width: "100px" }}
            />
            <div>
              <div className="font-bold pb-1">Servers go down</div>
              <div className="text-lightgrey">
                In 2019, MySpace mysteriously lost 12 years of music uploads,
                totalling 50+ million{" "}
                <a
                  className="underline"
                  href="https://www.bbc.com/news/technology-47610936"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  songs from 14 million artists
                </a>
                .
              </div>
            </div>
          </div>
        </div>
        <Image className="w-full py-16" src={library} alt="library" />

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-4 justify-center content-center w-full pb-16">
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-4 justify-center content-center w-full pb-16">
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-4 justify-center content-center w-full pb-16">
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-4 justify-center content-center w-full pb-16">
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-16 gap-4 justify-center content-center w-full pb-16">
          <div>
            <a id="faq" />

            <div className="text-3xl font-bold pb-2">
              Frequently Asked Questions
            </div>
            <div className="text-lightgrey">
              {faq.map((x) => (
                <div key={x.question}>
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
                </div>
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

        <div className="grid lg:grid-cols-2 sm:grid-cols-1   px-16 gap-4 justify-center content-center w-full pb-16">
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
  {
    question: "How does Archive the Web work?",
    answer: (
      <div>
        <ol>
          <li>Find a website you want to archive.</li>
          <li>
            Enter the website URL on archive the web. At first you will be able
            to archive a website one time. In the future, you will be able to
            set up long term archiving so that snapshots are taken at pre-set
            intervals (i.e. once per day at noon)
          </li>
          <li>
            Pay the storage fee. You can pay via Metamask, Wallet Connect, or
            Arweave directly. This includes payment with ETH and ERC-20s on
            multiple chains. Via Metamask, you can pay with a credit card to
            purchase ETH to be able to save the content.
          </li>
          <br />
          That’s all! The snapshots will be automatically taken and saved on the
          permaweb.
        </ol>
      </div>
    ),
  },
  {
    question: "What can I store? ",
    answer: (
      <div>
        Currently you can store interactive website snapshots. These capture the
        websites as they are in real time. In the future, you will be able to
        archive other mediums as well.
      </div>
    ),
  },
  {
    question: "How do you save data permanently?",
    answer: (
      <div>
        All website snapshots are saved on Arweave, a permanent data storage
        protocol. This new type of technology does not allow data to be deleted
        or changed once saved. This adds a great deal of security to the
        websites archived via Archive the Web. A great primer on What Arweave is
        can be found on Ardrive, a decentralized version of dropbox{" "}
        <a
          className="underline"
          href="https://ardrive.io/what-is-arweave/"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          here
        </a>
        .
      </div>
    ),
  },
  {
    question: "Why do I have to pay and how is the cost calculated?",
    answer: (
      <div>
        To permanently save data on Arweave, a small fee called an “endowment
        fee” must be sent to the network to pay data storers to keep it for 200+
        years. The fee charged is solely the Arweave network fee. Archive the
        Web does not charge a fee. The cost is calculated based on the real-time
        Arweave network pricing which takes into account a conservative estimate
        of the cost of data storage over the next 200 years.
      </div>
    ),
  },
  {
    question: "What is Archive the Web’s content moderation policy? ",
    answer: (
      <div>
        Archive the Web is a decentralized open source project that allows
        anyone to trustlessly upload content to the Arweave network. Once
        content has been uploaded to the Arweave network, that data becomes
        subject to Arweave’s content moderation policies. They take this
        potential for abuse seriously and have implemented a democratic
        moderation tool at the core of the protocol. When someone submits a
        transaction to the Arweave network, data storers are given the choice of
        whether to replicate the associated data. The maintainers of the network
        are able to filter and screen the transaction in whichever manner they
        choose, checking against known illicit material, scanning the data with
        computer vision software, et cetera. Complainants can contact gateways
        who serve said data to request its removal from the network. You can
        read more about their content moderation policy on their{" "}
        <a
          className="underline"
          href="https://www.arweave.org/technology#content-moderation"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          website
        </a>{" "}
        or in greater detail in their{" "}
        <a
          className="underline"
          href="https://www.arweave.org/yellow-paper.pdf"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          yellow paper
        </a>
        .
      </div>
    ),
  },
];
