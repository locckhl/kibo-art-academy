import React from "react";

export default function ClassInfo({ changeClassId }) {
  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                >
                  クラス情報
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr key="title">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 pl-10">
                    クラス名: 授業数 <br />
                    人数: 36
                    <br />
                    クラス内容: JLPT (聴解・会話)
                    <br />
                    授業数: 10
                    <br />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap　">
                  <div className="text-sm font-medium text-gray-900 flex flex-col">
                    <div className="class-list mx-auto my-2">
                      <label for="dates">クラスリスト：</label>
                      <select name="dates" id="">
                        <option value="1">日本語5</option>
                        <option value="2">日本語6</option>
                        <option value="3">日本語7</option>
                      </select>
                    </div>
                    <div className="class-action mx-auto ">
                      <button
                        className=" btn "
                        onClick={() => {
                          changeClassId();
                        }}
                      >
                        クラス変更
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
