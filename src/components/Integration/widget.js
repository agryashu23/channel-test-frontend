import React from "react";

const DNSTable = ({ token }) => {
  return (
    <div className="bg-transparent border border-theme-chatBackground rounded-lg  w-full lg:w-max overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-theme-b-chatBackground bg-theme-chatDivider">
            <th className="px-8 py-3 text-sm font-medium text-theme-secondaryText border-r border-theme-chatBackground w-1/3">
              Host
            </th>
            <th className="px-8 py-3 text-sm font-medium text-theme-secondaryText border-r border-theme-chatBackground w-1/3">
              Type
            </th>
            <th className="px-10 py-3 text-sm font-medium text-theme-secondaryText w-1/3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-t-theme-chatBackground">
            <td className="p-4 text-theme-primaryText border-r border-theme-chatBackground whitespace-nowrap">
              @ (leave blank)
            </td>
            <td className="p-4 text-theme-primaryText border-r border-theme-chatBackground">
              TXT
            </td>
            <td className="p-4 text-theme-primaryText lg:whitespace-nowrap">
              channels-verification={token}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DNSTable;
