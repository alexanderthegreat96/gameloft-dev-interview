<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Search;
use Illuminate\Http\Request;
use App\Traits\LogSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class SearchHistoryController extends Controller
{
    use LogSearch;
    public function index(Request $request): JsonResponse {
        $perPage = $request->get('per_page', 20);
        $searches = Search::where('session_key', $this->searchSession($request))->orderByDesc('created_at')->paginate($perPage);
        
        if ($searches) {
            return response()->json($searches);
        }
        return response()->json([
            'error' => 'No searches found!'
        ])->setStatusCode(404);
    }

    public function delete(Request $request): JsonResponse {
        $id = $request->id;
        if ($id) {
            Search::where('id', $id)->delete();
            return response()->json()->setStatusCode(204);
        }
        return response()->json([
            'error' => 'Failed to provide an entry ID!'
        ])->setStatusCode(404);
    }

    public function deleteAll(Request $request): Response {
        Search::where('session_key', $this->searchSession($request))->delete();
        return response([], 204);
    }
}
