import React from 'react';
import { View } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';

class VideoCall extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.audio)
                JitsiMeet.audioCall(this.props.conferenceUri);
            else
                JitsiMeet.call(this.props.conferenceUri);
        }, 1000);
    }

    render() {
        return (
            <JitsiMeetView onConferenceTerminated={this.props.onConferenceTerminated} onConferenceJoined={this.props.onConferenceJoined} onConferenceWillJoin={this.props.onConferenceWillJoin} style={{ flex: 1, height: '100%', width: '100%' }} />
        );
    }
}

VideoCall.defaultProps = { 
    onConferenceTerminated: () => {},
    onConferenceJoined: () => {},
    onConferenceWillJoin: () => {},
    audio: false,
};

export default VideoCall;
