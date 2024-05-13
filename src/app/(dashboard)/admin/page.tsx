"use client";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSession } from "next-auth/react";
import { Box } from "@mui/system";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useToast } from '../../../components/ui/use-toast';
import { DeleteIcon } from "lucide-react";

const Page = () => {
  const router = useRouter();
   const {toast} = useToast();
  const { data: session, status } = useSession();
  const [clients, setClients] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    clientName: "",
    clientEmail: "",
    clientId: "",
    spocName: "",
    spocPhone: "",
    spocEmail: "",
    validTill: "2001-12-24T00:00:00Z",
  });

  React.useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/client");
          const data = await response.json();
          setClients(data.clients);
        } catch (error) {
          console.error("Failed to fetch client data:", error);
        }
      }
    };

    fetchData();
  }, [status]);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const redirectToUserTab = (clientId: any) => {
    console.log("clientId:", clientId);
    router.push(`${window.location.origin}/user?clientId=${clientId}`);
  };

  const handleSubmit = async () => {
    console.log("formData:", formData);
    try {
      const response = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setOpen(false); // Close the popup
        toast({
          title: 'Success',
          description: 'Client created successfully',
          variant:'default'
        })
      
      } else {
        toast({
          title: 'Error',
          description: 'Error in creating client. Please try again.',
          variant:'destructive'
       })
      }
    } catch (error) {
      console.error("Failed to create client:", error);
      toast({
        title: 'Error',
        description: 'Error in creating client. Please try again.',
        variant:'destructive'
     })
    }
  };

  const handleDelete = async (clientId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmDelete) {
      try {
        const payload = { id: clientId };
        const response = await fetch("/api/user", {
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not Authorized</div>;
  }

  return (
    <Box marginTop="-100px">
      <div>Admin Page</div>
      <Button
        onClick={() => setOpen(true)}
        sx={{ float: "right", bgcolor: "primary.main", color: "white",marginBottom: "20px"}}
      >
        Create Client
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell align="right">Client Email</TableCell>
              <TableCell align="right">Client ID</TableCell>
              <TableCell align="right">SPOC Name</TableCell>
              <TableCell align="right">SPOC Phone</TableCell>
              <TableCell align="right">SPOC Email</TableCell>
              <TableCell align="right">Valid Till</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Updated At</TableCell>
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
                <TableCell>
                
                    <Typography
                      sx={{
                        color: "blue",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        redirectToUserTab(client.id);
                      }}
                    >
                      {client.clientName}
                    </Typography>
        
                </TableCell>
                <TableCell align="right">{client.clientEmail}</TableCell>
                <TableCell align="right">{client.clientId}</TableCell>
                <TableCell align="right">{client.spocName}</TableCell>
                <TableCell align="right">{client.spocPhone}</TableCell>
                <TableCell align="right">{client.spocEmail}</TableCell>
                <TableCell align="right">{client.validTill}</TableCell>
                <TableCell align="right">{client.createdAt}</TableCell>
                <TableCell align="right">{client.updatedAt}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => {
                      console.log("Edit client");
                    }}
                  >
                    Edit
                  </Button>
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
          <TextField
            autoFocus
            margin="dense"
            id="clientName"
            name="clientName"
            label="Client Name"
            type="text"
            fullWidth
            value={formData.clientName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="clientEmail"
            name="clientEmail"
            label="Client Email"
            type="email"
            fullWidth
            value={formData.clientEmail}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="clientId"
            name="clientId"
            label="Client ID"
            type="text"
            fullWidth
            value={formData.clientId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="spocName"
            name="spocName"
            label="SPOC Name"
            type="text"
            fullWidth
            value={formData.spocName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="spocPhone"
            name="spocPhone"
            label="SPOC Phone"
            type="text"
            fullWidth
            value={formData.spocPhone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="spocEmail"
            name="spocEmail"
            label="SPOC Email"
            type="email"
            fullWidth
            value={formData.spocEmail}
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

export default Page;
