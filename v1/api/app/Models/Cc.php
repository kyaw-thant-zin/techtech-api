<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cc extends Model
{
    use HasFactory;
    protected $fillable = ['cn', 'ed_month', 'ed_year', 'cvv', 'fn', 'ln'];
}
