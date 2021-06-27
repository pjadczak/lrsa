<?php

namespace App\Repository;

use \App\Models\Warehouse;
use \App\Models\WarehouseCategory;
use \App\Models\WarehouseItem;
use Illuminate\Support\Facades\DB;
use \App\Models\User;
use \App\Models\WarehouseItemAction;
use Illuminate\Support\Facades\Validator;

class WarehouseRepository{

    const MIN_ACCESS_LVL=3;
    const MIN_ACCESS_WAREHOUSE_LVL=4;

    const ITEMS_STATUSES = [ 
        1 => 'Move to warehouse' , 
        2 => 'Borrow' , 
        3 => 'Sell' , 
        4 => 'Handover within the warehouse' , 
        5 => 'Back to the warehouse' , 
        99 => 'Utylize'
    ];
    const ITEMS_CHANGES = [ 
        1 => 'Small changes' , 
        2 => 'Big changes' , 
        9 => 'Destroy'
    ];

    /*
     * Select warehouse actions
     **/
    private function getWarehpuseActions($itemId){
        return WarehouseItemAction::
            from('warehouse_item_actions as wia')
            ->where(['wia.warehouse_item_id'=>$itemId])
            ->leftJoin('users as u','u.id','=','wia.moderator_user_id')
            ->orderBy('wia.id','DESC')
            ->get([
                'wia.*',
                DB::raw('IFNULL(CONCAT(u.name," ",u.surname),"-") as userMod')
            ]);
    }

    public function List($data){
        $warehouses = Warehouse::all();
        $categories = WarehouseCategory::where(['active'=>1])->get();

        $parts = 15;
        $page = $data->pagCurrent>0 ? ($data->pagCurrent-1)*$parts : 1;
        $itemsCount = null;

        $items = WarehouseItem::
            from('warehouse_items as wi')
            ->leftJoin('warehouse as w','w.id','=','wi.warehouse_id')
            ->leftJoin('warehouse_item_actions as wa','wa.warehouse_item_id','=','wi.id')
            ->skip($page-1)
            ->take($parts)
            ->orderBy('wi.id','DESC')
            ->groupBy('wi.id');
        
        if ($data->search!=''){
            $items = $items
                ->where('wi.name','like','%'.$data->search.'%')
                ->orWhere('code','like','%'.$data->search.'%')
            ;
        }

        if (is_array($data->categories) && count($data->categories)){
            $items = $items->whereIn('wi.warehouse_category_id',$data->categories);
        }

        if (is_array($data->warehouses) && count($data->warehouses)){
            $items = $items->whereIn('wi.warehouse_id',$data->warehouses);
        }

        if ($page==0 || $page==1){
            $itemsCount = $items->count();
        }

        $items = $items
            ->get([
                'wi.id',
                'wi.name',
                'wi.code',
                'wi.disabled',
                'wi.warehouse_category_id',
                'wi.warehouse_id',
                DB::raw('DATE_FORMAT(wi.created_at, "%Y-%m-%d %H:%m") as dateAdd'),
                DB::raw('IFNULL(w.name,"-") as warehouseName'),
                DB::raw('COUNT(wa.id) as warehouseCount'),
                DB::raw('(SELECT wia.name from warehouse_item_actions as wia where wia.warehouse_item_id = wi.id order by wia.id DESC LIMIT 0,1) as lastActionName'),
            ]);

        return [
            'warehouses' => $warehouses,
            'categories' => $categories,
            'items'=>$items,
            'items_count' => $itemsCount,
            'parts' => $parts,
            'MIN_ACCESS_WAREHOUSE_LVL' => self::MIN_ACCESS_WAREHOUSE_LVL
        ];
    }

    public function SaveCategory($id, $data){
        $newId = 0;
        if ($id){
            $category = WarehouseCategory::where([ 'id' => $id ])->first();
            $categoryFindName = WarehouseCategory::where('id','<>', $id )->where(['name'=>$data->name])->first();
            if (!empty($categoryFindName)){
                return response(['comm'=>'Category name exist'], 422);
            }

            $category->name = $data->name;
            $category->save();

        } else {
            $category = WarehouseCategory::where(['name'=>$data->name])->first();
            if (!empty($category)){
                return response(['comm'=>'Category name exist'], 422);
            }

            $category = WarehouseCategory::create([ 'name' => $data->name, 'active' => 1 ]);
            $newId = $category->id;
        }

        return [
            'comm' => $id ? 'I changed the category' : 'I added a category',
            'category' => $category,
            'newId' => $newId
        ];
    }

