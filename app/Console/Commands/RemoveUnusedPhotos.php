<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use \App\Repository\BaseRepository;

class RemoveUnusedPhotos extends Command
{
    const SECONDS_TO_DELETE_PHOTO = (60 * 60) * ( 24 * 7 );

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:removeUnusedPhotos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear uplouded unused photos after safe time';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $_dir = public_path()."/uploads/photos/";
        $dir = scandir($_dir);

        $indexDeleted = 0;
        foreach ($dir as $value){
            if ($value!=="." && $value!=".." && is_file($_dir.$value) && strpos($value,BaseRepository::IMAGE_SESSION_PREFIX)!==false){
                $arrayFileName = explode("_",substr($value,strlen(BaseRepository::IMAGE_SESSION_PREFIX)+1));
                if (isset($arrayFileName[1]) && intval($arrayFileName[0])+self::SECONDS_TO_DELETE_PHOTO<time()){
                    $_fileToDelete = $_dir.$value;
                    if (is_file($_fileToDelete)){
                        unlink($_fileToDelete);
                        $indexDeleted++;
                        $_fileToDeleteSmall = $_dir."small/".$value;
                        if ($_fileToDeleteSmall){
                            unlink($_fileToDeleteSmall);
                        }
                    }
                }
                
            }
        }

        return 0;
    }
}
