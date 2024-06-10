import React, { useEffect, useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import { Layout } from 'antd';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const query = {
  'order': {
    'Orders.count': 'desc',
  },
  'measures': [
    'Orders.count',
    'LineItems.price',
    'LineItems.quantity',
  ],
  'dimensions': [
    'Products.name',
    'Orders.status',
    'Users.city',
  ],
};

const GridCubeOrg = () => {
  const [ rowData, setRowData ] = useState([]);
  const { resultSet } = useCubeQuery(query);

  useEffect(() => {
    if (resultSet) {
      setRowData(resultSet
        .tablePivot({
          x: ["Orders.count"],
          y: ["Users.city"],
        })
        .map(row => Object
          .keys(row)
          .reduce((object, key) => ({
            ...object,
            [key.replace('.', '-')]: row[key],
          }), {}),
        ),
      );

    }
  }, [ resultSet ]);


  return (
    <Layout>
      <div className='ag-theme-alpine' style={{ height: 700 }}>
        {rowData.map((row, index) => {
          return (
            <div key={index}>
              {Object.keys(row).map((key, index) => {
                return (
                  <div key={index}>
                    {key}: {row[key]}
                  </div>
                );
              })}
            </div>
          );
        })} 
      </div>
    </Layout>
  );
};

export default GridCubeOrg;
