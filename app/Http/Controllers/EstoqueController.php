<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Estoque;
use Illuminate\Http\Request;

class EstoqueController extends Controller
{
    public function listarEstoque()
    {
        $estoques = Estoque::all();
        return response()->json($estoques);
    }

    public function criarEstoque(Request $request)
    {
        $nome = $request->input('nome');
        $quantidade = $request->input('quantidade');
        $categoria = $request->input('categoria');

        $estoque = new Estoque();
        $estoque->nome = $nome;
        $estoque->quantidade = $quantidade;
        $estoque->categoria = $categoria;
        $estoque->save();
    }

    public function atualizarQuantidadeEstoque(Request $request)
    {
        $id = $request->route('id');
        $action = $request->route('action');
        $estoque = Estoque::find($id);

        if ($action == 'adicionar') {
            $estoque->quantidade += 1;
        } else {
            $estoque->quantidade -= 1;
        }

        $estoque->save();
    }

    public function deletarEstoque($id)
    {
        $estoque = Estoque::find($id);
        $estoque->delete();
    }

}
