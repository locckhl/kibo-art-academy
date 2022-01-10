import React, { useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useQuery } from "react-query"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { getClasses } from "../../lib/class"
import "./index.scss"
import EditClass from "./Section/EditClass"

function Home() {

  console.log("Home")
  const { currentUser } = useAuth()
  const naviagate = useNavigate()
  const [titleColumns] = useState(
    currentUser.role === 2
      ? [
          "クラス名",
          "人数",
          "クラス内容",
          "授業数",
          "主任教員",
          "出席率",
          "最終成績",
          "アクション",
        ]
      : ["クラス名", "人数", "クラス内容", "授業数", "主任教員", "アクション"]
  )
  const { data: classes, isLoading } = useQuery(
    ["getClasses", { currentUser: currentUser }],
    getClasses,
    {
      enabled: !!currentUser,
    }
  )
  const [editClass, setEditClass] = React.useState(null)
  const [showModal, setShowModal] = React.useState(false)

  const onEditClass = (event, item) => {
    event.stopPropagation()
    setEditClass(item)
    setShowModal(true)
  }

  if (isLoading) return <Skeleton count={20} />
  return (
    classes && (
      <>
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
                            ? "cursor-pointer bg-green-100"
                            : "cursor-pointer "
                        }`}
                        onClick={(e) => {
                          naviagate(`/classDetail/${item.id}`)
                        }}
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

                        {/* Admin && Teacher */}
                        {currentUser.role === 0 && (
                          <>
                            <td className="text-sm text-center font-medium text-gray-600 text-blue-600">
                              <button
                                onClick={(event) => onEditClass(event, item)}
                              >
                                編集
                              </button>
                            </td>
                          </>
                        )}
                        {currentUser.role === 1 && (
                          <td className="px-6 py-4 flex whitespace-nowrap">
                            <div className="flex-auto">
                              {" "}
                              <Link
                                to={`/attendance/${item.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                出欠
                              </Link>
                            </div>
                            <div className="flex-auto">
                              <Link
                                to={`/evaluation/${item.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                評価
                              </Link>
                            </div>
                            <div className="flex-auto">
                              <Link
                                to={`/document/${item.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                資料
                              </Link>
                            </div>
                          </td>
                        )}

                        {/* Talent  */}
                        {currentUser.role === 2 && (
                          <>
                            <td className="text-sm text-center font-medium text-gray-600">
                              {item.totalAttendance}
                            </td>
                            <td className="text-sm text-center font-medium text-gray-600">
                              {item.totalAchivement}/100
                            </td>
                            <td className="px-6 py-4 flex whitespace-nowrap">
                              <div className="flex-auto text-center">
                                <Link
                                  to={`/document/${item.id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  資料
                                </Link>
                              </div>{" "}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        <EditClass
          data={editClass}
          open={showModal}
          setOpen={setShowModal}
          // onUpdate={onSubmit}
        />
      </>
    )
  )
}
export default Home
