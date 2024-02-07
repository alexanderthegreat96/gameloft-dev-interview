<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VideoItem;

class VideosController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $query = $request->get('query');

        $videos = VideoItem::query();

        if ($query) {
            $videos->where('title', 'like', "%$query%")
                    ->orWhere('description', 'like', "%$query%");
        }

        $videos = $videos->paginate($perPage);

        return response()->json($videos);
    }


    public function show($id)
    {
        $video = VideoItem::findOrFail($id);
        return response()->json($video);
    }
}
