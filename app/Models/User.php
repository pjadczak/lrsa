<?php

namespace App\Models;

use \App\Models\Role;
use \App\Models\UserRole;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'login',
        'surname',
        'active',
        'photo',
        'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function baseData(){
        return (object) [
            'email' => $this->email , 
            'login' => $this->login , 
            'name' => $this->name , 
            'surname' => $this->surname,
            'last_login'=>$this->last_login,
            'photo' => $this->photo,
            'show_left_bar' => $this->show_left_bar
        ];
    }

    public function logout(){
        $this->token()->revoke();
    }

    public function roleLvl(){
        $userRole = UserRole::
            where(['user_id' => $this->id ])
            ->join('roles','roles.id','=','users_roles.role_id')
            ->first();
        if (!empty($userRole)) return $userRole['lvl'];

        return 0;
    }

    public function role(){
        $userRole = UserRole::
            where(['user_id' => $this->id ])
            ->join('roles','roles.id','=','users_roles.role_id')
            ->first(['roles.*']);
        if (!empty($userRole)) return $userRole;

        return null;
    }

    /*
     * Assign role to user
     **/
    public function addRole($roleAssign = 'player'){

        $role = is_numeric($roleAssign) ? Role:: where([ 'id' => $roleAssign ])->first(['roles.id']) : Role:: where([ 'slug' => $roleAssign ])->first(['roles.id']);

        if (!empty($role)){
            if (empty(UserRole::where(['user_id' => $this->id , 'role_id' => $role->id])->first())){
                $userRole = new UserRole();
                $userRole->role_id = $role->id;
                $userRole->user_id = $this->id;
                $userRole->save();
            }
        }

    }

    public function isPlayer(){
        return !empty(Role::
            where([ 'slug' => 'player' ])
            ->join( 'users_roles' , 'users_roles.role_id' , '=' , 'roles.id' )
            ->where(['users_roles.user_id' => $this->id ])->first());
    }

    public function isAdmin(){
        return !empty(Role::
            where([ 'slug' => 'admin' ])
            ->join( 'users_roles' , 'users_roles.role_id' , '=' , 'roles.id' )
            ->where(['users_roles.user_id' => $this->id ])->first());
    }

    public function isModerator(){
        return !empty(Role::
            where([ 'slug' => 'moderator' ])
            ->join( 'users_roles' , 'users_roles.role_id' , '=' , 'roles.id' )
            ->where(['users_roles.user_id' => $this->id ])->first());
    }

    public function isRedactor(){
        return !empty(Role::
            where([ 'slug' => 'redactor' ])
            ->join( 'users_roles' , 'users_roles.role_id' , '=' , 'roles.id' )
            ->where(['users_roles.user_id' => $this->id ])->first());
    }

    public function isRoot(){
        return !empty(Role::
            where([ 'slug' => 'root' ])
            ->join( 'users_roles' , 'users_roles.role_id' , '=' , 'roles.id' )
            ->where(['users_roles.user_id' => $this->id ])->first());
    }


}
