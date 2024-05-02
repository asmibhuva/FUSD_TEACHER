import React from 'react'
import { makeStyles, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableFooter } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  table: {
    fontSize: "1rem",
  },
  linkButton: {
    color: "#000000",
    fontStyle: "italic",
  },
}))

const CustomTable = ({ rowData = [], showDetails = false, handleModalClose }) => {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell>Student ID</TableCell> */}
              <TableCell align="left">Student ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Questions Answered</TableCell>
              {showDetails && <TableCell align="center"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>

            {rowData?.length > 0 ?
              rowData?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )?.map(data => (
                <TableRow key={data.studentId}>
                  <TableCell align="left">{data.studentId}</TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>{data.studentName}</TableCell>
                  <TableCell align="center">{data.answerCount}</TableCell>
                  {showDetails && <TableCell align="center">{
                    <Link
                      component="button"
                      className={classes.linkButton}
                      variant="body2"
                      onClick={() => {
                        handleModalClose({
                          id: data.studentId,
                          name: data.studentName,
                          details: data?.detailedJSON
                        })
                      }}
                    >
                      Show Details
                    </Link>}</TableCell>}
                </TableRow>
              )) :
              <TableRow>
                <TableCell colSpan="3">
                  <Alert severity="error">No Data Found!</Alert>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25, 50, { label: "All", value: -1 }]}
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true,
        }}
        component="div"
        count={rowData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default CustomTable
