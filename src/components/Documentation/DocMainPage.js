import React, { useState } from "react";
import Introduction from "./sections/Introduction";
import GettingStarted from "./sections/GettingStarted";
import Usage from "./sections/Usage";
import Integrations from "./sections/Integrations";
import Parameters from "./sections/Parameter";
import RequestAutoLogin from "./sections/RequestAutoLogin";
import DomainVerification from "./sections/DomainVerification";
import Menu from "../../assets/icons/menu.svg";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "getting-started", title: "Getting Started" },
  { id: "domain-verification", title: "Domain Verification" },
  { id: "usage", title: "Embedding & Usage" },
  { id: "integrations", title: "Framework Integrations" },
  { id: "parameters", title: "Parameters" },
  { id: "autoLogin", title: "Request Auto Login Access" },
];

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 relative">
      <img
        src={Menu}
        alt="close"
        className="md:hidden flex mt-3 ml-3 h-6 w-6 cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {/* <button
        className="md:hidden absolute top-4 left-4 z-50"
       
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      <aside
        className={`fixed md:relative top-0 left-0 h-full bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 py-6 overflow-y-auto`}
      >
        <h1 className="text-2xl font-bold mb-6 px-4">Channels Docs</h1>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className="text-left text-gray-700 hover:text-blue-600 w-full px-4"
              >
                {section.title}
              </button>
              <div className="border-t border-gray-200 mt-4"></div>
            </li>
          ))}
        </ul>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 sm:px-8 px-2 py-8 overflow-y-auto space-y-20">
        <section id="introduction">
          <Introduction />
        </section>
        <section id="getting-started">
          <GettingStarted />
        </section>
        <section id="domain-verification">
          <DomainVerification />
        </section>
        <section id="usage">
          <Usage />
        </section>
        <section id="integrations">
          <Integrations />
        </section>
        <section id="parameters">
          <Parameters />
        </section>
        <section id="autoLogin">
          <RequestAutoLogin />
        </section>
      </main>
    </div>
  );
}
