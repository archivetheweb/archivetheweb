import Image from "next/image";
import Link from "next/link";
import gh from "../public/github.png";
import twitter from "../public/twitter_grey.png";

export const Footer: React.FC<any> = ({ props, className }) => {
  return (
    <footer className={"" + className}>
      <div className="grid grid-cols-2 gap-4 items-center full-w py-4  shrink-0 px-8">
        <div className="flex gap-4 items-center ">
          <div>
            <Link href={"https://twitter.com/archivethewebhq"} target="_blank">
              <Image src={twitter} height={24} width={24} alt="twitter" />
            </Link>
          </div>
          <div className="gap-4 justify-items-stretch">
            <Link
              href={"https://github.com/orgs/archivetheweb/repositories"}
              target="_blank"
            >
              <Image src={gh} height={24} width={24} alt="github" />
            </Link>
          </div>
        </div>

        <div className="justify-self-end items-center">
          {" "}
          <div className="text-lightgrey text-xs text-right">
            This website does not use any cookies or trackers. <br />
            Website last updated: May 29, 2023
          </div>
        </div>
      </div>
    </footer>
  );
};
