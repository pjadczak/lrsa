<?php

namespace App\Repository;

use \App\Models\Article;
use \App\Models\CategoryArticle;
use \App\Models\ArticleCategory;
use \App\Models\ArticleAdd;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use \App\Models\Log;
use \App\Repository\BaseRepository;
use Illuminate\Support\Facades\Storage;

class ArticleRepository{

    const LIST_PARTS = 15;

    public function GetList($data,$user){

        $userLvl = $user->roleLvl();
        if ($userLvl<2){
            return [ 'result'=>false, 'comm'=>'Unauthorized access' ];
        }

        $page = $data->pagCurrent>0 ? ($data->pagCurrent-1)*self::LIST_PARTS : 1;
        $articlesCount = null;

        $articles = Article::
            from('articles as a')
            ->leftJoin('users as u','u.id','=','a.user_id')
            ->whereRaw($userLvl<3 ? 'user_id='.$user->id : "1=1"); // Redactor see ony own articles;
        
        if ($data->search!=''){
            $articles = $articles
                ->where('a.title','like','%'.$data->search.'%');
            ;
        }

        if (is_array($data->categories) && count($data->categories)){
            $articles = $articles
            ->join('article_categories as ac',function($join) use($data){
                $join->on('ac.article_id','=','a.id')
                     ->whereIn('ac.category_article_id',$data->categories);
            });
        }

        if ($page==0 || $page==1){
            $articlesCount = $articles->count();
        }

        $articles = $articles
            ->orderBy('a.id','DESC')
            ->groupBy('a.id')
            ->skip($page-1)
            ->take(self::LIST_PARTS)
            ->leftJoin(DB::raw('
                (SELECT
                    ca.id,
                    ac.article_id,
                    ca.name
                FROM
                    article_categories ac,
                    category_articles ca
                WHERE
                    ac.category_article_id=ca.id) as art
            '),'art.article_id','=','a.id')
            ->get([
                DB::raw('IFNULL(CONCAT(u.name," ",u.surname),"-") as author'),
                DB::raw("GROUP_CONCAT(DISTINCT art.name separator ', ') as listCategories"),
                'a.id',
                'a.title',
                'a.read_counter',
                'a.content',
                'a.slug_title',
                'a.photo',
                DB::raw('DATE_FORMAT(a.created_at,"%Y-%m-%d %H:%i") as date'),
                'a.active'
            ]);

        return [
            'articles'=>$articles,
            'articles_count' => $articlesCount,
            'parts' => self::LIST_PARTS,
            'categories' => CategoryArticle::all(),
            'c' => $articles->count()
        ];

    }


    public function GetArticleData($id,$user){

        $userLvl = $user->roleLvl();

        $article = Article::where(['id'=>$id])->first();
        if ($id && empty($article)){
            return [ 'result' => false, 'comm' => 'I did not find the article' ];
        }

        if ($id && $userLvl<3 && $article->user_id!==$user->id){
            return [ 'result' => false, 'comm'=>'Unauthorized access' ];
        }

        if (!$id) $articleCategories = null;
        else $articleCategories = ArticleCategory::where([ 'article_id'=>$article->id ])->get();

        if (!$id){
            $article = ArticleAdd::where([ 'user_id'=>$user->id ])->first();
        }

        return [
            'article'=>$article,
            'articleCategories' => $articleCategories,
            'categories' => CategoryArticle::all(),
        ];

    }



    /*
     * Save article data
     **/
    public function SaveArticle($id,$data,$user){
        $userLvl = $user->roleLvl();

        $validData = [
            'title' => 'required|string|min:2|max:255',
        ];

        $_addErr = [];
        $errComm = '';
        $validator = Validator::make($data->all(), $validData );

        if (!is_array($data->articleCategories) || (is_array($data->articleCategories) && empty($data->articleCategories))){
            $_addErr[]='No category';
            $errComm='Please choose category';
        }

        if ($id){
            if (strlen($data->slug)<3){
                $_addErr[]='Wrong slug title';
                $errComm='Please correct slug title';
            } else {
                $articleSlug = Article::where(['slug_title'=>$data->slug])->where('id','<>',$id)->first();
                if (!empty($articleSlug)){
                    $_addErr[]='Already exist slug title';
                    $errComm='Please correct slug title';
                }
            }
        }

        if ($validator->fails() || !empty($_addErr)){
            return [ 'result' => false, 'errors' => array_merge($validator->errors()->all(),$_addErr), 'comm' => $errComm=='' ? 'Proszę correct selected fields' : $errComm ];
        }

        /*
         * Search new added categories
         **/
        $tempCategories = $data->articleCategories;
        if (is_array($data->addedNewCategories) && !empty($data->addedNewCategories)){
            foreach($data->addedNewCategories as $k => $newCategory){
                $articleCategory = CategoryArticle::where(['name'=>$newCategory['label']])->first();
                if (!empty($articleCategory)){
                    foreach($tempCategories as $k => $categoryId){
                        if ($categoryId == $newCategory['value']){
                            $tempCategories[$k] = $articleCategory->id;
                        }
                    }
                } else {
                    $articleCategory = CategoryArticle::create(['name'=>$newCategory['label']]);
                    foreach($tempCategories as $k => $categoryId){
                        if ($categoryId == $newCategory['value']){
                            $tempCategories[$k] = $articleCategory->id;
                        }
                    }
                }
            }
        }

        $article = Article::where(['id'=>$id])->first();
        if ($id && empty($article)){
            return [ 'result' => false, 'comm' => 'Can\'t find article' ];
        }
        
        if ($id && $userLvl<3 && $article->user_id!==$user->id){
            return [ 'result' => false, 'comm' => 'Unauthorized access' ];
        }

        if ($id){
            $this->clearPhotos($article->content,$data->content);
        }

        // Update photo's name from temporary to target
        $contentJson = $this->updatePhotos($data->content,$user->id.'_art_');

        // Create html from json data
        $contentHtml = $this->contentJsonToHtml($contentJson);

        $photoMain = $this->updatePhotoMain($data->photo,$user);

        $newId = 0;
        $categories = [];

        /*
         * Save Data
         **/
        if ($id){
            $article->title = $data->title;
            $article->content = json_encode($contentJson);
            $article->contentHtml = (String) $contentHtml;
            $article->active = (Int) $data->active;
            $article->special = (Int) $data->special;
            $article->slug_title = $data->slug;
            $article->photo = (String) $photoMain;
            $article->save();
            Log::add($user,'update','article',$article->id.'|'.$article->title);
        } else {
            $article = Article::create([
                'title' => $data->title,
                'content' => json_encode($contentJson),
                'contentHtml' => (String) $contentHtml,
                'active' => (Int) $data->active,
                'special' => (Int) $data->special,
                'photo' => (String) $photoMain,
                'user_id' => $user->id
            ]);
            $newId = $article->id;
            Log::add($user,'insert','article',$article->id.'|'.$article->title);

            $article->slug_title =  BaseRepository::createSlug($article->title.'-'.$article->id);
            $article->save();

            $articleAdd = ArticleAdd::where(['user_id'=>$user->id])->first();
            if (!empty($articleAdd)){
                $articleAdd->title = '';
                $articleAdd->categories = '';
                $articleAdd->photo = '';
                $articleAdd->slug_title = '';
                $articleAdd->content = '[]';
                $articleAdd->active = 1;
                $articleAdd->special = 0;
                $articleAdd->save();
            }
        }
        
        // Assign categries
        $categoriesMain = CategoryArticle::all();
        foreach($categoriesMain as $categoryMain){
            $foundMain = false;
            $categories = ArticleCategory::where(['article_id'=>$article->id])->get();
            foreach($tempCategories as $category){
                if ($category==$categoryMain->id){
                    $foundMain = true;
                    $found = false;
                    foreach($categories as $cat){
                        if ($cat->category_article_id == $category){
                            $found=true;
                            break;
                        }
                    }
                    if (!$found){
                        ArticleCategory::create(['article_id'=>$article->id,'category_article_id'=>$categoryMain->id]);
                    }
                }
            }
            if (!$foundMain){
                ArticleCategory::where(['article_id'=>$article->id,'category_article_id'=>$categoryMain->id])->delete();
            }
        }

        return [
            'comm' => 'I changed article' , 
            'contentJson' => $contentJson,
            'tempCategories' => $tempCategories,
            'photo' => $photoMain,
            'newId' => $newId,
            'slug_title' => $article->slug_title
        ];

    }



    public function UploadContentPhotoArticle($data,$user){
        if ($data->photo->path()){
            $allowedMimeTypes = ['image/jpeg','image/gif','image/png','image/bmp','image/svg+xml'];

            $contentType = $data->photo->getClientmimeType();
            if (in_array($contentType,$allowedMimeTypes)){

                $uploadedFile = $data->file('photo');
                $path = pathinfo($uploadedFile->getClientOriginalName());
                $filename = BaseRepository::IMAGE_SESSION_PREFIX.'_'.time().'_'.str_replace(" ","_",(strlen($path['filename'])>30 ? substr($path['filename'],0,30) : $path['filename'])).'.'.$path['extension'];
                $result = Storage::disk('local')->putFileAs(
                    'uploads/photos',
                    $uploadedFile,
                    $filename
                );

                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_MAX,public_path('uploads/photos/'));
                BaseRepository::resize_image(public_path($result),BaseRepository::IMAGE_WIDTH_THUMBNAIL,public_path('uploads/photos/small/'));
                Log::add($user,'insert','photo',$filename);

                return [
                    'comm'=>'I added a photo' , 
                    'photo'=>$filename,
                    'url'=>env('APP_URL').'/uploads/photos/'.$filename
                ];

            } else {
                return [ 'result' => false, 'comm'=>'Invalid file: '.$contentType ];
            }
        } else {
            return [ 'result' => false, 'comm' => 'No file attached' ];
        }
    }



    public function RemovePhotoArticle($photoName,$idArticle,$user){

        if (is_file(public_path("/uploads/photos/").$photoName)){
            unlink(public_path("/uploads/photos/").$photoName);
        }
        if (is_file(public_path("/uploads/photos/small/").$photoName)){
            unlink(public_path("/uploads/photos/small/").$photoName);
        }

        if ($idArticle>0){
            $article = Article::where(['id'=>$idArticle])->first();
            if (!empty($article)){
                $article->photo = '';
                $article->save();
            }
        }
        Log::add($user,'delete','photo',($idArticle>0 ? $idArticle.',' : '').$photoName);

        return ['comm'=>'I removed picture'];
    }



    public function SaveArticleAdd($data,$user){

        $userLvl = $user->roleLvl();
        if ($userLvl<2){
            return [ 'result' => false, 'comm' => 'Unauthorized access' ];
        }

        $categories = is_array($data->articleCategories) && !empty($data->articleCategories) ? implode(",",$data->articleCategories) : '';
        $articleAdd = ArticleAdd::where(['user_id'=>$user->id])->first();
        if (empty($articleAdd)){
            $articleAdd = ArticleAdd::create([
                'title' => (String) $data->title,
                'content' => json_encode($data->content),
                'active' => (Int) $data->active,
                'special' => (Int) $data->special,
                'photo' => (String) $data->photo,
                'slug_title' => (String) $data->slug,
                'categories' => $categories,
                'user_id' => $user->id
            ]);
        } else {
            $articleAdd->title = (String) $data->title;
            $articleAdd->content = json_encode($data->content);
            $articleAdd->active = (Int) $data->active;
            $articleAdd->special = (Int) $data->special;
            $articleAdd->photo = (String) $data->photo;
            $articleAdd->slug_title = (String) $data->slug;
            $articleAdd->categories = (String) $categories;
            $articleAdd->save();
        }

        return [ 'comm' => 'Saved add document' , 'article' => $articleAdd ];

    }



    /******************************************************************************
     * 
     * Remove unused photos
     * 
     *****************************************************************************/
    private function clearPhotos($contentOld,$contentNew){
        $foundImages = [];
        foreach(json_decode($contentOld,true) as $vMain){
            foreach($vMain['data'] as $value){
                if ($value['type'] == 'photo'){
                    $foundImages[]=$value['value'];
                } else if ($value['type'] == 'gallery'){
                    if (is_array($value['value'])){
                        foreach($value['value'] as  $photo){
                            $foundImages[]=$photo['photo'];
                        }
                    }
                }
            }
        }

        $dataNewString = (String) json_encode($contentNew);
        foreach($foundImages as $image){
            if ($image!='' && strpos($dataNewString,(String) $image) === false){
                $file = public_path("uploads/photos")."/".$image;
                if (is_file($file)) unlink($file);
                $fileSmall = public_path("uploads/photos/small")."/".$image;
                if (is_file($fileSmall)) unlink($fileSmall);
            }
        }
    }


    /******************************************************************************
     * 
     * Update photos
     * 
     *****************************************************************************/
    private function updatePhotos($dataJson,$prefixReplaced){
        $copyDataJson = [];
        foreach($dataJson as $kMain => $vMain){
            $copyDataJson[$kMain] = $vMain;
            foreach($vMain['data'] as $key => $value){
                // $copyDataJson[$kMain][$v] = $value;
                if ($value['type'] == 'photo'){
                    if (strpos($copyDataJson[$kMain]['data'][$key]['value'],BaseRepository::IMAGE_SESSION_PREFIX) !== false){
                        $this->replaceFileNamePhoto($copyDataJson[$kMain]['data'][$key]['value'],$prefixReplaced);
                        $copyDataJson[$kMain]['data'][$key]['value'] = str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefixReplaced,$copyDataJson[$kMain]['data'][$key]['value']);
                    }
                } else if ($value['type'] == 'gallery'){
                    if (is_array($value['value'])){
                        foreach($value['value'] as $keyPhoto => $photo){
                            if (strpos($copyDataJson[$kMain]['data'][$key]['value'][$keyPhoto]['photo'],BaseRepository::IMAGE_SESSION_PREFIX) !== false){
                                $this->replaceFileNamePhoto($copyDataJson[$kMain]['data'][$key]['value'][$keyPhoto]['photo'],$prefixReplaced);
                                $copyDataJson[$kMain]['data'][$key]['value'][$keyPhoto]['photo'] = str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefixReplaced,$copyDataJson[$kMain]['data'][$key]['value'][$keyPhoto]['photo']);
                            }
                        }
                    }
                }
            }
        }
        return $copyDataJson;
    }



    /******************************************************************************
     * 
     * Convert Json data to HTML
     * 
     *****************************************************************************/
    private function contentJsonToHtml($dataJson){
        $html = '';
        foreach($dataJson as $vMain){
            $html .= '<div class="contentRow">';
            foreach($vMain['data'] as $value){
                $html .= '<div class="contentCell contentType-'.$value['type'].((String) $value['header']['class']??''!='' ? ' '.(String) $value['header']['class'] : '').'">';
                if ($value['header']['value']??''!=''){
                    $html.='<'.($value['header']['type']??'h3').'>'.$value['header']['value'].'</'.($value['header']['type']??'h3').'>';
                }

                // Text cell
                if ($value['type'] == 'text'){
                    $html .= $value['value'];

                // Photo Cell
                } else if ($value['type'] == 'photo'){
                    $html .= '<img src="'.url("/uploads/photos").'/'.$value['value'].'" alt="" />';

                // Gallery cell
                } else if ($value['type'] == 'gallery'){
                    $html.='<div class="gallery">';
                    if (is_array($value['value'])){
                        foreach($value['value'] as  $photo){
                            $html .= '<div class="photo">';
                            $html .= '<a href="'.url("/uploads/photos").'/'.$photo['photo'].'"><img src="'.url("/uploads/photos").'/small/'.$photo['photo'].'" alt="'.$photo['label'].'" /></a>';
                            $html .= '</div>';
                        }
                    }
                    $html.='</div>';
                }
                $html .= '</div>';
            }
            $html .= '</div>';
        }
        return $html;
    }



    /******************************************************************************
     * 
     * Update photo MAIN
     * 
     *****************************************************************************/
    private function updatePhotoMain($photo,$user){
        if (!empty($photo) && strpos($photo,BaseRepository::IMAGE_SESSION_PREFIX)!==false){
            $prefix = $user->id.'_art_';
            if ($this->replaceFileNamePhoto($photo,$prefix)){
                return str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$prefix,$photo);
            }
        }
        return $photo;
    }



    /******************************************************************************
     * 
     * Replace file name
     * 
     *****************************************************************************/
    private function replaceFileNamePhoto($fileName,$sufix){
        $foundFile = false;
        $file = public_path("uploads/photos")."/".$fileName;
        if (is_file($file)){
            rename($file,str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$sufix,$file));
            $foundFile = true;
        }
        $fileSmall = public_path("uploads/photos")."/small/".$fileName;
        if (is_file($fileSmall)){
            rename($fileSmall,str_replace(BaseRepository::IMAGE_SESSION_PREFIX,$sufix,$fileSmall));
            $foundFile = true;
        }
        return $foundFile;
    }

}