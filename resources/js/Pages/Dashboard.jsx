import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import VetModal from "@/Components/VetModal";
import { useEffect, useState } from "react";
import RegisterModal from "@/Components/RegisterModal.jsx";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Dashboard({ auth }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [privilage, setPrivilage] = useState("");

    const [estoque, setEstoque] = useState([]);

    const [item, setItem] = useState({
        id: null,
        nome: "",
        categoria: "animal",
        quantidade: 0,
    });



    const getAllEstoques = async () => {
        axios.get("/estoque").then((response) => {
            setEstoque(response.data);
            toast.success("Estoque carregado com sucesso!");
        }).catch(error => {
            console.error("Erro ao carregar o estoque:", error);
            toast.error("Erro ao carregar o estoque!");
        })
    };


    const criarItem = async (item) => {
        axios.post("/estoque", item).then(() => {
            getAllEstoques();
            setOpenModalRegister(false);
            toast.success("Item registrado com sucesso!");
        }).catch(error => {
            console.error("Erro ao registrar o item:", error);
            toast.error("Erro ao registrar o item!");
        });
    };

    const atualizarItem = async (id, item) => {
        axios.put(`/estoque/${id}`, item).then(() => {
            getAllEstoques();
            setOpenModal(false);
            toast.success("Item atualizado com sucesso!");
        }).catch(error => {
            console.error("Erro ao atualizar o item:", error);
            toast.error("Erro ao atualizar o item!");
        });
    };

    const deletarItem = async (id) => {
        axios.delete(`/estoque/${id}`).then(() => {
            getAllEstoques();
            toast.success("Item deletado com sucesso!");
        }).catch(error => {
            console.error("Erro ao deletar o item:", error);
            toast.error("Erro ao deletar o item!");
        });
    };

    const consumirQuantidadeEstoque = async (id, quantidade) => {
        axios.put(`/estoque/${id}/consumir`, { quantidade })
            .then(() => {
                getAllEstoques();
                setOpenModal(false);
                toast.success("Quantidade consumida com sucesso!");
            })
            .catch(error => {
                console.error("Erro ao consumir a quantidade do item:", error);
                toast.error("Erro ao consumir a quantidade do item!");
            });
    };

    useEffect(() => {
        getAllEstoques();
        setPrivilage(auth.user.role);
    }, []);

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
            <ToastContainer />

            <div className="w-full h-screen flex flex-col p-4 bg-gray-100">
                {privilage == 'admin' && (
                    <div className="flex w-56 rounded-xl items-center bg-azulescuro">
                        <button
                            type="button"
                            className="items-center text-white p-2"
                            onClick={() => setOpenModalRegister(true)}
                        >
                            + REGISTRAR NOVO ITEM
                        </button>
                    </div>
                )}

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
                                    onChange={(e) =>
                                        setItem({ ...item, nome: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    className="border rounded p-2 mt-2 w-full"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            quantidade: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-azulescuro text-white rounded-xl py-2 px-4"
                                onClick={() => criarItem(item)}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </RegisterModal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {estoque.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col bg-white shadow-md p-4 rounded-lg"
                        >
                            <div className="flex flex-col mb-4">
                                <p className="text-azulescuro font-bold">
                                    Item: {item.nome}
                                </p>
                                <p className="text-azulescuro font-bold">
                                    Quantidade: {item.quantidade}
                                </p>
                            </div>
                            <div className="flex justify-end mt-auto space-x-2">
                                {privilage == 'admin' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setItem(item);
                                            setOpenModal(true);
                                        }}
                                        className="bg-azulciano text-white py-2 px-4 rounded-md"
                                    >
                                        Editar
                                    </button>
                                )}
                                {/* botão de consumir*/}
                                <button
                                    type="button"
                                    onClick={() => consumirQuantidadeEstoque(item.id, 1)}
                                    className="bg-azulciano text-white py-2 px-4 rounded-md"
                                >
                                    Consumir
                                </button>
                                {privilage == 'admin' && (
                                    <button
                                        type="button"
                                        onClick={() => deletarItem(item.id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md"
                                    >
                                        Deletar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <VetModal
                    isOpen={openModal}
                    setModalOpen={() => setOpenModal(!openModal)}
                >
                    <div className="flex flex-col w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl font-bold mb-4">Editar Produto</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    value={item.nome}
                                    placeholder="Digite o nome do item"
                                    className="border rounded p-2 mt-2 w-full"
                                    onChange={(e) =>
                                        setItem({ ...item, nome: e.target.value })
                                    }
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    className="border rounded p-2 mt-2 w-full"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            quantidade: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        {privilage == 'admin' && (
                            <div className="flex justify-between">
                                <div className="flex justify-end">
                                    <button
                                        className="bg-azulescuro text-white rounded-xl py-2 px-4"
                                        onClick={() => atualizarItem(item.id, item)}
                                    >
                                        Atualizar
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="bg-azulescuro text-white rounded-xl py-2 px-4"
                                        onClick={() => consumirQuantidadeEstoque(item.id, 1)}
                                    >
                                        Consumir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </VetModal>
            </div>
        </AuthenticatedLayout>
    );
}
