<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use App\Services\EurogamerRssService;

class RssServiceTestController extends Controller
{
    /**
     * @var EurogamerRssService
     */
    protected $eurogamerRssService;

    /**
     * @param EurogamerRssService $eurogamerRssService
     */
    public function __construct(EurogamerRssService $eurogamerRssService)
    {
        $this->eurogamerRssService = $eurogamerRssService;
    }

    /**
     * @return void
     */
    public function test() {
        debugger_utility($this->eurogamerRssService->parseFeedItems(), 'News Feed');
        debugger_utility($this->eurogamerRssService->parseFeedItems('https://www.eurogamer.net/feed/videos'), 'Video Feed');
    }
}
