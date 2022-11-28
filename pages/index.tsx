import { Footer } from "../components/footer";
import { Header } from "../components/header";
import React, { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen px-8">
      <Header />
      <div className="container p-16 grow ">index</div>
      <Footer />
    </div>
  );
}
