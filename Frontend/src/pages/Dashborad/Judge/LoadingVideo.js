
import React, { Component} from "react";
import {Spinner} from "react-bootstrap"
import { withRouter } from 'react-router';

class JitsiComponent extends Component {
	
	
  domain = "meet.jit.si";
  api = {};

  constructor(props) {
    super(props);
    this.state = {
      room: "Case proceeding",
      user: {
        name: "Admin"
      },
      isAudioMuted: false,
      isVideoMuted: false
    };
	this.handleVideoConferenceLeft  = this.handleVideoConferenceLeft.bind(this);
  }

  startMeet = () => {
    const options = {
      roomName: this.state.room,
      width: "100%",
      height: 500,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
       
      },
      parentNode: document.querySelector("#jitsi-iframe"),
      userInfo: {
        displayName: this.state.user.name
      }
    };
    this.api = new window.JitsiMeetExternalAPI(this.domain, options);

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
  };

  handleClose = () => {
    console.log("handleClose");
  };

  handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant); 
    const data = await this.getParticipants();
  };

  handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant); 
    const data = await this.getParticipants();
  };

  handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "Case procedding", displayName: "Admin"}
    const data = await this.getParticipants();
  };

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    return this.props.history.push("/thank-you");
  };

  handleMuteStatus = (audio) => {
    console.log("handleMuteStatus", audio); 
  };

  handleVideoStatus = (video) => {
    console.log("handleVideoStatus", video); 
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); 
      }, 500);
    });
  }

  executeCommand(command) {
    this.api.executeCommand(command);
    if (command == "hangup") {
      return this.props.history.push("/thank-you");
    }

    if (command == "toggleAudio") {
      this.setState({ isAudioMuted: !this.state.isAudioMuted });
    }

    if (command == "toggleVideo") {
      this.setState({ isVideoMuted: !this.state.isVideoMuted });
    }
  }

  componentDidMount() {
    if (window.JitsiMeetExternalAPI) {
      

      this.startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
  }

  render() {
    const { isAudioMuted, isVideoMuted } = this.state;
    
    
    return (
      <>
       {/* {isLoading ? (
          <>
             <Spinner animation="grow" variant="primary" />
          </>
        ) : (
        } */}


      
        <div id="jitsi-iframe">            

       
</div>


      
        <div className="item-center" style={{'marginLeft':'650px'}}>
          <span>&nbsp;&nbsp;</span>
          <i
            onClick={() => this.executeCommand("toggleAudio")}
            className={`fas fa-2x grey-color ${
              isAudioMuted ? "fa-microphone-slash" : "fa-microphone"
            }`}
            aria-hidden="true"
            title="Mute / Unmute"
          ></i>
          <i
          style={{'color':'red'}}
            onClick={() => this.executeCommand("hangup")}
            className="fas fa-phone-slash fa-2x red-color"
            aria-hidden="true"
            title="Leave"
          ></i>
          <i
            onClick={() => this.executeCommand("toggleVideo")}
            className={`fas fa-2x grey-color ${
              isVideoMuted ? "fa-video-slash" : "fa-video"
            }`}
            aria-hidden="true"
            title="Start / Stop camera"
          ></i>
          <i
            onClick={() => this.executeCommand("toggleShareScreen")}
            className="fas fa-film fa-2x grey-color"
            aria-hidden="true"
            title="Share your screen"
          ></i>
        </div>
      </>
    );
  }
    
}

export default withRouter(JitsiComponent);




