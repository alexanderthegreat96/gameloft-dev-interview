<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Search extends Model
{
    use HasFactory;
    protected $table = "searches";

    protected $fillable = [
        'session_key',
        'keywords'
    ];
}
