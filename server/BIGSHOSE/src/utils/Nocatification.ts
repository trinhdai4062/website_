import { Response,Request } from "express";


export function status(res:Response,status:boolean,data: any):void{
    if(status){
        res.status(200).json({status:status,data:data})
    }else{
        res.status(401).json({status:status,message:data})
    }
   
}