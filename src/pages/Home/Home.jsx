import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { getFirebaseItems } from "./../../lib/firebase";
import { useEffect, useState } from 'react';


/* This example requires Tailwind CSS v2.0+ */
// const people = [
//   {
//     title: "日本語5",
//     ninzuu: "36",
//     info: "JLPT (聴解・会話)",
//     numberOfLessons: "25",
//     tantousha: "Viet Thi Thu Huyen",
//   },
//   {
//     title: "日本語5",
//     ninzuu: "36",
//     info: "JLPT (聴解・会話)",
//     numberOfLessons: "25",
//     tantousha: "Viet Thi Thu Huyen",
//   },
//   {
//     title: "日本語6",
//     ninzuu: "36",
//     info: "JLPT (聴解・会話)",
//     numberOfLessons: "25",
//     tantousha: "Viet Thi Thu Huyen",
//   },
//   {
//     title: "日本語7",
//     ninzuu: "36",
//     info: "JLPT (聴解・会話)",
//     numberOfLessons: "25",
//     tantousha: "Viet Thi Thu Huyen",
//   },
//   {
//     title: "日本語8",
//     ninzuu: "36",
//     info: "JLPT (聴解・会話)",
//     numberOfLessons: "25",
//     tantousha: "Viet Thi Thu Huyen",
//   },
//   // More people...
// ];

export default function Example() {
  const [state, setState] = useState({
    dataClasses: [],
  });
  const dataClass = [];
  useEffect(() => {
    async function fetchData() {
      const data = await getFirebaseItems("Classes");
      data.forEach((doc) => {
        dataClass.push(doc.data());
      });
      setState({
        ...state,
        dataClasses: dataClass,
      });
    }
    fetchData();
    console.log("data", state.dataClasses);

  }, []);

  const { dataClasses } = state;
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
                {(dataClasses.length !== 0) && dataClasses.map((item) => (
                  <tr key={item.className}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.className}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.numTalents}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.summary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.numLessons}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.teacherID}
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
                        to={"/evaluation/" + item.className}
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