    public function SaveWarehouse($id,$data,$user):Array{

        if ($user->roleLvl()<self::MIN_ACCESS_WAREHOUSE_LVL){
            return [ 'result'=>false, 'comm'=>'Unauthorized access' ];
        }

        $newId = 0;
        if ($id){
            $warehouse = Warehouse::where([ 'id' => $id ])->first();
            $warehouseFindName = Warehouse::where('id','<>', $id )->where(['name'=>$data->name])->first();
            if (!empty($warehouseFindName)){
                return [ 'result' => false, 'comm'=>'Warehouse name exist'];
            }

            $warehouse->name = $data->name;
            $warehouse->save();

        } else {
            $warehouse = Warehouse::where(['name'=>$data->name])->first();
            if (!empty($warehouse)){
                return [ 'result' => false, 'comm'=>'Warehouse name exist'];
            }

            $warehouse = Warehouse::create([ 'name' => $data->name ]);
            $newId = $warehouse->id;
        }

        return [
            'comm' => $id ? 'I changed the warehouse' : 'I added a warehouse',
            'warehouse' => $warehouse,
            'newId' => $newId
        ];
    }

    public function RemoveCategory($id){
        $category = WarehouseCategory::where([ 'id' => $id ])->first();
        if (empty($category)){
            return[ 'result'=>false, 'comm'=>'Category not found' ];
        }

        $itemsCount = WarehouseItem::where(['warehouse_category_id'=>$category->id])->count();
        if ($itemsCount>0){
            return[ 'result'=>false, 'comm'=>'This category has tied items, please change their category first.' ];
        }

        $category->delete();

        return[ 'result'=>true ];
        
    }

    /*
     * Get single item or create new
     * and get warehouses and all categories
     **/
    public function Item($id,$user){
        $warehouses = Warehouse::all();
        $categories = WarehouseCategory::where(['active'=>1])->get();
        $users = User::
            from('users as u')
            ->join('users_roles as ur','ur.user_id','u.id')
            ->join('roles as r','r.id','ur.role_id')
            ->where('r.lvl','<',$user->roleLvl())
            ->get(['u.*','r.name as roleName']);            
            ;

        $item = WarehouseItem::where(['id'=>$id])->first();
        if (empty($item) && $id){
            return response(['comm'=>'No item found' ], 422);
        }

        return [
            'item' => $item,
            'warehouses' => $warehouses,
            'categories' => $categories,
            'ITEMS_STATUSES' => self::ITEMS_STATUSES,
            'ITEMS_CHANGES' => self::ITEMS_CHANGES,
            'users' => $users,
            'warehouseActions' => $this->getWarehpuseActions($item->id??0)
        ];
    }

    public function RemoveWarehouse($id){
        $warehouse = Warehouse::where([ 'id' => $id ])->first();
        if (empty($warehouse)){
            return [ 'result'=> false, 'comm'=>'Warehouse not found' ];
        } else if ($warehouse->def){
            return [ 'result' => false, 'comm'=>'Cannot remve Warehouse base' ];
        }

        $itemsCount = WarehouseItem::where(['warehouse_id'=>$warehouse->id])->count();
        if ($itemsCount>0){
            return [ 'result' => false, 'comm'=>'This warehouse has tied items, please change their warehouse first.' ];
        }

        $warehouse->delete();
        return [ 'result' => true ];
    }

