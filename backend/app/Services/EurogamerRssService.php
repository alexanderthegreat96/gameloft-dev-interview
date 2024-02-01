<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
class EurogamerRssService
{
    /**
     * @param string $html
     * @return string|null
     */
    protected static function extractThumbnail(string $html = "") : ?string {
        if (preg_match('/<img[^>]+src="([^">]+)"/', $html, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * @param string $url
     * @return array
     */

    public function parseFeedItems(string $url = "https://www.eurogamer.net/feed/news") : array
    {
        $response = Http::get($url);

        $feedXml = $response->body();
        $feed = simplexml_load_string($feedXml);
        $feedItems = [];

        foreach ( $feed->channel->item as $item ) {

            $guid = (string) $item->guid ?? (string) $item->link;
            $title = (string) $item->title;
            $description = (string) $item->description;
            $link = (string) $item->link;
            $publishDate = Carbon::parse($item->pubDate)->toDateTimeString();

            $media_group = $item->children( 'media', true );
            $thumbnail = null;

            if (isset($media_group->content[0]) && isset($media_group->content[0]->attributes()['url'])) {
                $thumbnail = (string) $media_group->content[0]->attributes()['url'];
            }

            if (!$thumbnail) {
                $thumbnail = self::extractThumbnail($description);
            }

            $feedItems[] = [
                'guid' => $guid,
                'title' => $title,
                'description' => $description,
                'thumbnail' => $thumbnail,
                'link' => $link,
                'publish_date' => $publishDate,
            ];
        }

        return $feedItems;
    }
}
