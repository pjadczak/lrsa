<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplateHeader extends Model
{
    use HasFactory;
    protected $fillable= ['name','description','slug','variables'];
    protected $table = 'email_template_headers';
    public $timestamps = false;
}
