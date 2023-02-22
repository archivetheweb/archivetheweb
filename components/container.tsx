import React from "react";
import { Footer } from "./footer";
import { AppHeader } from "./app_header";

export const Container = ({
  children,
}: {
  children: React.ReactElement | any;
}) => {
  return (
    <div className="flex flex-col h-screen w-fit ">
      <AppHeader />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
};
