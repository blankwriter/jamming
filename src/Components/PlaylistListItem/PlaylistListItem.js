import React from "react";
import "./PlaylistListItem.css";

class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.selectPlaylist(this.props.id);
    }

    render() {
        return (
            <div className="Item" onClick={this.handleClick}>
                <div className="Item-information">
                    <h3>{this.props.name}</h3>
                </div>
            </div>
        );
    }
}

export default PlaylistListItem;