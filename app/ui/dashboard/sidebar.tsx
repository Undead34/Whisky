import { FaHome, FaRegFileCode, FaPaperPlane } from "react-icons/fa";
import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <div className="flex h-screen overflow-hidden">
      <nav
        aria-label="Sidebar"
        className="hidden flex-shrink-0 overflow-y-auto bg-gray-800 lg:block"
      >
        <div className="relative flex w-20 flex-col space-y-14 p-3">
          <Link
            href={"/dashboard"}
            className="text-gray-400 hover:text-gray-200"
          >
            <div className="inline-flex w-14 flex-shrink-0 items-center justify-center">
              <FaHome />
            </div>
            <div className="text-center text-xs font-normal">Home</div>
          </Link>

          <Link
            href={"/dashboard/templates"}
            className="text-gray-400 hover:text-gray-200"
          >
            <div className="inline-flex w-14 flex-shrink-0 items-center justify-center">
              <FaRegFileCode />
            </div>
            <div className="text-center text-xs font-normal">Templates</div>
          </Link>

          <Link
            href={"/dashboard/launch"}
            className="text-gray-400 hover:text-gray-200"
          >
            <div className="inline-flex w-14 flex-shrink-0 items-center justify-center">
              <FaPaperPlane />
            </div>
            <div className="text-center text-xs font-normal">
              Launching platform
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
