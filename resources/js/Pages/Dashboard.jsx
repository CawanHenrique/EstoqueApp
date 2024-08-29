import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import VetModal from "@/Components/VetModal";
import { useState } from "react";
import RegisterModal from "@/Components/RegisterModal.jsx";
import axios from "axios";
// router do inertia

export default function Dashboard({ auth }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const estoque = [
        { id: 1, nome: "V10", qtd: 10 },
        { id: 2, nome: "Antirrábica", qtd: 20 },
        { id: 3, nome: "Giárdia", qtd: 30 },
        { id: 4, nome: "Hepatite", qtd: 15 },
        { id: 5, nome: "Leptospirose", qtd: 25 },
        { id: 6, nome: "Parvovirose", qtd: 18 },
        { id: 7, nome: "Coronavirose", qtd: 22 },
        { id: 8, nome: "Cinomose", qtd: 14 },
    ];

    const getAllEstoques = async () => {
        router.get("/estoque", {}, {
            onSuccess: (data) => {
                console.log(data);
            }
        });
    };

    getAllEstoques();


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-azulescuro leading-tight">
                    Estoque
                </h2>
            }
        >
            <Head title="Início" />

            <div className="w-full h-screen flex flex-col p-4 bg-gray-100">
                <div className="flex w-56 rounded-xl items-center bg-azulescuro">
                    <button
                        type="button"
                        className="items-center text-white p-2 "
                        isOpenRegister={openModalRegister}
                        onClick={() => setOpenModalRegister(true)}
                    >
                        + REGISTRAR NOVO ITEM
                    </button>
                </div>
                <RegisterModal
                    isOpenRegister={openModalRegister}
                    setModalOpenRegister={() =>
                        setOpenModalRegister(!openModalRegister)
                    }
                >
                    <div className="flex flex-col w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-bold mb-4">
                            Registro de produto
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    placeholder="Digite o nome do item"
                                    className="border rounded p-2 mt-2 w-full"
                                />
                            </label>
                            <label>
                                Validade:
                                <input
                                    type="date"
                                    className="border rounded p-2 mt-2 w-full"
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    className="border rounded p-2 mt-2 w-full"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-azulescuro text-white rounded-xl py-2 px-4">
                                Registrar
                            </button>
                        </div>
                    </div>
                </RegisterModal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {estoque.map((item) => (
                        <div className="flex flex-col bg-white shadow-md p-4 rounded-lg">
                            <div className="flex flex-col mb-4">
                                <p className="text-azulescuro font-bold">
                                    Vacina: {item.nome}
                                </p>
                                <p className="text-azulescuro font-bold">
                                    Quantidade: {item.qtd}
                                </p>
                            </div>
                            <div className="flex justify-end mt-auto">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(true)}
                                    className="bg-azulciano text-white py-2 px-4 rounded-md"
                                >
                                    Consumir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <VetModal
                    isOpen={openModal}
                    setModalOpen={() => setOpenModal(!openModal)}
                >
                    <div className="flex flex-col w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-bold mb-4">
                            Registro de Uso
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    placeholder="Digite o nome do item"
                                    className="border rounded p-2 mt-2 w-full"
                                />
                            </label>
                            <label>
                                Validade:
                                <input
                                    type="date"
                                    className="border rounded p-2 mt-2 w-full"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-azulescuro text-white rounded-xl py-2 px-4">
                                Registrar
                            </button>
                        </div>
                    </div>
                </VetModal>
            </div>
        </AuthenticatedLayout>
    );
}
