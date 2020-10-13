import React from "react";
//authentication component
import RouteAuthentication from "../../services/RouteAuthentication";
//dancer profile
import ProfileDancer from "../parts/ProfileDancer";
//organizer profile
import ProfileOrganizer from "../parts/ProfileOrganizer";
//profile avatar
import { createAvatarComponent, SrcSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource] });

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loaded: false,
      requests: null,
      events: null,
    };
    this.getUserData(); //we call the server for user information
  }

  getUserData() {
    const context = this; //binding context to current this context
    fetch("/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + window.sessionStorage.secret_token,
      },
    })
      .then((res) => res.json(res))
      .then(function (res) {
        console.log(res);
        context.setState({
          user: res.user,
          events: res.events,
          requests: res.requests,
        });
        context.setState({ loaded: true });
      })
      .catch((err) => alert(err));
  }

  capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  render() {
    if (this.state.loaded) {
      if (this.state.user.userType === "Dancer") {
        return (
          <ProfileDancer
            state={this.state}
            stateProps={this.props.state}
            onDeleteEvent={this.deleteEvent}
            onSaveEvent={this.saveEvent}
            onUnsaveEvent={this.unsaveEvent}
          />
        );
      } else if (this.state.user.userType === "Organizer") {
        return (
          <ProfileOrganizer
            state={this.state}
            stateProps={this.props.state}
            onDeleteEvent={this.props.onDeleteEvent}
            onSaveEvent={this.props.onSaveEvent}
            onUnsaveEvent={this.props.onUnsaveEvent}
          />
        );
      }
    } else {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
  }
}

export default RouteAuthentication(Profile);
