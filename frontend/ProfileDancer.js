import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventCardDeck from "./EventCardDeck";
import Button from "react-bootstrap/Button";
import MyRequests from "../forms/MyRequests";
import moment from "moment"; //for neat time conversions
import {
  MdMailOutline,
  MdLocationOn,
  MdFavorite,
  MdFace,
  MdStarHalf,
} from "react-icons/md";
//profile avatar
import { createAvatarComponent, SrcSource, IconSource } from "react-avatar";
const Avatar = createAvatarComponent({ sources: [SrcSource, IconSource] });

const ProfileDancer = (props, userData) => {

  const capitalize = (input) => {
    const capitalStr = input.replace(/\b\w/g, function (string) {
      return string.toUpperCase();
    });
    return capitalStr;
  };

  return (
    <div className="container d-flex flex-wrap flex-column">
      <Link
        to={{ pathname: "/edit/dancer", state: props.state.user }}
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline-dark" className="d-flex ml-auto">
          Edit
        </Button>
      </Link>

      <Avatar
        round="50%"
        size="150"
        src={props.state.user.picture}
        name={props.state.name}
        className="img-fluid align-self-center mt-1 mb-3"
      />
      <h5 className="mt-2 align-self-center">
        {capitalize(props.state.user.name)}
      </h5>

      <div className="d-flex align-self-center">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <h6 className="ml-3 d-inline-flex align-self-center">
            <MdFace className="align-text-bottom" />
          </h6>
          <h6 className="ml-1 d-inline-flex align-self-center">
            {moment().diff(
              moment(props.state.user.yearOfBirth, "YYYY").startOf(),
              "years"
            )}{" "}
            years
          </h6>
          <h6 className="ml-3">
            <MdLocationOn className="align-text-bottom" />
          </h6>
          <h6 className="ml-1"> {props.state.user.city}</h6>
          <h6 className="ml-3 d-inline-flex justify-content-center">
            <MdMailOutline className="align-text-bottom" />
          </h6>
          <h6 className="ml-1">{props.state.user.email}</h6>
          <h6 className="ml-3 d-inline-flex justify-content-center">
            <MdStarHalf className="align-text-bottom" />
          </h6>
          <h6 className="ml-1">{props.state.user.proficiencyLevel}</h6>
        </div>
      </div>

      <div className="d-flex align-self-center">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <MdFavorite className="mr-1 align-text-bottom" />{" "}
          {props.state.user.listOfDanceStyles.map((danceStyle) => (
            <span className="mr-1 badge border-pink">
              {capitalize(danceStyle)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <EventCardDeck
          events={props.stateProps.savedEvents}
          limit="5"
          scope={["saved", "upcoming"]}
          state={props.stateProps}
          onDeleteEvent={(event) => props.onDeleteEvent(event)}
          onSaveEvent={(event) => props.onSaveEvent(event)}
          onUnsaveEvent={(event) => props.onUnsaveEvent(event)}
        />

        <h4 className="text-center mt-2">
          <b>Your Partner Requests</b>
        </h4>
        <MyRequests state={props.state} />

      </div>
    </div>
  );
};
export default ProfileDancer;
