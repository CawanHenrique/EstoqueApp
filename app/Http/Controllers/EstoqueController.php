<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Estoque;
use Illuminate\Http\Request;

class EstoqueController extends Controller
{
    public function listarEstoque()
    {
        return Estoque::all();
    }

    public function criarEstoque(Request $request)
    {
        $estoque = new Estoque();
        $estoque->nome = $request->nome;
        $estoque->categoria = $request->categoria;
        $estoque->quantidade = $request->quantidade;
        $estoque->save();

        return response()->json($estoque);
    }

    public function deletarEstoque($id)
    {
        Estoque::find($id)->delete();
        return response()->json(['message' => 'Item deletado com sucesso!']);
    }

    public function atualizar(Request $request, $id)
    {
        $estoque = Estoque::find($id);
        $estoque->nome = $request->nome;
        $estoque->categoria = $request->categoria;
        $estoque->quantidade = $request->quantidade;
        $estoque->save();

        return response()->json($estoque);
    }

    public function atualizarQuantidadeEstoque(Request $request, $id)
    {
        $estoque = Estoque::find($id);

        if ($request->action == 'adicionar') {
            $estoque->quantidade += 1;
        } else {
            $estoque->quantidade -= 1;
        }

        $estoque->save();

        return response()->json($estoque);
    }

}
