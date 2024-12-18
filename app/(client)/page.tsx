"use server";

import React from "react";

import HomePage from "./home/page";
import LoginPage from "./login/page";

export default async function Home() {
  return (
    <div className="layout">
      <LoginPage />
    </div>
  );
}
