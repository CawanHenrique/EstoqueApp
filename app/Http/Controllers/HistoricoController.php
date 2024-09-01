<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Historico;
use Illuminate\Http\Request;

class HistoricoController extends Controller
{
    // show all history
    public function getAllHistory()
    {
        $historico = Historico::all();
        return response()->json([
            'historico' => $historico
        ]);
    }
}