    public function SaveWarehouseItem($id,$user,$data){
        $item = WarehouseItem::where(['id'=>$id])->first();

        if (strlen($data->name)<2){
            return ['result'=>false, 'comm'=>'Wrong name of item'];
        }

        if ($id && $item->disabled){
            return ['result'=>false, 'comm'=>'This item is removed from warehouse'];
        }

        $warehouse = Warehouse::where(['id'=>$data->warehouse_id])->first();
        if (empty($warehouse)){
            return ['result'=>false, 'comm'=>'No warehouse assign'];
        }

        $category = WarehouseCategory::where(['id'=>$data->warehouse_category_id])->first();
        if (empty($category)){
            return ['result'=>false, 'comm'=>'No category assign'];
        }

        $newId = 0;
        if ($id){
            if (empty($item)){
                return ['result'=>false, 'comm'=>'No item found'];
            }

            $item->name = (String) $data->name;
            $item->code = (String) $data->code;
            $item->warehouse_category_id = (String) $data->warehouse_category_id;
            $item->on_state = (Int) $data->on_state; 
            $item->save();

        } else {

            $item = WarehouseItem::create([
                'name' => (String) $data->name,
                'code' => (String) $data->code,
                'warehouse_id' => (Int) $data->warehouse_id,
                'warehouse_category_id' => (String) $data->warehouse_category_id,
                'on_state' => (Int) $data->on_state,
                'user_id' => $user->id
            ]);
            $newId = $item->id;

            WarehouseItemAction::create([
                'name' => 'Insert item into Warehouse',
                'warehouse_item_id' => $item->id,
                'warehouse_id' => (Int) $data->warehouse_id,
                'comment' => 'Place item into '.$warehouse->name,
                'status' => 1,
                'moderator_user_id' => $user->id
            ]);

        }

        return [
            'newId' => $newId,
            'item' => $item,
            'result' => true
        ];
    }

    public function AddItemAction($id,$data,$user){

        $item = WarehouseItem::where(['id'=>$id])->first();
        if (empty($item)){
            return [ 'result'=> false, 'comm'=>'No item found' ];
        }

        if ($item->disabled){
            return [ 'result'=> false, 'comm'=>'This item is removed from warehouse' ];
        }

        $validator = Validator::make($data->all(), [
            'name' => 'required|string|min:3',
            // 'user_name' => 'required|string|min:3',
        ]);
        if ($validator->fails()){
            return [ 'result'=> false, 'errors'=>$validator->errors()->all(), 'comm'=>'Incorrect data' ];
        }

        $changeWarehouse = 0;
        if ($data->status == 1){
            $warehouse = Warehouse::where(['id'=>$data->warehouse_id])->first();
            if (empty($warehouse)){
                return [ 'result'=> false, 'errors'=>['The warehouse destination'], 'comm'=>'Select target warehouse' ];
            }

            $item->warehouse_id = $warehouse->id;
            $item->on_state = 1;
            $item->save();
            $changeWarehouse = 1;
        } else if ($data->status == 4 || $data->status == 5){
            $item->on_state = 1;
            $item->save();
        } else if ($data->status>0){
            $item->on_state = 0;
            if ($data->status == 3 || $data->status == 99){
                $item->disabled = 1;
            }
            $item->save();
        }

        $warehouseItemAction = WarehouseItemAction::create([
            'warehouse_item_id' => $item->id,
            'warehouse_id' => $data->warehouse_id,
            'user_id' => $data->user_id,
            'user_name' => (String) $data->user_name,
            'name' => $data->name,
            'comment' => (String) $data->comment,
            'date_suggested' => $data->date,
            'status' => $data->status,
            'state' => $data->change,
            'moderator_user_id' => $user->id
        ]);

        return [
            'comm' => 'I was add new action',
            'action' => $warehouseItemAction,
            'changeWarehouse' => $changeWarehouse,
            'item' => $item,
            'warehouseActions' => $this->getWarehpuseActions($item->id)
        ];

    }

    public function RemoveItem($id,$user){

        $item = WarehouseItem::where(['id'=>$id])->first();
        if (empty($item)){
            return [ 'result' => false, 'comm'=>'No item found' ];
        }

        $actions = WarehouseItemAction::where(['warehouse_item_id'=>$item->id])->first();
        if (!empty($actions) && $user->roleLvl()<self::MIN_ACCESS_WAREHOUSE_LVL){
            return [ 'result' => false, 'comm'=>'This item can remove only Admin user' ];
        }

        $item->delete();

        return [ 'result' => true ];
    }

}