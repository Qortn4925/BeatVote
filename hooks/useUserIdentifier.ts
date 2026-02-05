import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react"



export const useUserIdentifier =()=>{
    const [userId,setUserId]=useState<string | null> (null);
    const [isAnonymous, setIsAnonymous] = useState(true);

    useEffect(()=>{
        const initUser = async ()=> {
            const {data:{user}} = await supabase.auth.getUser();

            if(user) {
                setUserId(user.id);
                setIsAnonymous(false);
            }else{
                let tempId= localStorage.getItem('guest_id');
                if(!tempId){
                    tempId= crypto.randomUUID();
                    localStorage.setItem('guest_id',tempId);
                }
            setUserId(tempId);
            setIsAnonymous(true);
            }
        };

        initUser();
    },[])
    return {userId,isAnonymous};   
}