import React from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { useState, useEffect } from 'react';
import { updateAchievementsItem, getFirebaseItems } from "./../../lib/evaluation";

export default function Evaluation() {
  const [state, setState] = useState({
    isEdit: false,
    dataClasses: [],
    talent: [{
      talentID: "",
      score: 0,
      maxScore: 0
    }],
  })
  const handleEdit = () => {
    setState({
      ...state,
      isEdit: true
    })
  };

  const dataClass = [];
  useEffect(() => {
    async function fetchData() {
      const data = await getFirebaseItems('/Classes/97sxQMGJ5pQj80JnmodI/ClassLessons/yXhng4x1MPLSJj1D6z2w/Achievements');
      data.forEach((doc) => {
        dataClass.push(doc.data());
      });
      setState({
        ...state,
        dataClasses: dataClass,
      });
    }
    fetchData();

  }, []);

  const handleEditScore = (key, talentID, value) => {
    const data = state.dataClasses;
    let index = data.findIndex(item => item.talentID === talentID);
    data[index].score = parseInt(value.split('/')[0]);
    data[index].maxScore = parseInt(value.split('/')[1]);
    setState({
      ...state,
      dataClasses: data
    })
  }

  const save = ()  => {
    setState({
      ...state,
      isEdit: false
    })
    try {
      state.dataClasses.forEach(async (item) => {
        await updateAchievementsItem(item.talentID, item.score, item.maxScore);
      });
    } catch (err) {
      console.log(err);
    }
  
  }
  const { dataClasses } = state;

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
                      {dataClasses.length !== 0 && dataClasses.map((value, key) => (
                        <tr key={key}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {key + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {value.talentID}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <input
                                type="text"
                                disabled={!state.isEdit}
                                defaultValue={`${value.score}/${value.maxScore}`}
                                onChange={e => handleEditScore(key, value.talentID, e.target.value)}
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

              <button className=" btn " onClick={save}>更新保存</button>
            </div>
            <div>
              <button className=" btn " onClick={handleEdit}>修正</button>

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
