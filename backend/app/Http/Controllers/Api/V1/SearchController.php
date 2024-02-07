<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsItem;
use App\Models\VideoItem;
use App\Traits\LogSearch;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
class SearchController extends Controller
{
    use LogSearch;
    public function search(Request $request) {
        $perPage = $request->get('per_page', 10);
        $searchQuery = $request->get('query');
        $keywords = preg_split('/\s+/', $searchQuery, -1, PREG_SPLIT_NO_EMPTY);
    
        $newsResults = collect();
        foreach ($keywords as $keyword) {
            $newsResults = $newsResults->concat(
                NewsItem::where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%')
                    ->get()
                    ->map(function ($item) {
                        $item['type'] = 'news';
                        return $item;
                    })
            );
        }
    
        $videoResults = collect();
        foreach ($keywords as $keyword) {
            $videoResults = $videoResults->concat(
                VideoItem::where('title', 'like', '%' . $keyword . '%')
                    ->orWhere('description', 'like', '%' . $keyword . '%')
                    ->get()
                    ->map(function ($item) {
                        $item['type'] = 'videos';
                        return $item;
                    })
            );
        }
    
        $combinedResults = $newsResults->concat($videoResults); 

        $sortedResults = $combinedResults->sortByDesc(function ($item) use ($keywords) {
            $score = 0;
            foreach ($keywords as $keyword) {
                $score += substr_count(strtolower($item->title . $item->description), strtolower($keyword));
            }
            return $score;
        });
    
        $paginatedResults = new LengthAwarePaginator(
            $sortedResults->forPage(LengthAwarePaginator::resolveCurrentPage(), $perPage),
            $sortedResults->count(),
            $perPage,
            LengthAwarePaginator::resolveCurrentPage(),
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );
    
        $responseData = [
            'data' => $paginatedResults->flatten(),
            'links' => $paginatedResults->links(),
            'current_page' => $paginatedResults->currentPage(),
            'last_page' => $paginatedResults->lastPage(),
            'per_page' => $paginatedResults->perPage(),
            'total' => $paginatedResults->total(),
            'first_page_url' => $paginatedResults->url(1),
            'from' => $paginatedResults->firstItem(),
            'last_page_url' => $paginatedResults->url($paginatedResults->lastPage()),
            'next_page_url' => $paginatedResults->nextPageUrl(),
            'path' => $paginatedResults->url(1),
            'prev_page_url' => $paginatedResults->previousPageUrl(),
            'to' => $paginatedResults->lastItem(),
        ];

        if ($sortedResults->count()) {
            $this->saveSearch($request);
        }
    
        return response()->json($responseData);
    }
}
