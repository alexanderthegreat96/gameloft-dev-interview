<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoItem extends Model
{

    /**
     * @var string[]
     */
    protected $fillable = [
        "guid",
        "title",
        "description",
        "thumbnail",
        "link",
        "publish_date"
    ];
}
