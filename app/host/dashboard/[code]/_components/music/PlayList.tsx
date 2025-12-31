


export default function PlayList({playList}:{playList:Array<any>}) {
    console.log(playList,"플레이리스트");


    return <div>
  {playList.map((song) => (
    <div key={song.id} className="flex items-center p-2 border-b">
      <img src={song.album_art} alt={song.track_name} className="w-10 h-10 mr-3" />
      
      <div>
        <p className="font-bold">{song.track_name}</p>
        <p className="text-sm text-gray-500">{song.artist_name}</p>
      </div>

      <div className="ml-auto">
        <span>�윉� {song.votes_count}</span>
      </div>
    </div>
  ))}
</div>
}