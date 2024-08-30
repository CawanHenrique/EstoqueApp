<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Estoque;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use App\Models\User;

class EstoqueController extends Controller
{
    public function listarEstoque()
    {
        return Estoque::all();
    }

    public function criarEstoque(Request $request)
    {

        $role = User::find(FacadesAuth::id())->role;

        if($role != 'admin') {
            return response()->json(['message' => 'Você não tem permissão para criar um item de estoque!'], 403);
        }

        $estoque = new Estoque();
        $estoque->nome = $request->nome;
        $estoque->categoria = $request->categoria;
        $estoque->quantidade = $request->quantidade;
        $estoque->save();

        return response()->json($estoque);
    }

    public function deletarEstoque($id)
    {

        $role = User::find(FacadesAuth::id())->role;

        if($role != 'admin') {
            return response()->json(['message' => 'Você não tem permissão para deletar um item de estoque!'], 403);
        }

        Estoque::find($id)->delete();
        return response()->json(['message' => 'Item deletado com sucesso!']);
    }

    public function atualizar(Request $request, $id)
    {

        $role = User::find(FacadesAuth::id())->role;

        if($role != 'admin') {
            return response()->json(['message' => 'Você não tem permissão para atualizar um item de estoque!'], 403);
        }

        $estoque = Estoque::find($id);
        $estoque->nome = $request->nome;
        $estoque->categoria = $request->categoria;
        $estoque->quantidade = $request->quantidade;
        $estoque->save();

        return response()->json($estoque);
    }

    public function consumirQuantidadeEstoque(Request $request, $id)
    {

        $estoque = Estoque::find($id);

        if (!$estoque) {
            return response()->json(['message' => 'Item de estoque não encontrado!'], 404);
        }

        if ($request->quantidade > $estoque->quantidade) {
            return response()->json(['message' => 'Quantidade insuficiente em estoque!'], 400);
        }

        $estoque->quantidade -= $request->quantidade;
        $estoque->save();

        return response()->json($estoque);
    }
}
