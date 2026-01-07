"use client"

const BASE_URL="https://api.spotify.com/v1/me/player/"

export const spotifyService={

    async play(token:string,deviceId:string,trackUri:string){

        try {
        if(!token &&!deviceId) return;
      const url=BASE_URL+`play?device_id=${deviceId}`;
        const response = await fetch (
         url,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body:JSON.stringify({
              uris:[trackUri]
            }),
          }
        );
        if(response.ok) {
          console.log("새 노래 재생 시작");
        }else {
          const errorData= await response.json();
          console.error("재생 실패 원인" ,errorData);
        }
      }catch (error) {
        console.error("네트워크 에러",error);
      }
    },

    async pause(token:string,deviceId:string){
        console.log("pause, 실행 확인");
        console.log("pause," ,token, deviceId);
        if(token || deviceId) return;
        const url=BASE_URL+`pause?device_id=${deviceId}`;
      const {response,error}= await fetch( url,
        {
            method: 'PUT',
            headers:{
               'Authorization': `Bearer ${token}`,
            }
        }
       );

       console.log(response,"정지 실행");
    },

}