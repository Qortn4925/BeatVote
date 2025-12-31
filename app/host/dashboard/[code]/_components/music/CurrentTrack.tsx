


 export  default function CurrentTrack() {

    const playNextTrack= async (device_id: string,token: string ,track_uri:string ) => {
        try{
            const response = await fetch (
                `https://api.spotify.com/v1/me/player/play?device_id={device_id}`,
                {
                    method :'PUT',
                    body: JSON.stringify({uris:[track_uri]}),
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if(response.ok) {
                console.log("재생 시작 성공");
            }
        }catch (error) {
            console.error("재생 실패!",error);
        }

    }
    
    return  <div>
        current Track
    </div>
}