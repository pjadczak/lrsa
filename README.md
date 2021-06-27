<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a> <a href="https://reactjs.org/" target="_blank"><img src="https://h15.pl/react.png" style="width: 110px; top: -23px; position: relative;" /></a></p>


## Laravel-React Startup Application

### Requirements

- php ver. 7.4+
- mysql or mariaDB
- nodeJS
- npm or yarn manager packages

### Steps to install (terminal mode):

- create folder [project-name]
- cd [project-name]
- git clone https://github.com/pjadczak/lrsa.git .
- composer update
- { prepare .env file }
- artisan migrate
- artisan key:generate
- artisan passport:install
- artisan db:seed { look for generated root password }
- { install cron }

### Cron install

* * * * * php [path_project]/artisan schedule:run  > /dev/null 2>&1

### Settings

panel: http://your_url/panel
Admin accounts:
login and password: __admin__
Root user
login: __root__
password: {generated at seed command}

### Prepare to Application React work:

- npm install
- npm run watch
- *Before deploy: **npm run prod***

### Change root password (terminal mode)

- `php tinker`
- `$user = User::where(['login'=>'root'])->first();`
- `$user->password = Hash::make('YOUR_PASSWORD');`
- `$user->save()`
- { CTR+C or type "exit" }

### Attention

- Check .env mail settings before use Templates