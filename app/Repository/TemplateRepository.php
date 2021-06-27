<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use \App\Repository\BaseRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;
use \App\Models\EmailTemplate;
use \App\Models\EmailTemplateHeader;
use \App\Models\Log;
use \App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class TemplateRepository{

    public function ChangeTemplatePhoto($id,$user,$data){

        if (!$user->isRoot()){
            return [ 'result' => false, 'comm' => 'No access right' ];
        }

        // zapis pliku na serwerze
        if (!empty($data->photo) && $data->photo->path()){
            $allowedMimeTypes = [
                'image/jpeg',
                'image/gif',
                'image/png',
            ];

            $template = EmailTemplate::where(['id'=>$id])->first();
            if ($id && empty($template)){
                return [ 'result' => false, 'comm' => 'I did not find a template' ];
            }

            $contentType = $data->photo->getClientmimeType();
            if (in_array($contentType,$allowedMimeTypes)){

                // usunięcie starego zdjęcie jeśli istnieje
                if ($id && !empty($template) && $template->photo!=''){
                    if (is_file(public_path('uploads/photos/small/'.$template->photo))) unlink(public_path('uploads/photos/small/'.$template->photo));
                    if (is_file(public_path('uploads/photos/'.$template->photo))) unlink(public_path('uploads/photos/'.$template->photo));
                }
                if (Session::has('template_photo')){
                    if (is_file(public_path('uploads/photos/small/'.Session::get('template_photo')))) unlink(public_path('uploads/photos/small/'.Session::get('template_photo')));
                    if (is_file(public_path('uploads/photos/'.Session::get('template_photo')))) unlink(public_path('uploads/photos/'.Session::get('template_photo')));
                    Session::forget('template_photo');
                }
                
                $uploadedFile = $data->file('photo');
                $filename = (!$id ? BaseRepository::IMAGE_SESSION_PREFIX : $user->id."_").time().$uploadedFile->getClientOriginalName();
                $result = Storage::disk('local')->putFileAs(
                    'uploads/photos',
                    $uploadedFile,
                    $filename
                );

                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_MAX,public_path('uploads/photos/'));
                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_THUMBNAIL,public_path('uploads/photos/small/'));

                Log::add($user,'insert','template_photo',$filename);

                if (!empty($template)){
                    $template->photo = $filename;
                    $template->save();
                } else {
                    Session::put('template_photo',$filename);
                }

                return [ 'comm' => 'I changed the graphics' , 'photo' => $filename ];

            } else {
                return [ 'result' => false, 'comm' => 'Invalid file format' ];
            }
        } else {
            return [ 'result' => false, 'comm'=>'No file attached' ];
        }

    }





    public function RemoveTemplatePhoto($id,User $user){

        if (!$id){
            if (Session::has('template_photo')){
                if (is_file(public_path('uploads/photos/small/'.Session::get('template_photo')))) unlink(public_path('uploads/photos/small/'.Session::get('template_photo')));
                if (is_file(public_path('uploads/photos/'.Session::get('template_photo')))) unlink(public_path('uploads/photos/'.Session::get('template_photo')));
                Session::forget('template_photo');
            }
        } else {
            $template = EmailTemplate::where([ 'id'=>$id ])->first();

            if (empty($template)){
                return [ 'result' => false, 'comm'=>'I did not find a template' ];
            }

            if (is_file(public_path('uploads/photos/small/'.$template->photo))) unlink(public_path('uploads/photos/small/'.$template->photo));
            if (is_file(public_path('uploads/photos/'.$template->photo))) unlink(public_path('uploads/photos/'.$template->photo));

            Log::add($user,'insert','template_photo',$template->photo);
            $template->photo = '';
            $template->save();
        }

        return [ 'comm' => 'I deleted the photo' ];

    }





    public function RemoveTemplate($id, $user){

        $template = EmailTemplate::where(['id' => $id])->first();
        if (empty($template)){
            return [ 'result'=>false, 'comm' => 'Nie znalazłem szablonu do usunięcia' ];
        }

        $template->delete();
        Log::add($user,'delete','template',$id);

        return [ 'comm' => 'The template has been removed' ];
    }





    public function GetTemplatesList($data){
        $templates = EmailTemplateHeader::
            from('email_template_headers as eth')
            ->join('email_templates as et','et.template_type_id','=','eth.id');
        
        if ($data->search!=''){
            $templates = $templates
                ->where('eth.name','like','%'.$data->search.'%')
                ->orWhere('et.name','like','%'.$data->search.'%')
                ->orWhere('et.content','like','%'.$data->search.'%');
        }

        $templates = $templates->get([
            DB::raw('
                IFNULL(et.name,eth.name) as name,
                IFNULL(et.id,eth.id) as id,
                eth.name as typeName
            ')
        ]);

        return $templates;
    }



    public function GetTemplate($id){
        $template = EmailTemplate::where(['id'=>$id ])->first();
        if ($id && empty($template)){
            return [ 'result' => false, 'comm'=>'I did not find a template' ];
        }

        if (!$id){
            $templateHeaders = EmailTemplateHeader::
                from('email_template_headers as eth')
                ->leftJoin("email_templates as et","et.template_type_id","=","eth.id")
                ->whereRaw('et.id IS NULL')
                ->get([DB::raw("eth.*")]);
        } else {
            $templateHeaders = EmailTemplateHeader::all();
        }

        return [
            'headers' => $templateHeaders,
            'template' => $template,
            'photo' => Session::has('template_photo') ? Session::get('template_photo') : ''
        ];
    }

    /*
     * Send template to user
     **/
    static public function SendTemplate($typeSlug,$dataTemplate,$email,$sex = null, $test = false){
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
            return false;
        }

        $emailTemplateHeader = EmailTemplateHeader::where(['slug'=>$typeSlug])->first();
        if (!$emailTemplateHeader) return false;
        $emailTemplate = null;
        $emailTemplate = EmailTemplate::where(['template_type_id'=>$emailTemplateHeader->id])->first();
        if (!$emailTemplate) return false;

        $data = explode(",",$emailTemplateHeader->variables);
        $emailBody = $emailTemplate->content;
        $subject = $emailTemplate->name;

        if ($sex!==null && $sex>=0){
            $emailBody = BaseRepository::str_rpl_variant($emailBody,(Bool) $sex);
        }

        foreach($data as  $d){
            $emailBody = str_replace('%'.$d.'%',$dataTemplate[trim($d)]??'',$emailBody);
            $subject = str_replace('%'.$d.'%',$dataTemplate[trim($d)]??'',$subject);
        }

        Mail::send('mails.template', $data = [ 'template'=>$emailBody , 'photo' => $emailTemplate->photo ], function($message) use($subject,$email){
            $message->from( env('MAIL_USERNAME'), env('APP_NAME') );
            $message->subject($subject);
            $message->to( $email );
        });

        return true;
    }




    /*
     * Save Template settings
     **/
    public function SaveTemplate($user,$data,$id){
        $validData = [
            'name' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
        ];

        $validator = Validator::make($data->all(), $validData );
        $_addErr=[];
        $errComm = '';

        $emailTemplateHeader = EmailTemplateHeader::where(['id'=>$data->typeId])->first();
        if (!$emailTemplateHeader){
            $_addErr[]='Error type of theme';
            $errComm = 'Choose the type of template';
        }

        $template = EmailTemplate::where(['id'=>$id])->first();
        if ($id && empty($template)){
            return [ 'result' => false, 'comm'=>'I did not find a template' ];
        }

        if ($validator->fails() || !empty($_addErr)){
            return [ 'result' => false, 'errors'=>array_merge($validator->errors()->all(),$_addErr),'comm'=>$errComm=='' ? 'Please fill in the marked fields correctly' : $errComm ];
        }

        $newId = 0;
        if (!$id){

            $templateType = EmailTemplate::where(['template_type_id'=>$data->typeId])->first();
            if ($templateType){
                return [ 'result' => false, 'comm'=>'You have already added this type of template' ];
            }

            $template = EmailTemplate::create([
                'name' => $data->name,
                'content' => $data->content,
                'template_type_id' => $data->typeId,
            ]);
            $newId = $template->id;

            if (Session::has('template_photo')){

                $photo = Session::has('template_photo') ? Session::get('template_photo') : '';
                if ($photo!='' && is_file(public_path('uploads/photos/'.$photo))){
                    $prefix_replaced = $user->id."_";
                    rename(public_path('uploads/photos/'.$photo),public_path('uploads/photos/'.str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$photo)));
                    rename(public_path('uploads/photos/small/'.$photo),public_path('uploads/photos/small/'.str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$photo)));
                    Session::forget('template_photo');

                    $template->photo = str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix_replaced,$photo);
                    $template->save();
                }
            }
            Log::add($user,'insert','template',$template->id.'|'.$data->name);

        } else {
            $template->name = $data->name;
            $template->content = $data->content;
            $template->save();
            Log::add($user,'update','template',$template->id.'|'.$data->name);
        }

        return [
            'comm'=>'The template has been saved',
            'template' => $template,
            'newId' => $newId
        ];

    }



    public function TestSendEmailTempate($data){

        $emailTemplate = EmailTemplate::
            from('email_templates as et')
            ->join('email_template_headers as eth','eth.id','=','et.template_type_id')
            ->where(['et.id'=>$data->id])
            ->first([DB::raw('et.*,eth.slug,eth.variables')]);

        if (!$emailTemplate){
            return [ 'comm' => 'I did not find a template' ];
        }

        $dataSend=[
            'name' => 'John',
            'surname' => 'Smith',
            'url_activate' => env('APP_URL').'example-url-activate',
            'login' => 'example-test-login',
            'password' => BaseRepository::generateRandomString(),
            'email' => 'example@example.com',
            'date_start' => date("Y-m-d"),
            'date_end' => date("Y-m-d",time()+(3600*7)),
        ];

        return self::sendTemplate($emailTemplate->slug,$dataSend,$data->email,rand(0,1),null,true);

    }

}