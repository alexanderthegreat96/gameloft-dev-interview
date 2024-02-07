<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsItem;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $query = $request->get('query');

        $news = NewsItem::query();

        if ($query) {
            $news->where('title', 'like', "%$query%")
                    ->orWhere('description', 'like', "%$query%");
        }

        $news = $news->paginate($perPage);
        
        if ($news) {
            return response()->json($news);
        }

        return response()->json([
            'error' => 'No news found!'
        ]);
       
    }


    public function show($id)
    {
        $news = NewsItem::findOrFail($id);
        return response()->json($news);
    }
}
