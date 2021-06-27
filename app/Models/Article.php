<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'slug_title',
        'photo',
        'content',
        'contentHtml',
        'active',
        'special',
        'read_counter',
        'last_read'
    ];
}
