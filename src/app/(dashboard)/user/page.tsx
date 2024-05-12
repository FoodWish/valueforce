'use client';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSession } from 'next-auth/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';

const UserPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [clients, setClients] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    //clientId:null ,
    userName: '',
    onBoarded: "2001-12-24T00:00:00.000Z",
    "Active": true
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
   
    setFormData({
      ...formData,
      [name]: value,
      client: { connect: { clientId:"Flame123" } } // Updated to use parsedValue
    });
  };
  



  const handleSubmit = async () => {
    console.log('formData:', formData); 
    try {
      const response = await fetch("/api/userClient", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        
        setOpen(false); // Close the popup
      } else {
        console.error('Failed to create client:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not Authorized</div>;
  }

  return (
    <div>
      <div>Admin Page</div>
      <Button
  onClick={() => setOpen(true)}
  sx={{ float: 'right', bgcolor: 'primary.main', color: 'white' }}
>
  Create Client
</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>S.No</TableCell>
              {/* <TableCell>Client Id</TableCell> */}
              <TableCell align="right">User Name</TableCell>
              <TableCell align="right">Client ID</TableCell>
              <TableCell align="right">OnBoarded</TableCell>
              <TableCell align="right">Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client:any, index) => (
              <TableRow
                key={client.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell align="right">{client.clientId}</TableCell>
                <TableCell align="right">{client.userName}</TableCell>
                <TableCell align="right">{client.onBoarded}</TableCell>
                <TableCell align="right">{client.Active}</TableCell>
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
    </div>
  );
};

export default UserPage;
