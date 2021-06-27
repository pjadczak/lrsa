<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\BaseData;
use Database\Seeders\Roles;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call(Roles::class);
        $this->call(BaseData::class);

        Model::reguard();
    }
}
