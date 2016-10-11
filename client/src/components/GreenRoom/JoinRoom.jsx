import React, { Component } from 'react';
import { Table, TableBody, TableFooter, TableHeader,
        TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const styles = {
  main: {
    position: 'relative',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 10%',
    marginTop: '10%'
  },
  textAlignCenter: {
    textAlign: 'center'
  }
};

const JoinRoom = ({ rooms, handleRowClick }) => {
  const renderRow = (row, index) => (
    <TableRow key={index} selected={row.selected}>
      <TableRowColumn>{index + 1}</TableRowColumn>
      <TableRowColumn>{row.roomName}</TableRowColumn>
      <TableRowColumn>{`${row.numPeople} out of 4`}</TableRowColumn>
      <TableRowColumn>{row.instruments.join(', ')}</TableRowColumn>
    </TableRow>
  );

  return(
    <div
      id="join-room-view"
      style={styles.main}
    >
      <div>
        Have a link already?  Just paste it into your url bar!
        Otherwise, checkout the open rooms below.  Click a row to join!
      </div>
      <div id="join-view-room">
        <Table
          fixedHeader
          fixedFooter
          selectable
          onCellClick={handleRowClick}
          multiSelectable={false}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn
                colSpan="4"
                tooltip="Join Open Room"
                style={styles.textAlignCenter}
              >
                Join Open Room
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Room Name</TableHeaderColumn>
              <TableHeaderColumn>Number Of People</TableHeaderColumn>
              <TableHeaderColumn>Instruments Being Played</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway
            showRowHover
            stripedRows={false}
          >
            {rooms.map(renderRow)}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn
                colSpan="4"
                style={styles.textAlignCenter}
              >
                Click on a row to join!
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

JoinRoom.propTypes = {
  rooms: React.PropTypes.array.isRequired,
  handleRowClick: React.PropTypes.func.isRequired
};

export default JoinRoom;
