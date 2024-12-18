"use server";

import React from "react";

import HomePage from "./home/page";


export default async function Home() {
  return (
    <div className="layout">

        <HomePage />

    </div>
  );
}
