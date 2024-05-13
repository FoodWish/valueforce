"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
// import Icon from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";

const UserPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clients, setClients] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    //clientId:null ,
    userName: "",
    onBoarded: "2001-12-24T00:00:00.000Z",
    Active: true,
    "client": {
      "connect": {
        "clientId": "Flame123"
      }
    },
  });

  React.useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/userClient");
          const data = await response.json();
          setClients(data.userClient);
        } catch (error) {
          console.error("Failed to fetch client data:", error);
        }
      }
    };

    fetchData();
  }, [status]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "client") {
      setFormData((prevState) => ({
        ...prevState,
        client: {
          connect: {
            clientId: value,
          },
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (clientId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmDelete) {
      try {
        const payload = { id: clientId };
        const response = await fetch("/api/userClient", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const updatedClients = clients.filter(
            (client: any) => client.clientId !== clientId
          );
          setClients(updatedClients);
        } else {
          console.error("Failed to delete client:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to delete client:", error);
      }
    }
  };

  const handleBack = () => {
    router.push('/admin');
  };

  const handleSubmit = async () => {
    console.log("formData:", formData);
    try {
      const response = await fetch("/api/userClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response) {
        setOpen(false); // Close the popup
      } else {
        console.error("Failed to create client:", response);
      }
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not Authorized</div>;
  }

  return (
    <Box>
      <IconButton aria-label="back" onClick={handleBack}  style={{ position: 'absolute', top: 70, left: 30 }}>
      <ArrowBackIcon sx={{ border: '1px solid black', borderRadius: '50%' }} />
        </IconButton>
      <div><h1>Users</h1></div>
      <Button
        onClick={() => setOpen(true)}
        sx={{ float: "right", bgcolor: "primary.main", color: "white" ,marginBottom: "20px"}}
      >
        Create User
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>S.No</TableCell>
              {/* <TableCell>Client Id</TableCell> */}
              <TableCell align="right">User Name</TableCell>
              <TableCell align="right">Client ID</TableCell>
              <TableCell align="right">OnBoarded</TableCell>
              <TableCell align="right">Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client: any, index) => (
              <TableRow
                key={client.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell align="right">{client.clientId}</TableCell>
                <TableCell align="right">{client.userName}</TableCell>
                <TableCell align="right">{client.onBoarded}</TableCell>
                <TableCell align="right">{client.Active}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(client.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Client</DialogTitle>
        <DialogContent>
          {/* <TextField
  margin="dense"
  id="clientId"
  name="clientId"
  label="Client ID"
  type="number"
  fullWidth
  value={formData.clientId === null ? '' : formData.clientId} // handle null value
  onChange={handleInputChange}
/> */}

          <TextField
            margin="dense"
            id="userName"
            name="userName"
            label="User Name"
            type="text"
            fullWidth
            value={formData.userName}
            onChange={handleInputChange}
          />
          {/* <TextField
                margin="dense"
                id="onBoarded"
                name="onBoarded"
                label="OnBoarded"
                type="date"
                fullWidth
                value={formData.onBoarded}
                onChange={handleInputChange}
            /> */}
          <TextField
            margin="dense"
            id="Active"
            name="Active"
            label="Active"
            type="text"
            fullWidth
            value={formData.Active}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
