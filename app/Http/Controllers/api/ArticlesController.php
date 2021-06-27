<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Repository\ArticleRepository;
use \App\Models\User;

class ArticlesController extends Controller
{
    const LIST_PARTS = 15;
    private User $user;
    private ArticleRepository $articleRepository;

    public function __construct(ArticleRepository $repository){

        $this->articleRepository = $repository;

        $this->user = Auth::guard('api')->user();
        if (empty($this->user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }

    }

    public function getList(Request $request){
        
        $action = $this->articleRepository->GetList($request,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }

    public function getArticleData($id){
        
        $action = $this->articleRepository->GetArticleData($id,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }

    /*
     * Save article data
     **/
    public function saveArticle(Request $request,$id){
        
        $action = $this->articleRepository->SaveArticle($id,$request,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }

    /*
     * Upload file graphic without handler
     **/
    public function uploadContentPhotoArticle(Request $request,$idContent){

        $action = $this->articleRepository->UploadContentPhotoArticle($request,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }

    public function removePhotoArticle($photoName,$idArticle = 0){

        return response( $this->articleRepository->RemovePhotoArticle($photoName,$idArticle,$this->user), 200 );

    }

    public function saveArticleAdd(Request $request){

        $action = $this->articleRepository->SaveArticleAdd($request,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response($action, 200);

    }
}
