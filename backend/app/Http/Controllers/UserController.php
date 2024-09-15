<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Returns a collection of users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return UserResource[]
     */
    public function index(Request $request)
    {
        // Play with this value to see the pagination on the frontend
        $records_per_page = $request->query('per_page', 20);

        return UserResource::collection(
            User::orderBy('id', 'asc')
                ->paginate($records_per_page)
        );
    }
}
