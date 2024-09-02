import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import VetModal from "@/Components/VetModal";
import RegisterModal from "@/Components/RegisterModal.jsx";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteModal from "@/Components/DeleteModal";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersScreen({ auth }) {
    const [dbUser, setDbUser] = useState([]);
    console.log(auth);

    const [user, setUser] = useState({
        id: null,
        name: "",
        role: "",
        email: "",
        password: "",
    });

    const handleExport = () => {
        // Exemplo de como personalizar as colunas exportadas
        const customData = dbUser.map((item) => ({
            Nome: item.name,
            Email: item.email,
            Cargo: item.role,
        }));

        const worksheet = XLSX.utils.json_to_sheet(customData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "usuarios.xlsx");
    };

    const columns = [
        { field: "id", headerName: "ID", width: 200, headerAlign: "center" },
        {
            field: "name",
            headerName: "Usuário",
            width: 300,
            headerAlign: "center",
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
            headerAlign: "center",
        },
        {
            field: "role",
            headerName: "Cargo",
            headerAlign: "center",
            width: 300,
        },
        {
            field: "editar",
            headerName: "Editar",
            width: 150,
            headerAlign: "center",
            renderCell: (params) => (
                <div className="flex items-center justify-center">
                    <button
                        className="flex items-center justify-center rounded-md bg-azulescuro px-1 py-1 text-white"
                        onClick={() => openEditModal(params.row)} // Abre o modal com os dados do usuário
                    >
                        <Pencil className="h-5 w-5 text-gray-100" />
                    </button>
                </div>
            ),
        },
    ];

    const [privilage, setPrivilage] = useState("");
    const [getUsersIdSelecteds, setUserIdSelecteds] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [viewPass, setViewPass] = useState(false);

    const getUsersCreated = async () => {
        axios
            .get("/users")
            .then((response) => {
                setDbUser(response.data.users);
                toast.success("Usuários carregados com sucesso!");
                console.log("Dale");
            })
            .catch((error) => {
                console.error("Falha ao acessar usuários:", error);
                toast.error("Erro ao carregar os usuários", error);
            });
    };

    const enableViewPass = () => {
        setViewPass(!viewPass);
    };

    const editUser = (id, updatedUser) => {
        axios
            .put(`/users/${id}`, updatedUser)
            .then(() => {
                getUsersCreated();
                toast.success("Usuário editado com sucesso!"); // Atualiza a lista de usuários
            })
            .catch((error) => {
                console.error("Falha ao editar usuário:", error);
                toast.error("Erro ao editar usuário: ", error);
            });
    };

    const openEditModal = (user) => {
        setUser(user); // Define o usuário selecionado para edição
        setOpenModal(true); // Abre o modal de edição
    };

    const editUserById = () => {
        const updatedUser = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            password: user.password,
        };

        editUser(user.id, updatedUser);
        setOpenModal(false); // Fecha o modal após a edição
    };

    const createUser = (user) => {
        axios
            .post("/users", user)
            .then(() => {
                getUsersCreated(user);
                setOpenModalRegister(false);
                toast.success("Usuário criado com sucesso!");
            })
            .catch((error) => {
                console.error("Falha ao criar usuário:", error);
                toast.error("Erro ao criar o usuário: ", error);
            });
    };

    const deleteUser = (id) => {
        axios
            .delete(`/users/${id}`)
            .then((id) => {
                getUsersCreated();
                setOpenModal(false);
                toast.success("Usuário deletado com sucesso!");
            })
            .catch((error) => {
                console.error("Falha ao deletar usuário:", error);
                toast.error("Erro ao deletar o usuário: ", error);
            });
    };

    const deleteUsersSelectedById = () => {
        getUsersIdSelecteds.map((id) => {
            deleteUser(id);
            setOpenModalDelete(false);
        });
    };

    useEffect(() => {
        getUsersCreated();
        setPrivilage(auth.user.role);
    }, []);

    return (
        <div>
            {auth.user.role != "Admin" ? (
                <AuthenticatedLayout user={auth.user}>
                    <div>Não é Admin.</div>
                </AuthenticatedLayout>
            ) : (
                <div>
                    <AuthenticatedLayout user={auth.user}>
                        <ToastContainer />
                        <RegisterModal
                            isOpenRegister={openModalRegister}
                            setModalOpenRegister={() =>
                                setOpenModalRegister(!openModalRegister)
                            }
                        >
                            <div className="mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-3 shadow-lg">
                                <h1 className="mb-4 text-xl font-bold">
                                    Registro de usuário
                                </h1>
                                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <label>
                                        Nome:
                                        <input
                                            type="text"
                                            placeholder="Digite o nome do usuário"
                                            className="mt-2 w-full rounded border p-2"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                    <label>
                                        Email:
                                        <input
                                            type="email"
                                            className="mt-2 w-full rounded border p-2"
                                            placeholder="Digite o email do usuário"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                    <label className="relative">
                                        Senha:
                                        <div className="relative">
                                            <input
                                                type={
                                                    viewPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                className="mt-2 w-full rounded border p-2 pr-12"
                                                placeholder="Digite a senha do usuário"
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 mt-1 flex h-full w-10 items-center justify-center"
                                                onClick={() =>
                                                    setViewPass(!viewPass)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        viewPass
                                                            ? faEyeSlash
                                                            : faEye
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </label>

                                    <label>
                                        Privilégio:
                                        <input
                                            type="text"
                                            className="mt-2 w-full rounded border p-2"
                                            placeholder="Digite o privilégio"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    role: e.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="rounded-xl bg-azulescuro px-4 py-2 text-white"
                                        onClick={() => createUser(user)}
                                    >
                                        Registrar
                                    </button>
                                </div>
                            </div>
                        </RegisterModal>
                        <Paper sx={{ height: 400, width: "100%" }}>
                            <DataGrid
                                rows={dbUser}
                                columns={columns}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                onRowSelectionModelChange={(newSelection) => {
                                    setUserIdSelecteds(newSelection);
                                }}
                                sx={{
                                    border: 0,
                                    "& .MuiDataGrid-cell": {
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                }}
                                className="p-2 shadow-sm"
                            />
                        </Paper>

                        <div className="flex">
                            <div className="flex w-full flex-row items-center space-x-3 p-2">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            setOpenModalRegister(true)
                                        }
                                        className="mt-2 w-40 transform items-center justify-center rounded-md bg-azulciano p-2 text-white transition-transform hover:scale-105"
                                    >
                                        + CRIAR USUÁRIO
                                    </button>
                                </div>
                                <div className="mt-2.5 flex items-center justify-center">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success group hover:text-white hover:scale-105 hover:transition-transform"
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

                                {getUsersIdSelecteds.length >= 2 &&
                                    privilage == "Admin" && (
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="mt-2 w-32 rounded-md bg-red-500 p-2 text-white"
                                                onClick={() =>
                                                    setOpenModalDelete(true)
                                                }
                                            >
                                                Apagar usuário
                                            </button>
                                        </div>
                                    )}
                            </div>

                            <VetModal
                                isOpen={openModal}
                                setModalOpen={() => setOpenModal(!openModal)}
                            >
                                <div className="mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6">
                                    <h1 className="mb-4 text-xl font-bold">
                                        Editar Usuário
                                    </h1>
                                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <label>
                                            Nome:
                                            <input
                                                type="text"
                                                value={user.name}
                                                placeholder="Digite o nome do usuário"
                                                className="mt-2 w-full rounded border p-2"
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                        <label>
                                            Email:
                                            <input
                                                type="email"
                                                value={user.email}
                                                className="mt-2 w-full rounded border p-2"
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                        <label>
                                            Cargo:
                                            <input
                                                type="text"
                                                value={user.role}
                                                className="mt-2 w-full rounded border p-2"
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        role: e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <Trash2 className="text-red-500" />
                                        </button>
                                        <button
                                            className="transform rounded-xl bg-azulescuro px-3 py-1 text-white transition-transform hover:scale-105"
                                            onClick={editUserById}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </VetModal>

                            <DeleteModal
                                isOpenDelete={openModalDelete}
                                setModalOpenDelete={() =>
                                    setOpenModalDelete(!openModalDelete)
                                }
                            >
                                <div className="mx-auto flex w-full max-w-lg flex-col rounded-lg bg-white p-6">
                                    <h1 className="mb-4 text-xl font-bold">
                                        Apagar usuários
                                    </h1>
                                    <p>
                                        Você tem certeza que deseja apagar os
                                        usuários selecionados?
                                    </p>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            className="rounded-xl bg-red-500 px-4 py-2 text-white"
                                            onClick={deleteUsersSelectedById}
                                        >
                                            Apagar
                                        </button>
                                    </div>
                                </div>
                            </DeleteModal>
                        </div>
                    </AuthenticatedLayout>
                </div>
            )}
        </div>
    );
}
