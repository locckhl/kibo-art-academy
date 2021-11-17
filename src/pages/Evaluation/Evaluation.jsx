import React from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
const people = [
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
  {
    title: "日本語9",
    ninzuu: "36",
    info: "JLPT (聴解・会話)",
    numberOfLessons: "25",
    tantousha: "Viet Thi Thu Huyen",
  },
  // More people...
];
export default function Evaluation() {
  return (
    <div className="container mt-20 px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-date">
          <label for="dates">日付け：</label>
          <select name="dates" id="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="class-function flex-1 flex justify-center text-3xl">
          評価
        </div>
      </div>
      <div className="class-center flex">
        <div className="class-left flex flex-col flex-auto">
          <div className="class-table">
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
                          番号
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          名前
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          点数
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
                            <div className="text-sm text-gray-500">
                              {person.info}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <input
                                type="text"
                                value={`${person.numberOfLessons}/100`}
                              />
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
          <div className="class-action my-10 flex justify-around">
            <div>

            <button className=" btn ">更新保存</button>
            </div>
            <div>
            <button className=" btn ">修正</button>

            </div>
          </div>
        </div>
        <div className="mx-10 class-right flex-auto">
          {/* <div className="flex justify-end"> */}
          <ClassInfo
            changeClassId={() => {
              alert("Đổi class id bằng cái hàm này");
            }}
          />

          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
