<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Historico;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoricoController extends Controller
{
    public function listarHistorico()
    {
        $historico = Historico::all();

        return response()->json([
            'historico' => $historico
        ]);
    }

    public function criarHistorico(Request $request)
    {
        $historico = new Historico();

        $userLogged = User::find(FacadesAuth::id())->name;
        $historico->estoque_id = $request->estoque_id;
        $historico->acao = $request->acao;
        $historico->quantidade = $request->quantidade;

        $historico->save();

        return response()->json([
            'message' => 'O usuário ' . $userLogged . ' criou um novo histórico com a ação ' . $request->acao
        ]);
    }
}
