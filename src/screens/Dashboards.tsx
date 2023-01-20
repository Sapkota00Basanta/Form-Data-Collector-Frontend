import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { startCase, uniq } from "lodash";
import React from "react";
import { SubmissionsQuery } from "../generated/generated-types";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery<SubmissionsQuery>(gql`
    query Submissions {
      submissions {
        id
        submittedAt
        data
      }
    }
  `);

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { submissions } = data!;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "submittedAt",
      headerName: "Submitted",
      width: 200,
    },
    ...uniq(
      submissions.flatMap((eachSubmission) => Object.keys(eachSubmission.data))
    ).map((field) => ({
      field,
      headerName: startCase(field),
      width: 200,
      valueGetter: (params: GridValueGetterParams) => params.row.data[field],
    })),
  ];

  return (
    <Container>
      <DataGrid
        rows={submissions}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Container>
  );
};
