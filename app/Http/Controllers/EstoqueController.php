<?php

namespace App\Http\Controllers;

use App\Models\Estoque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\HistoricoService;

class EstoqueController extends Controller
{
    protected $historicoService;

    public function __construct(HistoricoService $historicoService)
    {
        $this->historicoService = $historicoService;
    }

    public function listarEstoque()
    {
        return response()->json(Estoque::all());
    }

    public function criarEstoque(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Admin') {
            return response()->json(['message' => 'Você não tem permissão para criar um item de estoque!'], 403);
        }

        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'categoria' => 'required|string|max:255',
            'quantidade' => 'required|integer|min:1',
        ]);

        $estoque = Estoque::create($validatedData);

        $this->historicoService->criarHistorico($estoque->id, 'criar', $estoque->quantidade);

        return response()->json($estoque, 201);
    }

    public function deletarEstoque($id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Admin') {
            return response()->json(['message' => 'Você não tem permissão para deletar um item de estoque!'], 403);
        }

        $estoque = Estoque::find($id);

        if (!$estoque) {
            return response()->json(['message' => 'Item de estoque não encontrado!'], 404);
        }

        $estoque->delete();

        $this->historicoService->criarHistorico($id, 'deletar', $estoque->quantidade);

        return response()->json(['message' => 'Item deletado com sucesso!'], 200);
    }

    public function atualizar(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Admin') {
            return response()->json(['message' => 'Você não tem permissão para atualizar um item de estoque!'], 403);
        }

        $estoque = Estoque::find($id);

        if (!$estoque) {
            return response()->json(['message' => 'Item de estoque não encontrado!'], 404);
        }

        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'categoria' => 'sometimes|required|string|max:255',
            'quantidade' => 'sometimes|required|integer|min:1',
        ]);

        $estoque->update($validatedData);

        $this->historicoService->criarHistorico($id, 'atualizar', $estoque->quantidade);

        return response()->json($estoque, 200);
    }

    public function consumirQuantidadeEstoque(Request $request, $id)
    {
        $estoque = Estoque::find($id);

        if (!$estoque) {
            return response()->json(['message' => 'Item de estoque não encontrado!'], 404);
        }

        $validatedData = $request->validate([
            'quantidade' => 'required|integer|min:1',
        ]);

        if ($validatedData['quantidade'] > $estoque->quantidade) {
            return response()->json(['message' => 'Quantidade insuficiente em estoque!'], 400);
        }

        $estoque->quantidade -= $validatedData['quantidade'];
        $estoque->save();

        $this->historicoService->criarHistorico($id, 'consumir', $validatedData['quantidade']);

        return response()->json($estoque, 200);
    }
}
