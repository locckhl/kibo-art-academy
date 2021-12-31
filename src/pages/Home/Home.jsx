import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Skeleton from "react-loading-skeleton";

function Home() {
  const { currentUser } = useAuth();
  const [titleColumns] = useState([
    "クラス名",
    "人数",
    "クラス内容",
    "授業数",
    "主任教員",
    "アクション",
  ]);
  const { classes } = useAuth();
  console.log("home");
  if (!currentUser || !classes) return <Skeleton count={20} />;
  return (
    <section className="flex flex-col home px-24">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          {currentUser.role === 1 && (
            <div className="text-green-700">
              *緑は自分が管理しているクラスです
            </div>
          )}
          <br />
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {titleColumns.map((title, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-center text-lg font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      item.teacherID === currentUser.userID
                        ? "bg-green-100"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-center font-medium text-gray-600">
                        {item.className}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-center font-medium text-gray-600">
                        {item.numTalents}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-center font-medium text-gray-600">
                        {item.summary}
                      </div>
                    </td>
                    <td className="text-sm text-center font-medium text-gray-600">
                      {item.numLessons}
                    </td>
                    <td className="text-sm text-center font-medium text-gray-600">
                      {item.teacherName}
                    </td>

                    {/* Admin */}
                    {currentUser.role === 0 && (
                      <td className="px-6 py-4 flex whitespace-nowrap">
                        <div className="flex-auto">
                          {" "}
                          <Link
                            to={`/attendance/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            出欠
                          </Link>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={`/evaluation/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            評価
                          </Link>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={`/document/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            資料
                          </Link>
                        </div>
                      </td>
                    )}

                    {/* Teacher */}
                    {item.teacherID === currentUser.userID && (
                      <td className="px-6 py-4 flex whitespace-nowrap">
                        <div className="flex-auto">
                          {" "}
                          <Link
                            to={`/attendance/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            出欠
                          </Link>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={`/evaluation/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            評価
                          </Link>
                        </div>
                        <div className="flex-auto">
                          <Link
                            to={`/document/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            資料
                          </Link>
                        </div>
                      </td>
                    )}

                    {/* Talent  */}
                    {currentUser.role === 2 && (
                      <td className="px-6 py-4 flex whitespace-nowrap">
                        <div className="flex-auto text-center">
                          <Link
                            to={`/document/${item.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            資料
                          </Link>
                        </div>{" "}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Home;
