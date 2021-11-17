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
  // More people...
];
export default function Document() {
  return (
    <div className="container mt-20 px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-function flex-1 flex justify-center text-3xl">
          資料
        </div>
      </div>
      <div className="class-center flex">
        <div className="class-left flex flex-col flex-auto">
          <div className="class-table relative">
              <div className="absolute bottom-full mb-1">既存のドキュメント</div>
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
                          資料名
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          アップロード時間
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                        ></th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center">
                            <span className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-xl bg-red-600 text-white text-xl cursor-pointer ">
                              削除
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="class-action my-10 flex flex-col justify-around">
            <div>
              <div className="text-center">資料をアップロード</div>
              <div className="flex justify-center">
                <div>
                  <label for="document_file" className="btn">
                    <i className="fas fa-cloud-upload-alt mr-2"></i> Upload file
                  </label>
                  <input type="file" id="document_file" />
                </div>
              </div>
            </div>
            <div className="my-10">
              <div className="flex justify-center">
                <div>
                  <button className=" btn ">サプミット</button>
                </div>
              </div>
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
