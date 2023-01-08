import React from "react";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Avatar } from "@mui/material";

import UserContext from "../context/UserContext";

const form = {
  "& > *": {
    width: "25ch",
    margin: "10px",
  },
};

const button = {
  margin: "10px",
  width: "35ch",
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function Profile() {
  const { user, setUser } = React.useContext(UserContext);

  // If user is empty due to refresh, get the user's profile information from local storage
  // If the user's profile information is not in local storage, redirect to the login page
  // user ? setUser(JSON.parse(localStorage.getItem('user'))) : navigate('/');

  // Set firstName, lastName, and email to the user's profile information
  const { email, firstname, lastname } = user;

  // This user's profile information should be saved in local storage so that it does not gets lost even if the user refreshes the page
  // If the user's profile information is not in local storage, set it to the user's profile information

  const [isEditing, setIsEditing] = React.useState(false); // state to track whether the form is being edited

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    // Get the values of the form fields
    const updatedFirstName = event.target.firstName.value;
    const updatedLastName = event.target.lastName.value;
    const updatedEmail = localStorage.getItem("email");
    const updatedPassword = event.target.password.value;

    // Fetch on /profile to update the user's profile in put
    // If the fetch is successful, update the user's profile in context
    fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: updatedEmail,
        firstname: updatedFirstName,
        lastname: updatedLastName,
        password: updatedPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          // Update the user's profile in context
          setUser({
            email: updatedEmail,
            firstname: updatedFirstName,
            lastname: updatedLastName,
          });

          // Update the user's profile in local storage
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: updatedEmail,
              firstname: updatedFirstName,
              lastname: updatedLastName,
            })
          );
        }
      });

    // Update the user's profile with the new values
    setIsEditing(false);
  };

  if (isEditing) {
    // render the form for editing the user's profile
    return (
      <form style={form} onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2}>
          <TextField
            label="First Name"
            name="firstName"
            // Set width to 25ch so that the form fields are the same width
            sx = {{
                width: "40ch",
            }}
            defaultValue={firstname}
          />
          <TextField
            label="Last Name"
            name="lastName"
            sx = {{
                width: "40ch",
            }}
            defaultValue={lastname}
          />
          <TextField label="Password" name="password" sx = {{
                width: "40ch",
            }}/>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={button}
            size="large"
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleCancelClick}
            style={button}
            size="large"
          >
            Cancel
          </Button>
        </Stack>
      </form>
    );
  } else {
    // render the user's profile information
    return (
      <>
        <Stack direction="row" spacing={2}>
          <Avatar {...stringAvatar(firstname + " " + lastname)} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
            }}
          >
            User Profile
          </Typography>
        </Stack>
        <Typography
          sx={{
            textAlign: "left",
            margin: "10px",
          }}
        >
          First Name: {firstname}
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            margin: "10px",
          }}
        >
          Last Name: {lastname}
        </Typography>
        <Typography
          sx={{
            textAlign: "left",
            margin: "10px",
          }}
        >
          Email: {email}
        </Typography>
        <Button variant="outlined" onClick={handleEditClick} style={button}>
          Edit
        </Button>
      </>
    );
  }
}
