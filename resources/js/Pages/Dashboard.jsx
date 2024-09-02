import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import VetModal from "@/Components/VetModal";
import { useEffect, useState } from "react";
import RegisterModal from "@/Components/RegisterModal.jsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteModal from "@/Components/DeleteModal";
import * as XLSX from "xlsx";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard({ auth }) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [privilage, setPrivilage] = useState("");
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [idDelete, setIdDelete] = useState([]);

    const [estoque, setEstoque] = useState([]);

    const [item, setItem] = useState({
        id: null,
        nome: "",
        categoria: "animal",
        quantidade: 0,
    });

    const getAllEstoques = async () => {
        axios
            .get("/estoque")
            .then((response) => {
                setEstoque(response.data);
                toast.success("Estoque carregado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao carregar o estoque:", error);
                toast.error("Erro ao carregar o estoque!");
            });
    };

    const handleExport = () => {
        // Exemplo de como personalizar as colunas exportadas
        const customData = estoque.map((item) => ({
            Nome: item.nome,
            Quantidade: item.quantidade,
            Categoria: item.categoria,
        }));

        const worksheet = XLSX.utils.json_to_sheet(customData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "estoque.xlsx");
    };

    const criarItem = async (item) => {
        axios
            .post("/estoque", item)
            .then(() => {
                getAllEstoques();
                setOpenModalRegister(false);
                toast.success("Item registrado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao registrar o item:", error);
                toast.error("Erro ao registrar o item!");
            });
    };

    const atualizarItem = async (id, item) => {
        axios
            .put(`/estoque/${id}`, item)
            .then(() => {
                getAllEstoques();
                setOpenModal(false);
                toast.success("Item atualizado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao atualizar o item:", error);
                toast.error("Erro ao atualizar o item!");
            });
    };

    const deletarItem = async (id) => {
        await axios
            .delete(`/estoque/${id}`)
            .then(() => {
                getAllEstoques();
                toast.success("Item deletado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao deletar o item:", error);
                toast.error("Erro ao deletar o item!");
            });
    };

    const consumirQuantidadeEstoque = async (id, quantidade) => {
        axios
            .put(`/estoque/${id}/consumir`, { quantidade })
            .then(() => {
                getAllEstoques();
                setOpenModal(false);
                toast.success("Quantidade consumida com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao consumir a quantidade do item:", error);
                toast.error("Erro ao consumir a quantidade do item!");
            });
    };

    useEffect(() => {
        getAllEstoques();
        setPrivilage(auth.user.role);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Estoque" />
            <ToastContainer />

            <div className="flex h-screen w-full flex-col p-4">
                <div className="flex flex-row space-x-5">
                    {privilage == "Admin" && (
                        <div className="flex w-44 transform rounded-lg bg-azulciano transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                            <button
                                type="button"
                                className="flex w-full transform items-center justify-center rounded-lg px-3 py-1 font-semibold text-white transition-transform"
                                onClick={() => setOpenModalRegister(true)}
                            >
                                + REGISTRAR ITEM
                            </button>
                        </div>
                    )}

                    {privilage == "Admin" && (
                        <div className="mt-2 flex w-56 transform items-center rounded-xl hover:scale-105 hover:transition-transform">
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={() => handleExport()}
                            >
                                <FontAwesomeIcon
                                    icon={faFileExcel}
                                    className="mr-1 !text-whitegroup-hover:text-white"
                                    size="x"
                                />
                                Excel
                            </button>
                        </div>
                    )}
                </div>
                <RegisterModal
                    isOpenRegister={openModalRegister}
                    setModalOpenRegister={() =>
                        setOpenModalRegister(!openModalRegister)
                    }
                >
                    <div className="mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6">
                        <h1 className="mb-4 text-xl font-bold">
                            Registro de produto
                        </h1>
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    placeholder="Digite o nome do item"
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            nome: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            quantidade: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Categoria:
                                <input
                                    type="text"
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            categoria: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="transform rounded-xl bg-azulescuro px-4 py-2 text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                                onClick={() => criarItem(item)}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </RegisterModal>

                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {estoque.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col rounded-lg bg-white p-4 shadow-md"
                        >
                            <div className="mb-4 flex flex-col">
                                <p className="font-bold text-azulescuro">
                                    Item: {item.nome}
                                </p>
                                <p className="font-bold text-azulescuro">
                                    Quantidade: {item.quantidade}
                                </p>
                                <p className="font-bold text-azulescuro">
                                    Categoria: {item.categoria}
                                </p>
                            </div>
                            <div className="mt-auto flex justify-end">
                                {privilage == "Admin" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIdDelete(item.id);
                                            setOpenModalDelete(
                                                !openModalDelete,
                                            );
                                        }}
                                        className="w-2 transform rounded-md px-4 py-2 text-white transition-transform hover:scale-105"
                                    >
                                        <Trash2 className="text-red-600" />
                                    </button>
                                )}

                                {privilage == "Admin" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setItem(item);
                                            setOpenModal(true);
                                        }}
                                        className="transform rounded-md px-4 py-2 transition-transform hover:scale-105"
                                    >
                                        <Pencil className="text-azulescuro" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        consumirQuantidadeEstoque(item.id, 1)
                                    }
                                    className="transform rounded-md bg-azulescuro px-4 py-2 text-white transition-transform hover:scale-105"
                                >
                                    Consumir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <DeleteModal
                    isOpenDelete={openModalDelete}
                    setModalOpenDelete={() =>
                        setOpenModalDelete(!openModalDelete)
                    }
                >
                    <div className="flex flex-col items-center rounded-lg bg-white p-6">
                        <h1 className="mb-4 text-center text-xl font-bold">
                            Deseja deletar esse item permanentemente?
                        </h1>
                        <div className="mt-4 flex flex-row space-x-4">
                            <button
                                className="w-24 transform rounded-lg bg-teal-500 p-2 font-semibold text-white transition-transform hover:scale-105 hover:bg-teal-400"
                                onClick={() => {
                                    setOpenModalDelete(!openModalDelete);
                                    deletarItem(idDelete);
                                }}
                            >
                                Sim
                            </button>
                            <button
                                onClick={() => setOpenModalDelete(false)}
                                className="w-24 transform rounded-lg bg-red-500 p-2 font-semibold text-white transition-transform hover:scale-105 hover:bg-red-400"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </DeleteModal>

                <VetModal
                    isOpen={openModal}
                    setModalOpen={() => setOpenModal(!openModal)}
                >
                    <div className="mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6">
                        <h1 className="mb-4 text-xl font-bold">
                            Editar Produto
                        </h1>
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <label>
                                Item:
                                <input
                                    type="text"
                                    value={item.nome}
                                    placeholder="Digite o nome do item"
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            nome: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Quantidade:
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            quantidade: e.target.value,
                                        })
                                    }
                                />
                            </label>
                            <label>
                                Categoria:
                                <input
                                    type="text"
                                    value={item.categoria}
                                    className="mt-2 w-full rounded border p-2"
                                    onChange={(e) =>
                                        setItem({
                                            ...item,
                                            categoria: e.target.value,
                                        })
                                    }
                                />
                            </label>
                        </div>
                        {privilage == "Admin" && (
                            <div className="flex justify-end space-x-3">
                                <div className="flex justify-end">
                                    <button
                                        className="transform rounded-xl bg-azulescuro px-4 py-2 text-white transition-transform hover:scale-105"
                                        onClick={() =>
                                            atualizarItem(item.id, item)
                                        }
                                    >
                                        Atualizar
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
