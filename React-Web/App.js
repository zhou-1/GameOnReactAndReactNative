import React, { Component } from "react";
import ReactPlayer from "react-player";

import UFOImage from "./UFO-QR.jpg";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };
    this.toggleBox = this.toggleBox.bind(this);
  }

  toggleBox() {
    const { opened } = this.state;
    this.setState({
      opened: !opened
    });
  }

  render() {
    var { title } = this.props;
    const { opened } = this.state;

    if (opened) {
      title = "QR Code for game below";
    } else {
      title = "Click here to get QR Code";
    }

    const titleStyle = {
      color: "white",
      backgroundColor: "DodgerBlue",
      fontWeight: "bold",
      fontSize: 38,
      fontFamily: "Arial",
      textAlign: "center"
    };

    const tryStyle = {
      backgroundColor: "Orange",
      fontWeight: "bold",
      fontSize: 20,
      fontFamily: "Arial",
      textAlign: "center"
    };

    return (
      <div>
        <h1 style={titleStyle}>UFO Game Project on React JS </h1>

        <h2> Below is an official video release from Pentagon for UFO </h2>
        <ReactPlayer
          url="https://www.youtube.com/watch?v=mW9g_gx2BqM"
          className="react-player"
          playing
          width="100%"
        />

        <div style={tryStyle}>
          <h3 style={{ color: "white" }}>
            After video, Wanna try our game about UFO?
          </h3>

          <div
            className="boxTitle"
            onClick={this.toggleBox}
            style={{ color: "green" }}
          >
            {title}
          </div>
          {opened && (
            <div class="boxContent">
              <img src={UFOImage} alt="UFO!" width="300" height="250" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
