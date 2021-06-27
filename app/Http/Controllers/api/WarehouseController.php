<?php

namespace App\Http\Controllers\api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use \App\Models\User;
use \App\Repository\WarehouseRepository;

class WarehouseController extends Controller
{
    private WarehouseRepository $warehouseRepository;
    private User $user;



    public function __construct(WarehouseRepository $repository)
    {

        $this->warehouseRepository = $repository;

        $this->user = Auth::guard('api')->user();
        if (empty($this->user)){
            return response(['comm'=>'Unauthorized access'], 422);
        }

        if ($this->user->roleLvl()<$this->warehouseRepository::MIN_ACCESS_LVL){
            return response(['comm'=>'Unauthorized access'], 422);
        }

    }



    /*
     * Get all List items
     **/
    public function getList(Request $request){

        return response( $this->warehouseRepository->List($request), 200 );

    }



    /*
     * Save category
     **/
    public function saveCategory(Request $request,$id){

        return response( $this->warehouseRepository->SaveCategory($id,$request), 200 );

    }



    /*
     * Save warehouse
     **/
    public function saveWarehouse(Request $request,int $id){

        $action = $this->warehouseRepository->SaveWarehouse($id,$request,$this->user);
        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response( $action , 200);

    }



    /*
     * Remove category
     **/
    public function removeCategory(int $id){

        $action = $this->warehouseRepository->RemoveCategory($id); 

        if (!($action['result']??true)){
            return response([ 'comm' => $action['comm'] ], 422);
        }

        return response([ 'comm' => 'I deleted a category' ], 200);

    }



    /*
     * Remove warehouse
     **/
    public function removeWarehouse(int $id){

        if ($this->user->roleLvl()<$this->warehouseRepository::MIN_ACCESS_WAREHOUSE_LVL){
            return response(['comm'=>'Unauthorized access'], 422);
        }
        $action = $this->warehouseRepository->RemoveWarehouse($id);

        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }

        return response([ 'comm' => 'I deleted a warehouse' ], 200);

    }



    /*
     * Get single item or create new
     * and get warehouses and all categories
     **/
    public function getItem(int $id){
        return response( $this->warehouseRepository->Item($id,$this->user), 200);
    }



    /*
     * Save item
     **/
    public function saveWarehouseItem(Request $request,int $id){
        $action = $this->warehouseRepository->SaveWarehouseItem($id,$this->user,$request);
        if (!$action['result']){
            return response(['comm'=>$action['comm']], 422);
        }

        return response([
            'comm' => $id ? 'Item changed' : 'I was add new item',
            'newId' => $action['newId']
        ], 200);
    }

    /*
     * Add action to itam
     **/
    public function addItemAction(Request $request,int $id){

        $action = $this->warehouseRepository->AddItemAction($id,$request,$this->user);
        if (!($action['result']??true)){
            return response(['comm'=>$action['comm']], 422);
        }

        return response($action, 200);

    }


    
    /*
     * Remove single item
     **/
    public function removeItem(int $id){

        $action = $this->warehouseRepository->RemoveItem($id,$this->user);
        if (!$action['result']){
            return response([ 'comm'=>$action['comm' ]], 422);
        }

        return response([ 'comm' => 'I have removed the item' ], 200);

    }
}
