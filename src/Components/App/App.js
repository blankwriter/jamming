
import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName:'New Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this)
  }
 


  addTrack(track) {
     let playTracks = this.state.playlistTracks;
     if(playTracks.find(playTrack => playTrack.id === track.id)) {
       return;
     }
     playTracks.push(track)
     this.setState({playlistTracks: playTracks})
  }

  removeTrack(track) {
     let deleteTracks = this.state.playlistTracks;
     deleteTracks = deleteTracks.filter(deleteTrack => deleteTrack.id !== track.id) 
     this.setState({playlistTracks: deleteTracks})
 
  }

  updatePlaylistName(name) {
     this.setState({playlistName: name})
  }
  
  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris)
      this.setState ({
        playlistName: 'New Playlist',
        playlistTracks: []      
      })
  
  
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then(playlists => this.setState({ playlists: playlists }));   
  }
  
  componentDidMount() {
    this.getUserPlaylists();   
  }
  render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
         <SearchBar 
         onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults 
          searchResults={this.state.searchResults}
          onAdd={this.addTrack} />
          <Playlist
           playlistTracks={this.state.playlistTracks}
           playlistName={this.state.playlistName}
           onRemove={this.removeTrack}
           onNameChange={this.updatePlaylistName}
           onSave={this.savePlaylist}/>
           <PlaylistList items={this.state.playlists} selectPlaylist={this.selectPlaylist} refresh={this.getUserPlaylists}/>
        </div>
      </div>
    </div>
    )
  }
}


export default App;
