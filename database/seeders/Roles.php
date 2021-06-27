<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use \App\Models\Role;

class Roles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!Role::count()){
            $role = new Role();
            $role->name = 'User';
            $role->slug = 'user';
            $role->lvl = 1;
            $role->def = 1;
            $role->save();

            $role = new Role();
            $role->name = 'Redactor';
            $role->slug = 'redactor';
            $role->lvl = 2;
            $role->def = 0;
            $role->save();

            $role = new Role();
            $role->name = 'Moderator';
            $role->slug = 'moderator';
            $role->lvl = 3;
            $role->def = 0;
            $role->save();

            $role = new Role();
            $role->name = 'Admin';
            $role->slug = 'admin';
            $role->lvl = 4;
            $role->def = 0;
            $role->save();

            $role = new Role();
            $role->name = 'Root';
            $role->slug = 'root';
            $role->lvl = 5;
            $role->def = 0;
            $role->save();
        }
        
    }
}
