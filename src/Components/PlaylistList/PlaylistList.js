import React from "react";
import PlaylistListItem  from "../PlaylistListItem/PlaylistListItem";
import "./PlaylistList.css";

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { playlists: [] }
    }

    mapItems() {
        if(this.props.items) {
            return this.props.items.map(item => {
                return <PlaylistListItem key={item.id} id={item.id} name={item.name} selectPlaylist={this.props.selectPlaylist} />
            });
        }
    }

    render() {
        return (
            <div className="PlaylistList">
                <h2>Created Playlists</h2>
                <div className="PlaylistListContainer">
                    {this.mapItems()}
                </div>
                <div className="Refresh-container">    
                    <button className="Playlist-save" onClick={this.props.refresh}>REFRESH</button>
                </div>
            </div>
        );
    }
}

export default PlaylistList;