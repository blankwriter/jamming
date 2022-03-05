
const clientId = '727420f032ef491db334c3bfa621dc72';
const redirectUri = 'http://localhost:3000/';
let accessToken;
let userId;

const Spotify = {
  getAccessToken() {

    if(accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if(accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      //clears parameter
    window.setTimeout(() => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    return accessToken;
      }
      else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

        window.location = accessUrl;
      }
    },

    async getCurrentUserId() {
      if (userId) return userId;

      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const url = "https://api.spotify.com/v1/me";
      
      try {
          const response = await fetch(url, { headers: headers });
          if (response.ok) {
                  const jsonResponse = await response.json();
                  userId = jsonResponse.id;
                  return userId;
          }
      } catch(error) {
              console.log(error);
      }
  },

    search(term) {
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: headers}
    ).then(response => {
      return response.json()
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } 
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }
      });
    });
    },

    savePlaylist(name, trackUris) {
      if (!name || !trackUris.length) {
        return;
      }
  
      const accessToken = Spotify.getAccessToken();
      const headers = {Authorization: `Bearer ${accessToken}`};
      
  
      return fetch('https://api.spotify.com/v1/me', {
        headers: headers
      }).then(response => {
        return response.json()
      }).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name}),
        }).then(response => {
          return response.json()
        }).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackUris}),
          })
        })
      })
    },

    async getUserPlaylists() {
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      const currentUser = await Spotify.getCurrentUserId();
      const url = `https://api.spotify.com/v1/users/${currentUser}/playlists?limit=50`;

      try {
          const response = await fetch(url, { headers: headers });
          if(response.ok) {
              const jsonResponse = await response.json();

              if(!jsonResponse.items) return [];

              const ownedPlaylists = jsonResponse.items.filter(item => item.owner.id === currentUser);
              return ownedPlaylists.map(playlist => ({
                  id: playlist.id,
                  name: playlist.name
              }));
          }

      } catch(error) {
          console.log(error);
      }
  },


    
}

export default Spotify;