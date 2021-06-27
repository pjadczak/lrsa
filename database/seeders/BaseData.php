<?php

namespace Database\Seeders;
use \Akaunting\Setting\Facade as  Settings;
use Illuminate\Support\Facades\Hash;
use \App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use \App\Models\CategoryArticle;
use \App\Models\EmailTemplateHeader;
use \App\Models\EmailTemplate;
use \App\Models\Warehouse;

class BaseData extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Settings::set('idle',1); // Idle turn ON
        Settings::set('idle_time',900000); // 15 minutes
        Settings::save();

        if (!USER::count()){
            $userAdmin = User::create([
                'login' => 'admin',
                'password' => Hash::make('admin'),
                'email' => 'admin@example.com',
                'name' => 'Admin',
                'surname' => '',
                'active' => 1
            ]);
            $userAdmin->addRole('admin');

            $rootPassword = Str::random(8);
            $userRoot = User::create([
                'login' => 'root',
                'password' => Hash::make($rootPassword),
                'email' => 'root@example.com',
                'name' => 'Root',
                'surname' => '',
                'active' => 1
            ]);
            $userRoot->addRole('root');
            echo "User Root password: ".$rootPassword."\n";
        }

        if (!CategoryArticle::count()){
            CategoryArticle::create([
                'name' => 'News'
            ]);
        }

        if (!Warehouse::count()){
            Warehouse::create([
                'name' => 'Base warehouse',
                'def' => 1
            ]);
        }

        if (!EmailTemplateHeader::count()){
            $template1 = EmailTemplateHeader::create([
                'name' => 'Creating a moderator account from the panel',
                'slug' => 'create_user_panel',
                'variables' => 'name,surname,email,role,password,url_panel'
            ]);

            EmailTemplate::create([
                'name' => 'Welcome to the LRSA website',
                'content' => '<h3>Hello %name% %surname%</h3><p>A moderator account on ilza.com.pl has been set up on your e-mail <strong>%email%</strong>. <br>Your user rank is <strong>%role%</strong>. To log in to the panel, go to the page <strong>%url_panel%</strong>, enter the above e-mail address as login, the password is: <strong>% password%</strong><br></p>',
                'template_type_id' => $template1->id
            ]);

            $template2 = EmailTemplateHeader::create([
                'name' => 'Creating a user account from the panel',
                'slug' => 'create_user',
                'variables' => 'name,surname,email,password,url'
            ]);

            EmailTemplate::create([
                'name' => 'Welcome to the LRSA website',
                'content' => '<h3>Hello %name% %surname%</h3><p>A user account on <strong>Laravel-React Startup Application</strong> has been set up on your e-mail <strong>%email%</strong>.To log in to our website in the browser, enter the address <strong>%url%</strong>, as login enter your e-mail address, the password is: <strong>%password%</strong><br></p>',
                'template_type_id' => $template2->id
            ]);
        }

    }
}
