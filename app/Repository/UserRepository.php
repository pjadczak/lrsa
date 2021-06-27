<?php

namespace App\Repository;

use \App\Models\User;
use Illuminate\Support\Facades\DB;
use \App\Repository\BaseRepository;
use Illuminate\Support\Facades\Session;
// use jeremykenedy\LaravelRoles\Models\Role;
use \App\Models\Role;
use \App\Models\UserRole;
use \App\Http\Controllers\Functions;
use Illuminate\Support\Facades\Hash;
use \App\Models\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserRepository{

    const LIST_PARTS = 15;


    /*
     * Get Users data
     **/
    public function GetUsers($data){
        
        $page = $data->pagCurrent>0 ? ($data->pagCurrent-1)*self::LIST_PARTS : 1;
        $usersCount = null;

        $users = User::
            from('users as u')
            ->leftJoin('users_roles as ur','ur.user_id','=','u.id')
            ->leftJoin('roles as r','r.id','=','ur.role_id')
            ->skip($page-1)
            ->take(self::LIST_PARTS);
        
        if ($data->search!=''){
            $users = $users
                ->where('u.name','like','%'.$data->search.'%')
                ->orWhere('u.surname','like','%'.$data->search.'%')
                ->orWhere('u.email','like','%'.$data->search.'%');
            ;
        }

        if ($page==0 || $page==1){
            $usersCount = $users->count();
        }

        $users = $users
            ->get([
                DB::raw('CONCAT(u.name," ",u.surname) as name'),
                'u.id',
                'u.photo',
                'u.email',
                'u.login',
                'u.active',
                'r.name as roleName',
                'r.slug',
            ]);

        return [
            'users'=>$users,
            'users_count' => $usersCount,
            'parts' => self::LIST_PARTS,
        ];
        
    }


    /*
     * Get User Data
     **/
    public function GetUser($id){

        $user = User::where(['id' => $id])->first();

        return [
            'user' => empty($user) ? null : $user,
            'roles' => Role::all(),
            'roleId' => empty($user) ? BaseRepository::DEFAULT_ROLE_ID : $user->role()->id,
            'photo' => Session::has('user_avatar_photo') ? Session::get('user_avatar_photo') : ''
        ];

    }



    public function SaveUserSettings($data,$id,$userMain){

        $user = User::where(['id' => $id])->first();
        if ($id && empty($user)){
            return [ 'result' => false, 'comm'=>'User not found' ];
        }

        $errComm='';
        $_addErr = [];
        if (!BaseRepository::validateLogin($data->login)){
            $_addErr[]='That login is incorrect.';
            $errComm='Invalid login';
        } else if (BaseRepository::findLogin($data->login,$user->id??0)){
            $_addErr[]='That login is busy.';
            $errComm='This login is already taken';
        }

        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            $_addErr[]='That e-mail is incorrect.';
            $errComm='Incorrect e-mail address';
        } else {
            if (BaseRepository::findEmail($data->email,$user->id??0)){
                $_addErr[]='That e-mail is incorrect.';
                $errComm='This e-mail address is already taken';
            }
        }

        $validData = [
            'name' => 'required|string|min:2|max:255',
            'surname' => 'required|string|min:2|max:255',
        ];

        if ($data->password!='' || !$id){
            $validData['password'] = [
                'required',
                'string',
                'confirmed',
                'max:16',
                'min:8',             // must be at least 10 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ];
        }

        $validator = Validator::make($data->all(), $validData );

        if ($validator->fails() || !empty($_addErr)){
            return [ 'result' => false, 'errors'=>array_merge($validator->errors()->all(),$_addErr),'comm'=>$errComm=='' ? 'Please fill in the marked fields correctly' : $errComm ];
        }

        $newId = 0;

        if ($id){
            $user->name = (String) $data->name;
            $user->surname = (String) $data->surname;
            $user->active = $data->active;
            if ($user->email!=$data->email){
                $user->email = (String) $data->email;
            }
            if ($user->login!=$data->login){
                $user->login = (String) $data->login;
            }
            if ($data->password!=''){
                $user->password = Hash::make($data->password);
            }

            $user->save();
            Log::add($userMain,'update','user',$user->id.'|'.$user->name.' '.$user->surname);
        } else {

            $user = User::create([
                'name' => $data->name,
                'surname' => $data->surname,
                'email' => $data->email,
                'login' => $data->login,
                'password' => Hash::make($data->password),
                'active' => $data->active
            ]);
            $newId = $user->id;
            Log::add($userMain,'insert','user',$user->id.'|'.$user->name.' '.$user->surname);

            $photo = '';
            if (Session::has('user_avatar_photo')){
                $_photo_temp = Session::get('user_avatar_photo');
                if (is_file(public_path('uploads/photos/'.$_photo_temp))){
                    $prefix_replaced = $user->id."_";
                    rename(public_path('uploads/photos/'.$_photo_temp),public_path('uploads/photos/'.str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$_photo_temp)));
                    rename(public_path('uploads/photos/small/'.$_photo_temp),public_path('uploads/photos/small/'.str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$_photo_temp)));

                    $photo = str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$_photo_temp);
                }
                Session::forget('user_avatar_photo');
                $user->photo = $photo;
                $user->save();
            }

        }

        if ($id && $user->role()->id!==$data->roleId){
            UserRole::where([ 'user_id' => $user->id ])->delete();
            $user->addRole($data->roleId);
        } else if (!$id){
            $user->addRole();
        }

        if (!$id){
            // wysłanie e-maila
            if (filter_var($data->email, FILTER_VALIDATE_EMAIL)){
                $dataSendEmail = [
                    'name' => $data->name,
                    'surname' => $data->surname,
                    'role' => $user->roleLvl(),
                    'email' => $data->email,
                    'password' => $data->password,
                    'url_panel' => env('APP_URL').env('APP_PANEL_PREFIX'),
                    'url' => env('APP_URL')
                ];
                TemplateRepository::sendTemplate($user->roleLvl()>=4 ? 'create_user_panel' : 'create_user',$dataSendEmail,$user->email);
            }
        }

        return [
            'comm'=> $id ? 'I changed the data' : 'I added a new user', 
            'userData'=>BaseRepository::getUserData($user), 
            'role' => Role::where(['id'=>$data->roleId])->first(),
            'roleId' => $data->roleId,
            'newId' => $newId
        ];
    }



    public function UploadPhotoUser($data,$id,$userMain){

        $user = User::where(['id' => $id])->first();
        if ($id && empty($user)){
            return [ 'comm' => 'User not found' ];
        }

        if ($data->photo->path()){
            $allowedMimeTypes = ['image/jpeg','image/gif','image/png','image/bmp','image/svg+xml'];

            $contentType = $data->photo->getClientmimeType();
            if (in_array($contentType,$allowedMimeTypes)){

                if (!empty($user) && $user->photo!=''){
                    if (is_file(public_path('uploads/photos/small/'.$user->photo))) unlink(public_path('uploads/photos/small/'.$user->photo));
                    if (is_file(public_path('uploads/photos/'.$user->photo))) unlink(public_path('uploads/photos/'.$user->photo));
                }

                if (Session::has('user_avatar_photo')){
                    if (is_file(public_path('uploads/photos/small/'.Session::get('user_avatar_photo')))) unlink(public_path('uploads/photos/small/'.Session::get('user_avatar_photo')));
                    if (is_file(public_path('uploads/photos/'.Session::get('user_avatar_photo')))) unlink(public_path('uploads/photos/'.Session::get('user_avatar_photo')));
                    Session::forget('user_avatar_photo');
                }

                $uploadedFile = $data->file('photo');
                $path = pathinfo($uploadedFile->getClientOriginalName());
                $filename = (empty($user) ? BaseRepository::IMAGE_SESSION_PREFIX : $user->id).'_'.time().'_'.(strlen($path['filename'])>30 ? substr($path['filename'],0,30) : $path['filename']).'.'.$path['extension'];
                $result = Storage::disk('local')->putFileAs(
                    'uploads/photos',
                    $uploadedFile,
                    $filename
                );

                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_MAX,public_path('uploads/photos/'));
                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_THUMBNAIL,public_path('uploads/photos/small/'));

                if (!empty($user)){
                    $user->photo = $filename;
                    $user->save();
                } else {
                    Session::put('user_avatar_photo',$filename);
                }
                Log::add($userMain,'insert','user_photo',$user->id.'|'.$filename);

                return [
                    'comm' => 'I changed the photo' , 
                    'photo' => $filename,
                    'url' => env('APP_URL').'/uploads/photos/'.$filename
                ];

            } else {
                return [ 'result' => false, 'comm'=>'Invalid file: '.$contentType ];
            }
        } else {
            return [ 'result' => false, 'comm'=>'No file attached' ];
        }

    }



    public function RemovePhotoUser($id,$userMain){

        $user = User::where(['id' => $id])->first();
        if ($id && empty($user)){
            return [ 'result' => false, 'comm' => 'User not found' ];
        }

        if ($id && $user->photo!=''){
            if (is_file(public_path('uploads/photos/small/'.$user->photo))) unlink(public_path('uploads/photos/small/'.$user->photo));
            if (is_file(public_path('uploads/photos/'.$user->photo))) unlink(public_path('uploads/photos/'.$user->photo));

            Log::add($userMain,'delete','user_photo',$user->id.'|'.$user->photo);
            $user->photo = '';
            $user->save();
        }

        if (Session::has('user_avatar_photo')){
            if (is_file(public_path('uploads/photos/small/'.Session::get('user_avatar_photo')))) unlink(public_path('uploads/photos/small/'.Session::get('user_avatar_photo')));
            if (is_file(public_path('uploads/photos/'.Session::get('user_avatar_photo')))) unlink(public_path('uploads/photos/'.Session::get('user_avatar_photo')));
            Session::forget('user_avatar_photo');
        }

        return [ 'comm' => 'I deleted the photo' ];
    }



    public function SaveShowLeftBar($data,$userMain){
        $userMain->show_left_bar = (Int) $data->show_left_bar;
        $userMain->save();
        return true;
    }

}