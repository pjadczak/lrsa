<?php

namespace App\Repository;

use \Akaunting\Setting\Facade as  Settings;
use Illuminate\Support\Facades\Auth;
use \App\Models\Form;
use \App\Models\User;
use \App\Models\Log;

class BaseRepository{

    const DEFAULT_ROLE_ID = 1;
    const IMAGE_WIDTH_MAX = 1080;
    const IMAGE_WIDTH_THUMBNAIL = 320;
    const IMAGE_SESSION_PREFIX = 'sess__';
    const LAST_LOGS_QUANTITY = 10;

    public function getBaseData(){

        $user = Auth::guard('api')->user();
        if (empty($user)){
            return [ 'result' => false, 'comm'=>'Unauthorized access' ];
        }

        return [
            'comm' => 'Pobrałem dane', 
            'userData' => self::getUserData($user), 
            'forms' => Form::where('dataRead','=',null)->get(), 
            'lastLogs' => Log::orderBy('id','DESC')->skip(0)->take(self::LAST_LOGS_QUANTITY)->get(),
            'settings' => Settings::all()
        ];
        
    }

    static public function getUserData($user,$createToken=false){

		$userRole = $user->role();

		$userData = $user->baseData();
		$userData->role = $userRole;
		$userData->lvl = 0;
		$login = $userData->login;

		if (!empty($userRole)){
			$userData->role = $userRole->slug;
			$userData->lvl = $userRole->lvl;
		} else {
			$userData->role = '';
			$userData->lvl = 0;
		}

		$userData->login = $login;
		return $userData;

	}

	static public function generateRandomString($length = 15 , $bigLetters = true) {

		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		if ($bigLetters){
			$characters.='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;

    }

	static public function removeChars($text){

		$text = preg_replace('~[^\pL\d]+~u', '-', $text);
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
		$text = preg_replace('~[^-\w]+~', '', $text);
		$text = trim($text, '-');
		$text = preg_replace('~-+~', '-', $text);
		$text = strtolower($text);
	  
		if (empty($text)) {
		  return 'n-a';
		}
	  
		return $text;

	}

	/*
	 * Create slug
	 */
	static public function createSlug($name){

		if (!is_array($name)) return self::removeChars($name);
		return self::removeChars(implode(" ",$name));

	}

	static public function resize_image($file_graphic,$width,$dir_){

    	$size=getimagesize($file_graphic);
    	$_x=$size[0];
    	$_y=$size[1];

    	if ($_x<=$width) $width=$_x;
    	
    	$__a=$size[0]*100/$width;
    	$height=$size[1]*100/$__a;
    
    	$image_dst = imagecreatetruecolor ($width, $height);
    	
    	$mime=strtolower(pathinfo($file_graphic,PATHINFO_EXTENSION));

    	if ($mime=='jpeg' || $mime=='jpg') {
    		if ($image_src = @imagecreatefromjpeg ($file_graphic)){
	    		imagecopyresampled ($image_dst, $image_src, 0, 0, 0, 0, $width, $height, $_x, $_y);
	    		imagejpeg($image_dst,$dir_.basename($file_graphic),95);
    		}
    	} else if ($mime=='png') {
    		$image_src = imagecreatefrompng ($file_graphic);
    		imagealphablending($image_dst, false);
    		imagesavealpha($image_dst,true);
    		$transparent = imagecolorallocatealpha($image_src, 255, 255, 255, 127);
    		imagefilledrectangle($image_dst, 0, 0, $width, $height, $transparent);
    		imagecopyresampled ($image_dst, $image_src, 0, 0, 0, 0, $width, $height, $_x, $_y);
    		imagepng($image_dst,$dir_.basename($file_graphic),9);
    	}

	}

	static public function validateLogin($str){

        if (!preg_match("#^[a-z0-9_-]{3,30}$#s", $str)){
            return false;
        }
        if (!preg_match("/[a-z]/", substr($str,0,1))){
            return false;
        }
        return true;

    }

	static public function findLogin($str,$idExl){

        $user = User::where('login','like',$str)->where('id','<>',$idExl)->first();
        if (!empty($user)) return true;
        return false;

    }

    static public function findEmail($str,$idExl){

        $user = User::where('email','like',$str)->where('id','<>',$idExl)->first();
        if (!empty($user)) return true;
        return false;

    }

	/*
	 * Change string to other variant
	 **/
	static public function str_rpl_variant($_text,$_replace=true){

		$_reg_FemaleTagOpen = '\[\*';
		$_reg_FemaleTagClose = '\*\]';

		$_pattern = '/([a-zząćęłńóśźż]+)[ ]*('.$_reg_FemaleTagOpen.'([a-ząćęłńóśźż]+)'.$_reg_FemaleTagClose.')/i';
		return preg_replace($_pattern, $_replace ? '\1' : '\3', $_text);

	}

}