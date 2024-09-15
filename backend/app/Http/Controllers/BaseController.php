<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class BaseController extends Controller
{
    /**
     * Returns a successful response for all requests different than GET.
     *
     * @param string $message
     * @param int $id
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successfulResponse(string $message, int $id, int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => [
                'id' => $id
            ]
        ], $statusCode);
    }
}
