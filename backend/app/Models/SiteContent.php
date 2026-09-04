<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    public const ACTIVE_KEY = 'active';

    protected $fillable = [
        'key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];
}
