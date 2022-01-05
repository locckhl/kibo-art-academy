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
import { useQuery } from "react-query";
import { getClasses } from "../../lib/class";
import Skeleton from "react-loading-skeleton";

export default function Document() {
  const [fileItems, setfileItems] = useState(null);
  const { classId } = useParams();
  const [classUID, setClassesUID] = useState(classId);
  const [isTeacher, setIsTeacher] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, seterror] = useState(null);
  const [isPending, setisPending] = useState(false);
  const [isCancelled, setisCancelled] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  let url = "";

  const { currentUser: userInfo } = useAuth();
  const { data: classes, isLoading } = useQuery(
    ['getClasses', { currentUser:userInfo }],
    getClasses,
    {
      enabled: !!userInfo
    }
  );
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
    var checkNameArray = fileItems.map(fileItem => {
      return fileItem.fileName;
    })
    // console.log(checkNameArray);
    if (checkNameArray.includes(newFileName)) {
      return 1;
    }
    return 0;
  };
  const uploadFileHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
  };

  const uploadFiles = async (file) => {
    // Get the file input element
    var theFile = document.getElementById('document_file');
    seterror(null);
    setisPending(true);

    if (!file) return;
    //upload file to storage

    //check if name duplicated
    if (checkNameOfTheFile(file.name)) {
      const duplicatedFile = fileItems.filter(fileItem => {
        return fileItem.fileName === file.name
      });
      deleteFile(duplicatedFile[0].id, duplicatedFile[0].fileName, 1);
    }
    //Ex: cat.png/cat.pnd; cat_1.png/cat.png
    let storagePath = `/${classUID}/${file.name}`;
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
              fileName: file.name,
              downloadURL: url,
              createdAt: serverTimestamp(),
            }).then(() => {
              if (!isCancelled) {
                seterror(null);
                setisPending(false);
                // console.log(theFile.value);
                theFile.value = null;
                setFileUpload("");
                // console.log('fileUpload: ', fileUpload);
                // console.log(theFile);
              }
              SuccessMessage("アップロード成功");
            });
          } catch (err) {
            console.log(err.message);
            if (!isCancelled) {
              seterror(err.message);
              setisPending(false);
              console.log(theFile.value);
              theFile.value = null;
              setFileUpload("");
              console.log('fileUpload: ', fileUpload);
              console.log(theFile);
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
        if (!isCancelled) {
          setfileItems(results);
          seterror(null);
        }
      },
      (err) => {
        if (!isCancelled) {
          console.log(err);
          seterror("could not fetch the data");
        }
      }
    );

    // unsubscribe on unmount
    return () => unsub();
  }, [classUID]);

  //delete file
  const deleteFile = (id, fileName, isDuplicated) => {
    let storagePath = `/${classUID}/${fileName}`;
    const desertRef = ref(storage, storagePath);
    deleteObject(desertRef)
      .then(() => {
        // console.log("File in Storage deleted");
        const refer = doc(db, "Classes", classUID, "Files", id);
        deleteDoc(refer)
          .then(() => {
            // console.log("File in Firestore deleted");
            if (isDuplicated === 0) {
              SuccessMessage("削除しました");
              return;
            }
            return;
          })
          .catch((err) => {
            ErrorMessage("Firestote: エラーがある");
            return;
          });
      })
      .catch((err) => {
        ErrorMessage("Storage: エラーがある");
        return;
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
    return () => {
      setisCancelled(true);
      setFileUpload('');
    }
  }, []);

  if ( isLoading) return <Skeleton count={20} />;

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
                                      0
                                    );
                                  }}
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
                          if (e.target.files[0] != null) {
                            setFileUpload(e.target.files[0].name);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center">{fileUpload}</div>
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
