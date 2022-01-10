import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import "./index.scss";
export default function AddLesson(props = {}) {
  const { open, setOpen, data } = props;
  const [isTitleFocus, setIsTitleFocus] = useState(false);
  const [isDateEndFocus, setIsDateEndFocus] = useState(false);

  const [title, setTitle] = useState(data?.title);
  const [dateEnd, setDateEnd] = useState(data?.dateEnd);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        // initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="bg-white">
                <div className="w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {/* <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 text-center font-bold"
                    >
                      レッソン追加
                    </Dialog.Title> */}
                    <section className="signin flex justify-center text-center mt-10">
                      <div className="flex justify-center flex p-10 w-50 sm:mt-0 sm:ml-4">
                        {/* <div className="login-content"> */}
                        <form action="index.html">
                          <h3 className="title font-bold text-lg mb-10">
                          レッソン追加
                          </h3>

                          <div
                            className={`input-div one ${
                              isTitleFocus ? "focus" : ""
                            }`}
                          >
                            <div className="i">
                              <i className="fas fa-file-alt"></i>
                            </div>
                            <div className="div ">
                              <h5 className={`${title ? "hidden" : ""}`}>
                              レッソンタイトル
                              </h5>
                              <input
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                }}
                                type="text"
                                className="input"
                                required
                                onFocus={() => {
                                  setIsTitleFocus(true);
                                }}
                                onBlur={() => {
                                  setIsTitleFocus(false);
                                }}
                                name="title"
                              />
                            </div>
                          </div>

                          <div
                            className="text-left mt-5"
                            style={{ color: "#999" }}
                          >
                            日付け
                          </div>
                          <div
                            className={`input-div pass ${
                              isDateEndFocus ? "focus" : ""
                            }`}
                            style={{ margin: 0 }}
                          >
                            <div className="i">
                              <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="div ">
                              <input
                                onChange={(e) => {
                                  setDateEnd(e.target.value);
                                }}
                                type="date"
                                className="input"
                                required
                                onFocus={() => {
                                  setIsDateEndFocus(true);
                                }}
                                onBlur={() => {
                                  setIsDateEndFocus(false);
                                }}
                                name="dateEnd"
                              />
                            </div>
                          </div>

                          {/* <input
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSignup();
                                  }}
                                  type="submit"
                                  className="btn"
                                  value="追加"
                                /> */}
                        </form>
                        {/* </div> */}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    //   handleSignup();
                  }}
                >
                  編集
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
