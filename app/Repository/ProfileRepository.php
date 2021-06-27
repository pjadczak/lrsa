<?php

namespace App\Repository;

use \App\Models\Role;
use Illuminate\Support\Facades\Storage;
use \App\Models\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use \App\Repository\BaseRepository;

class ProfileRepository{


    public function GetRoles($user){
        if (!$user->isRoot()){
            return [ 'result' => false, 'comm'=>'Unauthorized access' ];
        }

        return [ 'roles' => Role::where('lvl','>=',4)->get() ];
    }



    public function UploadPhotoProfile($data,$user){
        if ($data->photo->path()){
            $allowedMimeTypes = ['image/jpeg','image/gif','image/png','image/bmp','image/svg+xml'];

            $contentType = $data->photo->getClientmimeType();
            if (in_array($contentType,$allowedMimeTypes)){

                if ($user->photo!=''){
                    if (is_file(public_path('uploads/photos/small/'.$user->photo))) unlink(public_path('uploads/photos/small/'.$user->photo));
                    if (is_file(public_path('uploads/photos/'.$user->photo))) unlink(public_path('uploads/photos/'.$user->photo));
                }

                $uploadedFile = $data->file('photo');
                $path = pathinfo($uploadedFile->getClientOriginalName());
                $filename = $user->id.'_'.time().(strlen($path['filename'])>30 ? substr($path['filename'],0,30) : $path['filename']).'.'.$path['extension'];
                $result = Storage::disk('local')->putFileAs(
                    'uploads/photos',
                    $uploadedFile,
                    $filename
                );
                BaseRepository::resize_image(public_path($result),200,public_path('uploads/photos/small/'));

                $user->photo = $filename;
                $user->save();

                Log::add($user,'change','profile_photo',$filename);

                return [
                    'comm'=>'I changed photo' , 
                    'userData'=>BaseRepository::getUserData($user), 
                    'photo'=>$filename,
                    'url'=>env('APP_URL').'/uploads/photos/'.$filename
                ];

            } else {
                return [ 'result' => false, 'comm' => 'Nieprawidłowy plik' ];
            }
        } else {
            return [ 'result' => false, 'comm' => 'Brak załączonego pliku' ];
        }

    }



    public function RemovePhotoProfile($data,$user){

        if (is_file(public_path('uploads/photos/small/'.$user->photo))) unlink(public_path('uploads/photos/small/'.$user->photo));
        if (is_file(public_path('uploads/photos/'.$user->photo))) unlink(public_path('uploads/photos/'.$user->photo));

        Log::add($user,'change','profile_photo',$user->photo);
        $user->photo = '';
        $user->save();

        return [
            'comm'=>'I removed photo', 
            'userData'=>BaseRepository::getUserData($user)
        ];

    }



    public function SaveDataProfile($data,$user){

        $errComm='';
        $_addErr = [];
        if (!BaseRepository::validateLogin($data->login)){
            $_addErr[]='That login is incorrect.';
            $errComm='Nieprawidłowy login';
        } else if (BaseRepository::findLogin($data->login,$user->id)){
            $_addErr[]='That login is busy.';
            $errComm='Ten login jest już zajęty';
        }

        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            $_addErr[]='That e-mail is incorrect.';
            $errComm='Nieprawidłowy adres e-mail';
        } else {
            if (BaseRepository::findEmail($data->email,$user->id)){
                $_addErr[]='That e-mail is incorrect.';
                $errComm='Ten adres e-mail jest już zajęty';
            }
        }

        $validData = [
            'name' => 'required|string|min:2|max:255',
            'surname' => 'required|string|min:2|max:255',
        ];

        if ($data->password!=''){
            $validData['password'] = [
                'required',
                'string',
                'confirmed',
                'min:8',             // must be at least 10 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ];
        }

        $validator = Validator::make($data->all(), $validData );

        if ($validator->fails() || !empty($_addErr)){
            return [ 'result' => false, 'errors'=>array_merge($validator->errors()->all(),$_addErr),'comm'=>$errComm=='' ? 'Proszę poprawnie wypełnić zaznaczone pola' : $errComm ];
        }

        $user->name = (String) $data->name;
        $user->surname = (String) $data->surname;
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
        Log::add($user,'change','profile',$user->name.' '.$user->surname);

        return [
            'comm'=>'Zmieniłem dane' , 
            'userData'=>BaseRepository::getUserData($user), 
        ];
    }
}
