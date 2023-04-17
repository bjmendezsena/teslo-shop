import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layouts";
import { PeopleOutline } from "@mui/icons-material";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { IUser, Role } from "../../interfaces";
import { tesloApi } from "../../api";

const columns: GridColDef[] = [
  { field: "email", headerName: "Email", width: 250 },
  { field: "name", headerName: "Nombre", width: 300 },
];

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!error && !data) return <></>;

  if (error)
    return <Typography variant='h4'>Error al cargar los datos</Typography>;

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  const onRoleChange = async (userId: string, role: Role) => {
    const previousUsers = [...users];

    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userId ? role : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloApi.put(`/admin/users`, { role, userId });
    } catch (error) {
      console.log(error);
      setUsers(previousUsers);
      alert("No se pudo actualizar el rol del usuario");
    }
  };

  return (
    <AdminLayout
      title='Usuarios'
      subTitle='Mantenimiento de usuarios'
      icon={<PeopleOutline />}
    >
      <Grid container className='fadeIn'>
        <Grid
          item
          sx={{
            height: 650,
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns.concat({
              field: "role",
              headerName: "Rol",
              width: 300,
              renderCell: ({ row }: GridValueGetterParams) => {
                return (
                  <Select<Role>
                    value={row.role}
                    label='Rol'
                    onChange={({ target }) => {
                      onRoleChange(row.id as string, target.value as Role);
                    }}
                    sx={{
                      width: "300px",
                    }}
                  >
                    <MenuItem value='admin'>Administrador</MenuItem>
                    <MenuItem value='client'>Cliente</MenuItem>
                  </Select>
                );
              },
            })}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
