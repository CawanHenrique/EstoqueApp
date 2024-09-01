<?php

namespace App\Services;

use App\Models\Historico;
use App\Models\Estoque;  // Certifique-se de importar o modelo Estoque
use Illuminate\Support\Facades\Auth;

class HistoricoService
{
    public function criarHistorico($estoqueId, $acao, $quantidade)
    {
        // Verifica se o estoque existe
        $estoque = Estoque::find($estoqueId);

        if (!$estoque) {
            return 'O item de estoque com o ID ' . $estoqueId . ' não foi encontrado.';
        }

        $user = Auth::user();

        if (!$user) {
            return 'Usuário não autenticado!';
        }

        $historico = new Historico();
        $historico->estoque_id = $estoqueId;
        $historico->acao = $acao;
        $historico->quantidade = $quantidade;
        $historico->user_id = $user->id;

        $historico->save();

        return 'O usuário ' . $user->name . ' criou um novo histórico com a ação ' . $acao;
    }
}
