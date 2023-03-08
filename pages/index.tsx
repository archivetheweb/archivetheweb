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
import diagram from "../public/diagram.png";
import openArchive from "../public/open_archive.png";
import mainHeader from "../public/main_header.png";
import library from "../public/library.png";
import top from "../public/top.svg";
import info from "../public/info.png";

import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Image from "next/image";
import { useState } from "react";
import { isValidUrl, Toast } from "../components/utils";
import { useRouter } from "next/router";
import { fetchPricePerMB } from "../http/fetcher";

export default function Home() {
  const router = useRouter();
  let [urlInfo, setURL] = useState({ url: "", valid: false });
  let [toastMessage, setToastMessage] = useState(<></>);
  const priceInfo = fetchPricePerMB();

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

  let costPer22Mb = priceInfo.isLoading
    ? ""
    : `USD $${Math.round(+priceInfo.pricePerMB.usd * 2.2 * 1000) / 1000}`;

  return (
    <div className="flex flex-col h-screen w-fit">
      <Header className="px-16 pb-16" />
      <Toast message={toastMessage} severity="success" />
      <button
        onClick={() => router.push("/")}
        className="btn btn-circle bg-[#FFFFFF] active:bg-funpurple hover:bg-funpurple  right-2 bottom-2 fixed"
      >
        <Image src={top} alt="top" />
      </button>
      <div className=" w-full">
        <div className="hero">
          <div
            className="hero-content w-full flex-col lg:flex-row md:flex-col px-24"
            style={{ maxWidth: "100%" }}
          >
            <div>
              <div className="text-funpurple text-2xl font-bold mb-2">
                Archive what matters to you
              </div>
              <h1 className="text-6xl font-bold">
                An open & permanent public web archive <u>for everyone</u>
              </h1>
              <div className="py-6 text-xl text-lightgrey">
                Let&apos;s safeguard the web and our digital history. Explore
                the open and decentralized archive and begin archiving your
                favorite content - from government speeches and news articles to
                social media posts and cat memes!
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={urlInfo.url}
                  onChange={handleURL}
                  onKeyDown={(e) =>
                    e.key === "Enter" && urlInfo.valid && handleClick()
                  }
                  placeholder="Enter a website to save (ex. https://bbc.com)"
                  className="input input-bordered w-full h-16 shadow-lg"
                />

                <button
                  disabled={!urlInfo.valid}
                  onClick={handleClick}
                  style={{ borderRadius: "5px" }}
                  className="btn bg-funpurple text-[#FFFFFF] hover:bg-funpurple/75 border-none h-16 normal-case "
                >
                  See archive
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center p-16">
              <Image
                src={mainHeader}
                style={{ maxHeight: "413px", maxWidth: "353px" }}
                alt="man fetching book in library"
                priority
              />
            </div>
          </div>
        </div>
        <div className="flex  w-full h-32 bg-gradient-to-r from-funbrightpurple via-funmidpurple to-funpurple">
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
          <div className="flex text-center w-full justify-center items-center px-16  md:text-3xl lg:text-3xl sm:text-xl font-bold">
            <span className="flex-none">The average website is </span>
            <span className="px-2 text-[#9FC5FF] inline">altered</span> or{" "}
            <span className="px-2 text-[#FF7170]"> deleted</span> after{" "}
            <span className="flex-none px-2 text-[#FFFFFF]">92 days.</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-8 pt-16 ">
          {infoPills.map((x, i) => {
            return (
              <div
                key={i}
                className="flex flex-col items-center sm:flex-row  border rounded-md p-8 gap-4 border-[#D9D9D9]"
              >
                <Image
                  src={x.image}
                  style={{ height: "100px", width: "100px" }}
                  alt="monkey"
                />
                <div>
                  <div className="font-bold pb-1">{x.title}</div>
                  <div className="text-lightgrey">
                    {x.text}
                    <div className="collapse collapse-arrow">
                      <input type="checkbox" />
                      <div className="collapse-title pl-0 text-funpurple">
                        {x.exampleTitle}
                      </div>
                      <div className="collapse-content  pl-0">
                        <div className="divider m-0  before:bg-[#D9D9D9]  after:bg-[#D9D9D9]"></div>
                        {x.exampleText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Image className="w-full pt-16" src={library} alt="library" />

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16 bg-[#FAFAFA]">
          <div>
            <div className="text-3xl font-bold pb-8 ">
              Introducing an open archive
            </div>
            <div className="text-lightgrey">
              Archive the Web is an open-source tool that allows you to set up
              automated website archiving stored on Arweave. Our mission is to
              create a decentralized backup of the world wide web and to make it
              accessible to everyone.
              <br /> <br />
              You can easily select the content you want to include in the
              archive, and our platform will take care of the rest. We believe
              in open access to information, so our platform is open by default,
              allowing anyone to access and use the archive.
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16">
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

            <div className="text-3xl font-bold pb-8 pt-16">How it works</div>

            <div className="text-lightgrey pb-2 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">1</span>{" "}
              Find a website to preserve.
            </div>
            <div className="text-lightgrey pb-2 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">2</span>{" "}
              Select a duration and frequency for snapshots.
            </div>
            <div className="text-lightgrey pb-2 flex items-center gap-2">
              <span className="px-1 text-3xl text-funpurple text-bold">3</span>{" "}
              Pay the storage fee.
            </div>
            <div className=" w-full p-4 mb-4 items-center gap-1 bg-funlightpurple rounded-lg hidden sm:flex">
              <Image
                src={info}
                alt="info"
                style={{ width: "24px", height: "24px" }}
              />
              <div className="text-[#79747E]">
                The cost to archive the average website (2.2MB in size) for 200+
                years on Arweave is currently{" "}
                <span className="text-funpurple">
                  <b>
                    about{" "}
                    {priceInfo.isLoading
                      ? ""
                      : `USD $${
                          Math.round(+priceInfo.pricePerMB.usd * 2.2 * 1000) /
                          1000
                        }`}
                  </b>
                </span>
                .
              </div>
            </div>
            <div className="text-lightgrey pb-2">
              That&apos;s all! The snapshots will be automatically saved on the
              permaweb and added to the open and decentralized archive, where
              they will be accessible to anyone who wants to explore the history
              of the web.
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16 bg-[#FAFAFA]">
          <div>
            <div className="text-3xl font-bold pb-8 ">
              Archive what matters to you
            </div>
            <div className="text-lightgrey">
              Archive the Web is open to everyone, regardless of political,
              religious, or ideological beliefs. We aim to work together and
              archive a diverse range of information, from news and important
              artworks to public-facing governmental information. With this
              approach, we can create a resilient and substantial archive of our
              digital footprint that will be preserved for future generations.
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
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16">
          <div className="flex justify-center">
            <Image
              className=""
              style={{ maxHeight: "287px", maxWidth: "253px" }}
              src={diagram}
              alt="diagram"
            />
          </div>
          <div>
            <div className="text-3xl font-bold pb-8">Built to last</div>
            <div className="text-lightgrey">
              We are committed to preserving the web and its rich history for
              future generations. That&apos;s why we use Arweave, a permanent
              data storage protocol that ensures all website snapshots are
              stored in an immutable and community-owned web, known as the
              permaweb. Data added to Arweave is replicated among hundreds or
              thousands of computers or &quot;miners&quot; making it resilient
              and easily retrievable.
              <br />
              <br />
              To permanently save data, the Arweave network charges an upfront
              fee, which is calculated based on conservative estimates around
              price reductions for storage over time. This fee incentivizes the
              miners to continue storing the data for at least 200 years,
              ensuring that website snapshots are preserved for future
              historical purposes.
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16 bg-[#FAFAFA]">
          <div>
            <a id="faq" />

            <div className="text-3xl font-bold pb-2">
              Frequently Asked Questions
            </div>
            <div className="text-lightgrey mt-2">
              {faq(costPer22Mb).map((x, i) => (
                <div key={i}>
                  <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title font-bold text-[#000000]">
                      {x.question}
                    </div>
                    <div className="collapse-content">{x.answer}</div>
                  </div>
                  <div className="divider m-0  before:bg-[#D9D9D9]  after:bg-[#D9D9D9]"></div>
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

        <div className="grid lg:grid-cols-2 sm:grid-cols-1 px-24 gap-4 justify-center content-center w-full py-16">
          <div>
            <div className="text-3xl font-bold pb-8">
              Help build Archive the Web
            </div>
            <div className="text-lightgrey">
              Archive the Web is an open-source project. Anyone is welcome to
              contribute to the project. Start getting involved by visiting our
              GitHub repository!
              <br />
              <br />
              <button
                onClick={() => window.open("https://github.com/archivetheweb")}
                style={{ borderRadius: "5px" }}
                className="btn btn-outline normal-case  text-funpurple hover:border-none hover:bg-funpurple/75 border-funpurple h-16 "
              >
                <span className="">Visit our Github</span>
              </button>
            </div>
            <div className="text-3xl font-bold pb-8 pt-10">
              Donate to Archive the Web
            </div>
            <div className="text-lightgrey">
              Another way you can contribute to Archive the Web is by donating
              to support the platform&apos;s open-source development. Any
              donation is greatly appreciated. Our ETH and AR addresses are
              below.
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
                  className="grow text-sm xl:text-base text-center text-lightgrey"
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
                  className="grow text-sm xl:text-base  text-center text-lightgrey"
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
      <Footer />
    </div>
  );
}

const faq = (costPer22Mb: string) => [
  {
    question: "How does Archive the Web work?",
    answer: (
      <div>
        <div className="pb-1">
          <b>1.</b> Find a website you want to archive permanently.
        </div>
        <div className="pb-1">
          <b>2.</b> Enter the URL and snapshot settings on Archive the Web. You
          can set up long-term archiving, which automatically takes snapshots at
          pre-set intervals (e.g., every 24 hours).
        </div>
        <div className="pb-1">
          <b>3.</b> Pay the storage fee calculated by the Arweave network. You
          will be able to pay this fee using a variety of methods, including
          Metamask, Wallet Connect, or Arweave directly. The fee can be paid
          using various cryptocurrencies, such as AR, ETH, and ERC-20s, on
          multiple blockchain networks (e.g., Polygon, Arbitrum, etc.) - coming
          soon.
        </div>
        <br />
        Once you have completed these steps, the website snapshots will be
        automatically taken and saved on the permaweb. The website will be
        archived permanently; anyone can access and view it anytime.
      </div>
    ),
  },
  {
    question: "What can I store?",
    answer: (
      <div>
        Currently, Archive the Web allows users to store interactive website
        snapshots. Snapshots capture websites at the time of archiving and are
        saved in a way that allows them to be viewed and interacted with, just
        like the live website. In the future, Archive the Web plans to expand
        its capabilities, so you can archive other types of content besides
        websites. <br />
        <br />
        It&apos;s important to note that the website snapshots saved through
        Archive the Web are interactive, just like the actual website at the
        time of the snapshot. This means they can be viewed and interacted with,
        rather than static images like screenshots. This allows users to access
        archived websites in a way that is similar to how they would experience
        the live website.
      </div>
    ),
  },
  {
    question: "How do you save data permanently?",
    answer: (
      <div>
        Archive the Web uses Arweave, a permanent data storage protocol to save
        website data permanently. This new technology allows website data to be
        stored so that it cannot be deleted or changed once saved. This adds a
        high level of security to the websites archived through Archive the Web.
        <br />
        <br />
        If you would like to learn more about Arweave and how it works, ArDrive,
        a decentralized version of Dropbox, has written a helpful primer that
        you can read{" "}
        <a
          className="underline"
          href="https://ardrive.io/what-is-arweave/"
          target={"_blank"}
          rel="noreferrer"
        >
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
        The average size of a website is 2.2MB. It would cost approximately{" "}
        {costPer22Mb} to permanently archive a site of that size. <br />
        <br />
        To save websites on Archive the Web, users must pay a small fee. This
        fee is paid to the network to incentivize data storers to keep the data
        for approximately 200+ years. The cost of the fee is determined by the
        current price of the Arweave network, which may fluctuate over time.
        Archive the Web does not charge any additional fees beyond the cost of
        the network fee. <br />
        <br />
        The network fee is necessary for permanently storing data on the Arweave
        network, and the cost is determined by the current market price for
        storing data on the network.
      </div>
    ),
  },
  {
    question: "What is Archive the Web’s content moderation policy? ",
    answer: (
      <div>
        Archive the Web is an open-source project that allows anyone to upload
        content to the Arweave network. Once the content is uploaded, it becomes
        subject to Arweave&apos;s content moderation policies. These policies
        aim to prevent network abuse and ensure that the content stored on the
        network adheres to the community&apos;s standards.
        <br />
        <br />
        Arweave uses a democratic moderation tool at the core of its protocol to
        moderate submitted content. When someone submits a transaction to the
        network, data storers can choose whether or not to replicate the
        associated data. The network maintainers can filter and screen the
        transaction using various methods, such as checking against known
        illicit material or using computer vision software to scan the data.
        <br />
        <br />
        If someone finds content they believe violates Arweave&apos;s moderation
        policies they can contact gateways that serve the data and request its
        removal from the network. For more information about Arweave&apos;s
        content moderation policies, visit their{" "}
        <a
          className="underline"
          href="https://arweave.org"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          website
        </a>{" "}
        or read their{" "}
        <a
          className="underline"
          href="https://yellow-paper.arweave.dev/"
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
  {
    question: "How does this differ from other services like Wayback Machine?",
    answer: (
      <div>
        Archive the Web and Wayback Machine are similar in allowing users to
        access archived versions of websites. However, there are some notable
        differences between the two services.
        <br />
        <br />
        One key difference is the technology and data storage methods used by
        each service. Wayback Machine uses periodic crawling to save copies of
        web pages, which are then saved on their databases and made available
        through its user interface. In this case, the storage network is
        centralized and vulnerable to censorship and other threats. In contrast,
        Archive the Web uses a decentralized, permanent storage network called
        Arweave. Arweave distributes data across a network of individual nodes,
        which allows for greater reliability and resistance to tampering or
        censorship.
        <br />
        <br />
        Another key difference is the process by which content is saved. Archive
        the Web allows users to directly contribute to the archive by submitting
        their own web pages for preservation. In contrast, Wayback Machine
        primarily relies on periodic crawls to add content to its archive.
        <br />
        <br />
        Finally, the funding mechanism for archiving content differs between the
        two services. Archive the Web is funded through user contributions as a
        one-time fee to secure storage on the Arweave network for 200+ years. In
        contrast, Wayback Machine is primarily funded through donations to its
        parent organization, the Internet Archive. This means that Archive the
        Web&apos;s funding model is driven by user payments, which may provide a
        more sustainable and long-term approach to preserving web content. In
        comparison, Wayback Machine&apos;s funding relies on sustained donations
        from individuals and organizations, which may be less reliable over the
        long term.
      </div>
    ),
  },
];

const infoPills = [
  {
    image: monkey,
    title: "Content is censored",
    text: (
      <div>
        Censorship occurs when governments or private groups suppress words,
        images, and ideas that are &quot;offensive&quot; and impose this on
        others.
      </div>
    ),
    exampleTitle: "See example: FIFA world cup coverage in China",
    exampleText: (
      <div>
        <a
          className="underline"
          href="https://theguardian.com/world/2022/nov/28/china-censors-maskless-crowd-footage-in-world-cup-broadcasts"
          target={"_blank"}
          rel="noreferrer"
        >
          In China, during the FIFA World Cup 2022 in Qatar
        </a>
        , footage of maskless crowds in the stadiums was not aired on TV because
        it contradicted China&apos;s zero-covid lockdown protocols.
      </div>
    ),
  },
  {
    image: opinions,
    title: "Opinions change",
    text: (
      <div>
        Sometimes, online information is deleted or altered due to a change in
        leadership.
      </div>
    ),
    exampleTitle: "See example: British Conservative Party",
    exampleText: (
      <div>
        This can occur when there is a change in government. In 2013, the{" "}
        <a
          className="underline"
          href="https://vice.com/en/article/78xzmb/the-conservative-party-tried-to-delete-their-old-speeches-from-the-web"
          target={"_blank"}
          rel="noreferrer"
        >
          British Conservative Party abruptly deleted ten years&apos; worth of
          speeches and press releases
        </a>{" "}
        from their website. They also attempted to prevent search engines from
        being able to access the deleted files by updating the robots.txt files.
      </div>
    ),
  },
  {
    image: door,
    title: "Organizations close",
    text: (
      <div>
        Companies can shut down and lose the data you entrusted them with
        keeping. 
      </div>
    ),
    exampleTitle: "See example: Yahoo! closure of GeoCities",
    exampleText: (
      <div>
        In 2009, Yahoo! closed GeoCities, a free web hosting platform popular
        for personal websites, fan sites, and other online communities. When it
        was shut down, millions of files and user accounts were deleted. Despite
        efforts by the Internet Archive to preserve as much of the GeoCities
        content as possible, a significant amount of data was lost forever.
      </div>
    ),
  },
  {
    image: apple,
    title: "Links rot",
    text: (
      <div>
        Link rot occurs when the hyperlinked text no longer leads to the
        original site or file.
      </div>
    ),
    exampleTitle: "See example: U.S. Supreme Court references",
    exampleText: (
      <div>
        A 2022 study found that over 66.5% of links to sites in the last{" "}
        <a
          className="underline"
          href="https://ahrefs.com/blog/link-rot-study/"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          nine years have been lost
        </a>
        . An earlier study from 2014 found that 70% of links in legal journals
        and 50% of URLs cited in the{" "}
        <a
          className="underline"
          href="https://harvardlawreview.org/2014/03/perma-scoping-and-addressing-the-problem-of-link-and-reference-rot-in-legal-citations"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          U.S. Supreme Court decisions no longer worked
        </a>
        .
      </div>
    ),
  },
  {
    image: unpaid,
    title: "Hosting is unpaid",
    text: (
      <div>
        Hosting services can be left unpaid and content abandoned. This can
        sometimes happen due to company shutdowns and bankruptcies.
      </div>
    ),
    exampleTitle: "See example: Coachella lifetime passes & FTX",
    exampleText: (
      <div>
        The{" "}
        <a
          href="https://decrypt.co/114856/coachella-tomorrowland-solana-nfts-stuck-ftx"
          target={"_blank"}
          rel="noreferrer"
          className="underline"
        >
          artwork for Coachella NFTs, including the lifetime passes which sold
          for six figures, is unavailable
        </a>{" "}
        because of server issues in the wake of the FTX collapse and bankruptcy.
        Many other projects launched on this platform are having similar
        problems.
      </div>
    ),
  },
  {
    image: fire,
    title: "Servers go down",
    text: (
      <div>
        In a company&apos;s routine operations, servers can sometimes go down,
        causing data loss on small and large scales.
      </div>
    ),
    exampleTitle: "See example: Coachella lifetime passes & FTX",
    exampleText: (
      <div>
        One extreme example was the massive data loss suffered by Myspace in
        2019. Images, videos, and audio files uploaded before 2016 were likely
        lost due to this incident. This loss included 12 years of music uploads,
        totalling 50+ million{" "}
        <a
          className="underline"
          href="https://bbc.com/news/technology-47610936"
          target={"_blank"}
          rel="noreferrer"
        >
          {" "}
          songs from 14 million artists
        </a>
        . They claimed it occurred due to server migration.
      </div>
    ),
  },
];
