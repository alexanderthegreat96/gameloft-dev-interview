<?php

namespace App\Traits;

use App\Models\Search;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

trait LogSearch {
    public function searchSession(Request $request) {
        return hash('sha256', $request->ip());
    }

    public function saveSearch(Request $request) : void {
        
        $keywords = $request->get('query');

        Search::firstOrCreate([
            'session_key' => $this->searchSession($request),
            'keywords' => $keywords
        ]);
    }
}