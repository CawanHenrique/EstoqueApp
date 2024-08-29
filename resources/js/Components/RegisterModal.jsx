import React from "react";

export default function RegisterModal({ isOpenRegister, setModalOpenRegister, children }) {
    return isOpenRegister ? (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-50 w-3/4 max-w-lg flex flex-col items-center">
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                    onClick={setModalOpenRegister}
                >
                    <p>X</p>
                </button>
                <div className="w-full" >
                    {children}
                </div>
            </div>
        </>
    ) : null;
}
