import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Box, Button, IconButton } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { Col, Form } from "react-bootstrap";
import * as yup from "yup";

const schema = yup.object().shape({
  options: yup.string().trim().required("Options are required"),
});

const init = {
  options: "",
};

export const OptionView = ({
  addImage,
  show,
  onHide,
  containerStyles,
  titleStyles,
}) => {
  const [stateEN, setstateEN] = useState([]);
  const [stateES, setstateES] = useState([]);
  const [data, setData] = useState({});

  const onchangeInput = (e, index) => {
    const { value } = e.target;

    setData((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  return (
    <Formik
      initialValues={init}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        addImage({ ...values, imageBody: stateES.url });
        resetForm();
        console.log({ ...values, data });
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        resetForm,
        values,
        errors,
        touched,
      }) => (
        <Dialog
          open={show}
          onClose={() => {
            onHide();
            resetForm();
          }}
          maxWidth="xs"
          fullWidth={true}
        >
          <DialogTitle id="alert-dialog-title">
            {"Options"}
            <IconButton
              aria-label="close"
              onClick={onHide}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers={true}>
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Col xs={12}>
                  <Form.Group className="required">
                    <Form.Control
                      type="text"
                      style={{
                        borderColor: "#000",
                      }}
                      name="optionEN"
                      value={values["optionEN"]}
                      placeholder="Enter Option"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.optionEN && errors.optionEN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.optionEN}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col xs={12}>
                  <Form.Group className="required">
                    <Form.Control
                      type="text"
                      style={{
                        borderColor: "#000",
                      }}
                      name="optionEN"
                      value={values["optionEN"]}
                      placeholder="Enter Option"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.optionEN && errors.optionEN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.optionEN}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col xs={12}>
                  <Form.Group className="required">
                    <Form.Control
                      type="text"
                      style={{
                        borderColor: "#000",
                      }}
                      name="optionEN"
                      value={values["optionEN"]}
                      placeholder="Enter Option"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.optionEN && errors.optionEN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.optionEN}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </DialogContent>

          <DialogActions>
            <Button
              color="error"
              onClick={() => {
                onHide();
                resetForm();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};
