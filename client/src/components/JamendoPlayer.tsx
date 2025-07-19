import React, { useEffect, useState } from 'react';

type Track = {
  id: string;
  name: string;
  artist_name: string;
  album_image: string;
  audio: string;
};

const JamendoPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetch('https://api.jamendo.com/v3.0/tracks/?client_id=9cc0e126&format=json&limit=10')
      .then(res => res.json())
      .then(data => setTracks(data.results));
  }, []);

  return (
    <div>
      {tracks.map(track => (
        <div key={track.id} style={{ marginBottom: 24 }}>
          <img src={track.album_image} alt={track.name} width={100} />
          <div>{track.name} by {track.artist_name}</div>
          <audio src={track.audio} controls />
        </div>
      ))}
    </div>
  );
};

export default JamendoPlayer; 