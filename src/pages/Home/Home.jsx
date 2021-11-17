import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    title: "日本語5",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",
  },
  {
    title: "日本語5",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",
  },
  {
    title: "日本語6",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",　
  },
  {
    title: "日本語7",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",
  },
  {
    title: "日本語8",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",
  },
  // More people...
];

export default function Example() {
  return (
    <div className="container flex flex-col home px-20">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    クラス名
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    人数
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    クラス内容
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    授業数
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    主任教員
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.title}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {person.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {person.ninzuu}
                      </div>
                      <div className="text-sm text-gray-500">{person.info}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.info}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.numberOfLessons}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.tantousha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {" "}
                        <Link
                          to="/attendance/1"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          出欠
                        </Link>
                      </div>
                      <div>
                        <Link
                          to="/evaluation/1"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          評価
                        </Link>
                      </div>
                      <div>
                        <Link
                          to="/document/1"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          資料
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
