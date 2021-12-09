import React, { useEffect, useState } from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { db, storage } from "../../lib/firebase";
import { useParams } from "react-router";
import { SuccessMessage, ErrorMessage } from "../../utils/toastify";
import { useAuth } from "../../contexts/AuthContext";
//firebase imports
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "@firebase/firestore";
// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  deleteObject,
} from "@firebase/storage";

export default function Document() {
  const [fileItems, setfileItems] = useState(null);
  const { classId } = useParams();
  const [classUID, setClassesUID] = useState(classId);
  const [isTeacher, setIsTeacher] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, seterror] = useState(null);
  const [isPending, setisPending] = useState(false);
  const [isCancelled, setisCancelled] = useState(false);
  const [fileName, setFileName] = useState("");
  let url = "";

  const { currentUser: userInfo, classes } = useAuth();
  /**
   *
   * @param {string} date
   */
  const formatTime = (stringSeconds) => {
    const date = new Date(parseInt(stringSeconds) * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const changeClassId = (classId) => {
    setClassesUID(classId);
  };

  const checkNameOfTheFile = (newFileName) => {
    var checkNameArray = fileItems.map((fileItem) => {
      return fileItem.fileName;
    });
    if (checkNameArray.includes(newFileName)) {
      var suffixes = 1;
      while (
        checkNameArray.includes(
          `${newFileName.split(".")[0]}_${suffixes}.${
            newFileName.split(".")[1]
          }`
        )
      ) {
        suffixes += 1;
      }
      newFileName = `${newFileName.split(".")[0]}_${suffixes}.${
        newFileName.split(".")[1]
      }`;
    }
    return newFileName;
  };
  const uploadFileHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadFiles = async (file) => {
    seterror(null);
    setisPending(true);

    if (!file) return;
    //upload file to storage

    //Ex: cat.png/cat.pnd; cat_1.png/cat.png
    let storagePath = `/${checkNameOfTheFile(file.name)}/${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (!isCancelled) {
          setProgress(prog);
        }
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((download_URL) => {
          url = download_URL;
          //add data to firestore
          const refer = collection(db, "Classes", classUID, "Files");

          try {
            addDoc(refer, {
              classID: classUID,
              teacherID: userInfo.userID,
              fileName: checkNameOfTheFile(file.name),
              fileNameInDB: file.name,
              downloadURL: url,
              createdAt: serverTimestamp(),
            }).then(() => {
              if (!isCancelled) {
                seterror(null);
                setisPending(false);
              }
              SuccessMessage("アップロード成功");
            });
          } catch (err) {
            console.log(err.message);
            if (!isCancelled) {
              seterror(err.message);
              setisPending(false);
            }
          }
        });
      }
    );
  };
  // get file list
  useEffect(() => {
    let refer = collection(db, "Classes", classUID, "Files");
    refer = query(refer, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      refer,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setfileItems(results);
        seterror(null);
      },
      (err) => {
        console.log(err);
        seterror("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsub();
  }, [classUID]);

  //delete file
  const deleteFile = (id, fileName, fileNameInDB) => {
    let storagePath = `/${fileName}/${fileNameInDB}`;
    const desertRef = ref(storage, storagePath);
    deleteObject(desertRef)
      .then(() => {
        const refer = doc(db, "Classes", classUID, "Files", id);
        deleteDoc(refer)
          .then(() => {
            SuccessMessage("削除しました");
          })
          .catch((err) => {
            ErrorMessage("Firestote: エラーがある");
          });
      })
      .catch((err) => {
        ErrorMessage("Storage: エラーがある");
      });
  };
  //check role
  useEffect(() => {
    setIsTeacher(false);
    if (parseInt(userInfo.role) === 1) {
      setIsTeacher(true);
    }
  }, [userInfo]);

  //clean up function
  useEffect(() => {
    return () => setisCancelled(true);
  }, []);

  return (
    <section className="container px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-function flex-1 flex justify-center text-3xl">
          資料
        </div>
      </div>
      <div className="class-center flex flex-col md:flex-row">
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
                      {fileItems &&
                        fileItems.map((fileItem) => (
                          <tr key={fileItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={fileItem.downloadURL}
                                >
                                  {fileItem.fileName}
                                </a>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {!!fileItem.createdAt &&
                                  formatTime(fileItem.createdAt.seconds)}
                              </div>
                            </td>
                            {isTeacher && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center">
                                <span
                                  onClick={() => {
                                    if (!window.confirm("本当に削除しますか？"))
                                      return false;
                                    deleteFile(
                                      fileItem.id,
                                      fileItem.fileName,
                                      fileItem.fileNameInDB
                                    );
                                  }}
                                  className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-xl bg-red-600 text-white text-xl cursor-pointer "
                                >
                                  削除
                                </span>
                              </td>
                            )}
                            {!isTeacher && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center">
                                <span
                                  onClick={() => ErrorMessage("削除できない！")}
                                  className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-xl bg-red-600 text-white text-xl cursor-pointer "
                                >
                                  削除
                                </span>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {isTeacher && (
            <form onSubmit={uploadFileHandler}>
              <div className="class-action my-10 flex flex-col justify-around">
                <div>
                  <div className="text-center">資料をアップロード</div>
                  <div className="flex justify-center">
                    <div>
                      <label htmlFor="document_file" className="btn">
                        <i className="fas fa-cloud-upload-alt mr-2"></i>{" "}
                        アップロード <br />
                      </label>
                      <input
                        type="file"
                        id="document_file"
                        onChange={(e) => {
                          setFileName(e.target.files[0].name);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center">{fileName}</div>
                </div>
                <div className="my-10">
                  <div className="flex justify-center">
                    <div>
                      <button className=" btn ">サプミット</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
          {!isTeacher && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ErrorMessage("サプミットできない");
              }}
            >
              <div className="class-action my-10 flex flex-col justify-around">
                <div>
                  <div className="text-center">資料をアップロード</div>
                  <div className="flex justify-center">
                    <div>
                      <label htmlFor="document_file" className="btn">
                        <i className="fas fa-cloud-upload-alt mr-2"></i>{" "}
                        アップロード
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
            </form>
          )}
        </div>
        <div className="mx-10 class-right flex-auto w-80 flex-grow-0">
          {/* <div className="flex jutify-end"> */}
          <ClassInfo
            classInfo={
              classes[classes.findIndex((item) => item.id === classUID)]
            }
            classes={classes}
            changeClassId={changeClassId}
          />

          {/* </div> */}
        </div>
      </div>
    </section>
  );
}
