<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cc extends Model
{
    use HasFactory;
    protected $fillable = ['cn', 'ed_month', 'ed_year', 'cvv', 'fn', 'ln'];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
