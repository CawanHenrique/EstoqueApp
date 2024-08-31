<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getAllUsers()
    {

        $users = User::select('id', 'name', 'email', 'role')->get();


        return response()->json([
            'users' => $users
        ]);
    }

    public function getUserById($id)
    {
        $user = User::find($id);

        if ($user) {
            return response()->json([
                'user' => $user
            ]);
        } else {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }
    }

    public function createUser(Request $request)
    {
        $user = new User();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->password = bcrypt($request->password);

        $user->save();

        return response()->json([
            'message' => 'Usuário criado com sucesso'
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if ($user) {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->role = $request->role;
            $user->password = bcrypt($request->password);

            $user->save();

            return response()->json([
                'message' => 'Usuário atualizado com sucesso'
            ]);
        } else {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }
    }

    public function deleteUser($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();

            return response()->json([
                'message' => 'Usuário deletado com sucesso'
            ]);
        } else {
            return response()->json([
                'message' => 'Usuário não encontrado'
            ], 404);
        }
    }
}
