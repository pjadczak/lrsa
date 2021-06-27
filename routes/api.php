<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\BaseController;
use \App\Http\Controllers\api\AuthController;
use \App\Http\Controllers\api\LogsController;
use \App\Http\Controllers\api\RootController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use \App\Http\Controllers\api\FormsController;
use \App\Http\Controllers\api\UsersController;
use \App\Http\Controllers\api\ProfileController;
use \App\Http\Controllers\api\ArticlesController;
use \App\Http\Controllers\api\TemplateController;
use App\Http\Controllers\api\WarehouseController;

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class,'login']);
    Route::post('forgetPassword', [AuthController::class,'forgetPassword']);
    Route::post('changePassword', [AuthController::class,'changePassword']);
    Route::post('setLoginFromIdle', [AuthController::class,'setLoginFromIdle']);

    Route::group([
      'middleware' => ['auth:api', 'cors']
    ], function() {

        Route::post('logout', [AuthController::class,'logout']);

        Route::post('getBaseData', [BaseController::class,'getBaseData']);

        // get roles
        Route::post('getRoles', [ProfileController::class,'getRoles']);

        // upload image profile
        Route::post('uploadPhotoProfile', [ProfileController::class,'uploadPhotoProfile']);

        // remove photo profile
        Route::post('removePhotoProfile', [ProfileController::class,'removePhotoProfile']);
        
        // remove photo profile
        Route::post('saveDataProfile', [ProfileController::class,'saveDataProfile']);

        // get list of all users
        Route::post('getUsers', [UsersController::class,'getUsers']);

        // get base info about user
        Route::post('getUser/{id}', [UsersController::class,'getUser']);

        // Upload user Avatar
        Route::post('uploadPhotoUser/{id}', [UsersController::class,'uploadPhotoUser']);

        // remove userAvarat
        Route::post('removePhotoUser/{id}', [UsersController::class,'removePhotoUser']);

        // save base user settings
        Route::post('saveUserSettings/{id}', [UsersController::class,'saveUserSettings']);

        // save base user settings
        Route::post('getTemplatesList', [TemplateController::class,'getTemplatesList']);

        // Remove template
        Route::post('removeTemplate/{id}', [TemplateController::class,'removeTemplate']);

        Route::post('getTemplate/{id}', [TemplateController::class,'getTemplate']);

        // Save template settings
        Route::post('saveTemplate/{id}', [TemplateController::class,'saveTemplate']);

        // Change template main photo
        Route::post('changeTemplatePhoto/{id}', [TemplateController::class,'changeTemplatePhoto']);

        // Remove template main photo
        Route::post('removeTemplatePhoto/{id}', [TemplateController::class,'removeTemplatePhoto']);

        // Send test e-mail template
        Route::post('testSendEmailTempate', [TemplateController::class,'testSendEmailTempate']);

        // Send test e-mail template
        Route::post('getArticleModeratorList', [ArticlesController::class,'getList']);

        // Get data about single article
        Route::post('getArticleData/{id}', [ArticlesController::class,'getArticleData']);

        // Add content article photo 
        Route::post('uploadContentPhotoArticle/{idContent}', [ArticlesController::class,'uploadContentPhotoArticle']);

        // Save article data 
        Route::post('saveArticle/{id}', [ArticlesController::class,'saveArticle']);

        // Save unsaved article 
        Route::post('saveArticleAdd', [ArticlesController::class,'saveArticleAdd']);

        // Save article data 
        Route::post('removePhotoArticle/{photoName}/{idArticle?}', [ArticlesController::class,'removePhotoArticle']);

        // Save article data 
        Route::post('getFormsList', [FormsController::class,'getList']);

        // Make read form request data
        Route::post('makeFormRead/{id}', [FormsController::class,'makeRead']);

        // Get log list
        Route::post('getLogsList', [LogsController::class,'getList']);

        // Get log list
        Route::post('idleLogout', [AuthController::class,'idleLogout']);

        // Save main settings data
        Route::post('saveSettings', [RootController::class,'saveSettings']);

        // Read main settings data
        Route::post('readSettings', [RootController::class,'readSettings']);

        // Get items from warehouse
        Route::post('getListWarehouse', [WarehouseController::class,'getList']);

        // Get items from warehouse
        Route::post('saveCategoryWarehouse/{id}', [WarehouseController::class,'saveCategory']);

        // Save warehouse data
        Route::post('saveWarehouse/{id}', [WarehouseController::class,'saveWarehouse']);

        // Get items from warehouse
        Route::post('removeCategoryWarehouse/{id}', [WarehouseController::class,'removeCategory']);

        // Remove warehouse main
        Route::post('removeWarehouse/{id}', [WarehouseController::class,'removeWarehouse']);

        // Get sigle item or create and get warehouses data
        Route::post('getWarehouseItem/{id}', [WarehouseController::class,'getItem']);

        // Save Warehouse Item
        Route::post('saveWarehouseItem/{id}', [WarehouseController::class,'saveWarehouseItem']);

        // Save Warehouse Item
        Route::post('addItemAction/{id}', [WarehouseController::class,'addItemAction']);

        // Save Warehouse Item
        Route::post('removeWarehouseItem/{id}', [WarehouseController::class,'removeItem']);

        // Save Lefft bar
        Route::post('saveShowLeftBar', [UsersController::class,'saveShowLeftBar']);
    });
});