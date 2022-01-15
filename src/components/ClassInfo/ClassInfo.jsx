import React from "react";
import { useState, useEffect } from "react";
import AddClass from "../../pages/AddClass/AddClass";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ClassInfo({ classInfo, classes, changeClassId }) {
  const [classId, setClassId] = useState(classInfo.id);
  const [editClass, setEditClass] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [currentLessonsNumer, setcurrentLessonsNumer] = useState("");
  const [IsTalent, setIsTalent] = useState(false);
  const { currentUser: userInfo } = useAuth();

  /**
   *
   * @param {string} date
   */
  const formatTime = (stringSeconds) => {
    var Day;
    var Month;
    const date = new Date(parseInt(stringSeconds) * 1000);
    if (date.getMonth() < 9) Month = `0${date.getMonth() + 1}`;
    else Month = `${date.getMonth() + 1}`;
    if (date.getDate() < 10) Day = `0${date.getDate()}`;
    else Day = `${date.getDate()}`;

    return `${date.getFullYear()}-${Month}-${Day}`;
  };

  //check role
  useEffect(() => {
    setIsTalent(false);
    if (parseInt(userInfo.role) === 2) {
      setIsTalent(true);
    }
  }, [userInfo]);

  //get lessons number
  useEffect(() => {
    let refer = collection(db, "Classes", classInfo.id, "ClassLessons");
    const unsub = onSnapshot(refer, (snapshot) => {
      setcurrentLessonsNumer(snapshot.size);
    });
    return () => unsub();
  }, [classInfo]);

  return (
    <div className="-my-2  sm:-mx-6 lg:-mx-8 ">
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
                <td className="px-6 py-4 ">
                  <div className="text-sm font-medium text-gray-900 pl-10 ">
                    クラス名: {classInfo?.className}
                    <br />
                    人数: {classInfo?.numTalents}
                    <br />
                    クラス内容: {classInfo?.summary}
                    <br />
                    授業数: {IsTalent && currentLessonsNumer}
                    {!IsTalent &&
                      `${currentLessonsNumer}/${classInfo?.numLessons} (現在の授業数/最大授業数)`}
                    <br />
                    開始日: {formatTime(classInfo?.dateBegin.seconds)}
                    <br />
                    終了日: {formatTime(classInfo?.dateEnd.seconds)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap　">
                  <div className="text-sm font-medium text-gray-900 flex flex-col">
                    <div className="class-list mx-auto my-2">
                      <label for="dates">クラスリスト：</label>
                      <select
                        defaultValue={classInfo.id}
                        onChange={(event) => {
                          setClassId(event.target.value);
                        }}
                        name="dates"
                        id=""
                      >
                        {classes.map((item, idx) => (
                          <option key={idx} value={item.id}>
                            {item.className}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="class-action mx-auto ">
                      <button
                        className="btn"
                        onClick={() => {
                          changeClassId(classId);
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
      {/* <AddClass data={editClass} open={showModal} setOpen={setShowModal} /> */}
    </div>
  );
}
