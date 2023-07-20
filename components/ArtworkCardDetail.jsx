import React, { useState } from "react";
import useSWR from "swr";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { Button, Card } from "react-bootstrap";
import Error from "next/error";

export default function ArtworkCardDetail({ objectID }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(
    favouritesList.includes(objectID) ? true : false
  );
  const { data, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImage,
    primaryImageSmall,
    title,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    creditLine,
    dimensions,
    artistWikidata_URL,
  } = data;

  const handleFavouritesClick = () => {
    if (showAdded) {
      // If "showAdded" value is true, remove the objectID from favouritesList
      setFavouritesList((favouritesList) =>
        favouritesList.filter((fav) => fav != objectID)
      );
      setShowAdded(false);
    } else {
      // If "showAdded" value is false, add the objectID to favouritesList
      setFavouritesList((favouritesList) => [...favouritesList, objectID]);
      setShowAdded(true);
    }
  };
  return (
    <Card>
      {primaryImageSmall && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <b>Date:</b> {objectDate || "N/A"}
          <br />
          <b>Classification:</b> {classification || "N/A"}
          <br />
          <b>Medium:</b> {medium || "N/A"}
          <br />
          <br />
          <b>Artist:</b> {artistDisplayName || "N/A"} ({" "}
          {artistDisplayName && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}{" "}
          )
          <br />
          <b>Credit Line:</b> {creditLine || "N/A"}
          <br />
          <b>Dimensions:</b> {dimensions || "N/A"}
          <br />
        </Card.Text>
        <Button
          variant={showAdded ? "primary" : "outline-primary"}
          onClick={handleFavouritesClick}
        >
          {showAdded ? "+ Favourite (added)" : "+ Favourite"}
        </Button>
      </Card.Body>
    </Card>
  );
}
