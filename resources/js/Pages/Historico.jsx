import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

export default function Historico({ auth }) {
    const [privilege, setPrivilege] = useState("");
    const [dbActions, setdbActions] = useState([]);

    const columns = [
        { field: "id", headerName: "ID", width: 200, headerAlign: "center", },
        { field: "user_id", headerName: "ID do Usuário", width: 300, headerAlign: "center", }, 
        { field: "acao", headerName: "Ação", width: 300, headerAlign: "center", },
        { field: "quantidade", headerName: "Quantidade", width: 300, headerAlign: "center", },
        { field: "updated_at", headerName: "Data", width: 300, headerAlign: "center", }, 
    ];


    const getAllActions = async () => {
        try {
            const response = await axios.get("/historico/getAllHistory");
            setdbActions(response.data.historico); 
        } catch (error) {
            console.error("Erro ao buscar ações: ", error);
        }
    };

    const handleExport = () => {
        const customData = dbActions.map((item) => ({
            Id: item.id,
            'Id Do Usuário': item.user_id,
            Ação: item.acao,
            Quantidade: item.quantidade,
            Data: item.updated_at,

        }));

        const worksheet = XLSX.utils.json_to_sheet(customData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, "historico.xlsx");
    };


    // Hook para carregar as ações e o privilégio do usuário ao montar o componente
    useEffect(() => {
        getAllActions();
        setPrivilege(auth.user.role);
    }, [auth.user.role]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="mt-2 flex w-56 transform items-center p-3 rounded-xl hover:scale-105 hover:transition-transform">
                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => handleExport()}
                >
                    <FontAwesomeIcon
                        icon={faFileExcel}
                        className="!text-whitegroup-hover:text-white mr-1"
                        size="x"
                    />
                    Excel
                </button>
            </div>

            <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={dbActions}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    className="p-2 shadow-sm"
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-cell": {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    }}
                />
            </Paper>
        </AuthenticatedLayout>
    );
}
