import React from 'react';
import { MDBDataTable } from 'mdbreact';

const DatatablePage = (userData) => {
    console.log(userData.logs)
    const data = {
        columns: [
            {
                label: 'Tid',
                field: 'tid',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Uid',
                field: 'uid',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Load',
                field: 'load',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Os',
                field: 'os',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Ram',
                field: 'ram',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Autoscale',
                field: 'autoscale',
                sort: 'asc',
                width: 100
            },
        ],
        rows:userData.logs,
    };

    return (data)
}



export default function Admin({transactionData}) {
  const userData = transactionData.data;
  console.log(userData);
  const data=DatatablePage(userData)
  return(
      <div><h1>All Logs</h1>
        <MDBDataTable
          striped
          bordered
          hover
          data={data}
          paginationLabel={false}
          paging={false}
        />
</div>
  );
};

