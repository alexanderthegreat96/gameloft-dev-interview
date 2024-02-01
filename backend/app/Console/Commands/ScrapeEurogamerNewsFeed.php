<?php

namespace App\Console\Commands;

use App\Models\NewsItem;
use Illuminate\Console\Command;
use App\Services\EurogamerRssService;

class ScrapeEurogamerNewsFeed extends Command
{
    /**
     * @var string
     */
    protected $url = "https://www.eurogamer.net/feed/news";

    /**
     * @var EurogamerRssService
     */
    protected $eurogamerRssService;

    /**
     * @param EurogamerRssService $eurogamerRssService
     */
    public function __construct(EurogamerRssService $eurogamerRssService)
    {
        parent::__construct();
        $this->eurogamerRssService = $eurogamerRssService;
    }

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scrape-eurogamer-news-feed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Parses the RSS News Feed and stores data into the database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $feedItems = $this->eurogamerRssService->parseFeedItems($this->url);

        if ($feedItems) {
            foreach ($feedItems as $feedItem) {
                $existingItem = NewsItem::where('guid', $feedItem['guid'])->first();

                if ($existingItem) {
                    $existingItem->update($feedItem);
                } else {
                    NewsItem::create($feedItem);
                }
            }

            $guidsInFeed = collect($feedItems)->pluck('guid')->toArray();
            if ($guidsInFeed) {
                NewsItem::whereNotIn('guid', $guidsInFeed)->delete();
            }
        }
    }
}
