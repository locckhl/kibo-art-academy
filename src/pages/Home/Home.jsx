import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect} from "react";

function Home() {
const [classes, setClasses] = useState([]);
const [titleColumns] = useState(['クラス名', '人数', 'クラス内容', '授業数', '主任教員', 'アクション'])
const classesCollection = collection (db, "Classes")
const usersCollection = collection (db, "Users")
useEffect(() => {
  const getClasses = async () => {
    const data = (await getDocs(classesCollection)).docs.map((doc) => ({ id: doc.id,...doc.data() }))
    setClasses(data)
    const users = (await getDocs(usersCollection)).docs.map((doc) => ({...doc.data()}))
    const mapClasses = data.map(item => ({...item, ...users.find(user => user.userID === item.teacherID)}))
    setClasses(mapClasses)
  }
  getClasses()
},[])
return (
  <div className="flex flex-col home px-24">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {titleColumns.map((title,index) => (
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
              {classes.map((item,idx) => (
                <tr key={idx}>
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
                    <div className="text-sm text-center font-medium text-gray-600">{item.summary}</div>
                  </td>
                  <td className="text-sm text-center font-medium text-gray-600">
                    {item.numLessons}
                  </td>
                  <td className="text-sm text-center font-medium text-gray-600">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 flex whitespace-nowrap">
                    <div className="flex-auto">
                      {" "}
                      <Link
                        to="/attendance/1"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        出欠
                      </Link>
                    </div>
                    <div className="flex-auto">
                      <Link
                        to="/evaluation/1"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        評価
                      </Link>
                    </div>
                    <div className="flex-auto">
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
export default Home
