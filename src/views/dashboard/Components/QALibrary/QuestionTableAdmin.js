import React, { useState } from "react";
import {
  makeStyles,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Link from "@material-ui/core/Link";
import { IconButton } from "@mui/material";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { OptionView } from "./OptionView";

const useStyles = makeStyles((theme) => ({
  table: {
    fontSize: "1rem",
  },
  linkButton: {
    color: "#000000",
    fontStyle: "italic",
  },
}));

const QuestionTableAdmin = ({
  rowData = [
    {
      teacher: "Cypress - Dense",
      question: "What's your favourite colour?",
      questionType: "Basic Question - Without image",
      options: "Red, White, Black",
      created: "07-04-2022 10:30AM",
      updated: "07-04-2022 12:30PM",
    },
  ],
  showDetails = false,
  handleModalClose,
}) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Teacher</TableCell>
              <TableCell align="left">Question</TableCell>
              <TableCell align="left">Question Type</TableCell>
              <TableCell align="center">Options</TableCell>
              <TableCell align="center">Created at</TableCell>
              <TableCell align="center">Updated at</TableCell>
              <TableCell align="center">Actions</TableCell>
              {showDetails && <TableCell align="center"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData?.length > 0 ? (
              rowData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((data) => (
                  <TableRow key={data.teacher}>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>
                      {data.teacher}
                    </TableCell>
                    <TableCell align="left">{data.question}</TableCell>
                    <TableCell align="left">{data.questionType}</TableCell>
                    <TableCell align="center">
                      {data.options}
                      <IconButton
                        aria-label="view"
                        color="info"
                        onClick={handleOpen}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <OptionView show={open} onHide={() => setOpen(false)} />
                    </TableCell>
                    <TableCell align="center">{data.created}</TableCell>
                    <TableCell align="center">{data.updated}</TableCell>
                    <TableCell align="center" sx={{ display: "flex" }}>
                      <IconButton aria-label="approve" color="success">
                        <ThumbUpAltIcon />
                      </IconButton>
                      <IconButton aria-label="reject" color="error">
                        <ThumbDownAltIcon />
                      </IconButton>
                    </TableCell>
                    {showDetails && (
                      <TableCell align="center">
                        {
                          <Link
                            component="button"
                            className={classes.linkButton}
                            variant="body2"
                            onClick={() => {
                              handleModalClose({
                                question: data.question,
                                type: data.questionType,
                                updated: data?.updatedOn,
                                status: data?.status,
                              });
                            }}
                          >
                            Show Details
                          </Link>
                        }
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan="7">
                  <Alert severity="error">No Data Found!</Alert>
                </TableCell>
              </TableRow>
            )}
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
  );
};

export default QuestionTableAdmin;
