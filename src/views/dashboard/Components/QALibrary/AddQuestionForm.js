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
import DragDropFile from "./DragDropFile";
import QALibraryImageModal, {
  ChangeHandlerImageEN,
  ChangeHandlerImageES,
} from "./QALibraryImageModal";

const schema = yup.object().shape({
  questionEN: yup.string().trim().required("Question is required"),

  questionES: yup.string().trim().required("Question is required"),

  questiontype: yup.string().trim().required("Question Type is required"),

  options: yup.string().trim().required("Options are required"),

  numberOfOptions: yup.number().when("questiontype", {
    is: (v) => v === "BASIC_WITHOUT_IMAGE" || v === "BASIC_WITH_IMAGE",
    then: yup
      .number()
      .min(2)
      .max(10)
      .test(
        "Is positive?",
        "The number must be greater than 1!",
        (value) => value > 1 && value < 11
      )
      .required("Please enter valid value."),
    otherwise: yup
      .number()
      .min(2)
      .max(10)
      .test(
        "Is positive?",
        "The number must be greater than 1!",
        (value) => value > 1 && value < 11
      ),
  }),

  minNumber: yup.number().when("questiontype", {
    is: (v) => v === "NUMBER_RATING",
    then: yup
      .number()
      .min(1)
      .test(
        "Is positive?",
        "The min number must be greater than or equal to 1!",
        (value) => value >= 1
      )
      .required("Please enter valid value."),
    otherwise: yup
      .number()
      .min(1)
      .test(
        "Is positive?",
        "The min number must be greater than or equal to 1!",
        (value) => value >= 1
      ),
  }),

  maxNumber: yup.number().when("questiontype", {
    is: (v) => v === "NUMBER_RATING",
    then: yup
      .number()
      .min(1)
      .moreThan(yup.ref("minNumber"))
      .test(
        "Is positive?",
        "The max number must be greater than min number",
        (value) => value >= 0
      )
      .required("Please enter valid value."),
    otherwise: yup
      .number()
      .min(1)
      .moreThan(yup.ref("minNumber"))
      .test(
        "Is positive?",
        "The max number must be greater than min number",
        (value) => value >= 0
      ),
  }),
});

const init = {
  questionEN: "",
  questionES: "",
  questiontype: "",
  minNumber: 1,
  numberOfOptions: 2,
  options: "",
  imageBody: "",
};

export const questionTypes = [
  {
    value: "BASIC_WITH_IMAGE",
    label: "Basic Question - With image",
  },
  {
    value: "BASIC_WITHOUT_IMAGE",
    label: "Basic Question - Without image",
  },
  {
    value: "NUMBER_RATING",
    label: "Number Rating",
  },
  {
    value: "STAR_RATING",
    label: "Star Rating",
  },
];

export const AddQuestionForm = ({
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
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle id="alert-dialog-title">
            {"Add Question"}
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
                <Col sm={12}>
                  <Form.Group className="required">
                    <Form.Label style={{ fontWeight: 600 }}>
                      Question Title - EN
                    </Form.Label>
                    <Form.Control
                      type="text"
                      style={{
                        borderColor: "#000",
                      }}
                      name="questionEN"
                      value={values["questionEN"]}
                      placeholder="Enter Question"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.questionEN && errors.questionEN}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.questionEN}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col sm={12}>
                  <Form.Group className="required">
                    <Form.Label style={{ fontWeight: 600 }}>
                      Question Title - ES
                    </Form.Label>
                    <Form.Control
                      type="text"
                      style={{
                        borderColor: "#000",
                      }}
                      name="questionES"
                      value={values["questionES"]}
                      placeholder="Introducir pregunta"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.questionES && errors.questionES}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.questionES}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Group className="required">
                    <Form.Label style={{ fontWeight: 600 }}>
                      Type of Question
                    </Form.Label>

                    <Form.Control
                      type="field"
                      style={{
                        borderColor: "#000",
                      }}
                      as="select"
                      name="questiontype"
                      value={values.questiontype}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.questiontype && errors.questiontype}
                    >
                      <option key={"value"} value={""}>
                        Select type
                      </option>
                      {questionTypes.map((data, i) => (
                        <option key={data.value} value={data.value}>
                          {data.label}
                        </option>
                      ))}
                    </Form.Control>

                    <Form.Control.Feedback type="invalid">
                      {errors.questiontype}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                {(values.questiontype === "BASIC_WITHOUT_IMAGE" ||
                  values.questiontype === "BASIC_WITH_IMAGE") && (
                  <Col sm={12} md={4} lg={3}>
                    <Form.Group className="required">
                      <Form.Label style={{ fontWeight: 600 }}>
                        No. of Options
                      </Form.Label>
                      <Form.Control
                        type="number"
                        style={{
                          borderColor: "#000",
                        }}
                        min={2}
                        max={10}
                        name="numberOfOptions"
                        value={values.numberOfOptions}
                        placeholder="Enter number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.numberOfOptions && errors.numberOfOptions
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numberOfOptions}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
              </Form.Row>
              {values.questiontype === "BASIC_WITHOUT_IMAGE" &&
                !errors.numberOfOptions && (
                  <Form.Row>
                    <Col sm={12}>
                      <Form.Label style={{ fontWeight: 600 }}>
                        Option List - EN
                      </Form.Label>
                    </Col>

                    {new Array(values.numberOfOptions)
                      .fill("")
                      .map((d, index) => (
                        <Col key={index} sm={12} md={4} lg={4}>
                          <Form.Group className="required">
                            <Form.Control
                              value={d.value}
                              type="text"
                              style={{
                                textAlign: "left",
                                borderColor: "#3d4b64",
                                color: "#3d4b64",
                                borderRadius: "8px",
                              }}
                              name="options-en"
                              placeholder="Enter Option"
                              // onChange={handleChange}
                              onChange={(e) => onchangeInput(e, index)}
                              // onBlur={handleBlur}
                              // isInvalid={touched.options && errors.options}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.options}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      ))}
                  </Form.Row>
                )}
              {values.questiontype === "BASIC_WITHOUT_IMAGE" &&
                !errors.numberOfOptions && (
                  <Form.Row>
                    <Col sm={12}>
                      <Form.Label style={{ fontWeight: 600 }}>
                        Option List - ES
                      </Form.Label>
                    </Col>

                    {new Array(values.numberOfOptions)
                      .fill("")
                      .map((d, index) => (
                        <Col key={index} sm={12} md={4} lg={4}>
                          <Form.Group className="required">
                            <Form.Control
                              value={d.value}
                              type="text"
                              style={{
                                textAlign: "left",
                                borderColor: "#3d4b64",
                                color: "#3d4b64",
                                borderRadius: "8px",
                              }}
                              name="options-es"
                              placeholder="Introducir opción"
                              // onChange={handleChange}
                              onChange={(e) => onchangeInput(e, index)}
                              // onBlur={handleBlur}
                              // isInvalid={touched.options && errors.options}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.options}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      ))}
                  </Form.Row>
                )}
              {values.questiontype === "BASIC_WITH_IMAGE" &&
                !errors.numberOfOptions && (
                  <Form.Row>
                    <Col sm={12}>
                      <Form.Label style={{ fontWeight: 600 }}>
                        Option List - EN
                      </Form.Label>
                    </Col>

                    {new Array(values.numberOfOptions)
                      .fill("")
                      .map((d, index) => (
                        <Col key={index} sm={12} md={4} lg={4}>
                          <Box
                            component="fieldset"
                            sx={{
                              border: "1px solid #3d4b64",
                              padding: "10px 10px 0px 10px",
                              margin: "5px 0px",
                              borderRadius: (theme) =>
                                `${theme.shape.borderRadius}px`,
                              ...containerStyles,
                            }}
                          >
                            <Box
                              component="legend"
                              sx={{
                                // fontSize: "1.2rem",
                                // fontWeight: 600,
                                // width: "auto",
                                // margin: "-5px",

                                // padding: "10px 10px 0px 10px",
                                ...titleStyles,
                              }}
                            >
                              <Form.Group className="required">
                                <Form.Control
                                  value={d.value}
                                  type="text"
                                  style={{
                                    color: "#3d4b64",
                                  }}
                                  name="options-en"
                                  placeholder="Option Title"
                                  // onChange={handleChange}
                                  onChange={(e) => onchangeInput(e, index)}
                                  // onBlur={handleBlur}
                                  // isInvalid={touched.options && errors.options}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.options}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Box>
                            <Form.Group className="required">
                              {stateEN[index]?.url && (
                                <QALibraryImageModal
                                  editTooltipText="Change Image"
                                  deleteTooltipText="Delete Image"
                                  fileAccept="image/*"
                                  deleteHandler={() => {
                                    setstateEN((prev) => ({
                                      ...prev,
                                      [index]: {
                                        file: null,
                                        url: "",
                                      },
                                    }));
                                  }}
                                  editHandler={(e) => {
                                    ChangeHandlerImageEN(e, setstateEN, index);
                                    console.log(stateEN);
                                  }}
                                  styles={{
                                    rootStyles: {
                                      margin: "auto",
                                    },
                                  }}
                                >
                                  {" "}
                                  <img
                                    src={stateEN[index]?.url}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      borderRadius: "4px",
                                      border: "2px solid #ddd",
                                    }}
                                    alt="emoji"
                                  />
                                </QALibraryImageModal>
                              )}
                              {!stateEN[index]?.url && (
                                <DragDropFile
                                  styles={{
                                    rootStyles: {
                                      width: "auto",
                                      height: "auto",
                                    },
                                  }}
                                  label={
                                    stateEN[index]?.file
                                      ? stateEN[index]?.file?.name
                                      : "Drag & Drop Image Here..."
                                  }
                                  onChange={(e) =>
                                    ChangeHandlerImageEN(e, setstateEN, index)
                                  }
                                  accept="image/*"
                                />
                              )}
                            </Form.Group>
                          </Box>
                        </Col>
                      ))}
                  </Form.Row>
                )}

              {values.questiontype === "BASIC_WITH_IMAGE" &&
                !errors.numberOfOptions && (
                  <Form.Row>
                    <Col sm={12}>
                      <Form.Label style={{ fontWeight: 600 }}>
                        Option List - ES
                      </Form.Label>
                    </Col>

                    {new Array(values.numberOfOptions)
                      .fill("")
                      .map((d, index) => (
                        <Col key={index} sm={12} md={4} lg={4}>
                          <Box
                            component="fieldset"
                            sx={{
                              border: "1px solid #3d4b64",
                              padding: "10px 10px 0px 10px",
                              margin: "5px 0px",
                              borderRadius: (theme) =>
                                `${theme.shape.borderRadius}px`,
                              ...containerStyles,
                            }}
                          >
                            <Box
                              component="legend"
                              sx={{
                                // fontSize: "1.2rem",
                                // fontWeight: 600,
                                // width: "auto",
                                // margin: "-5px",

                                // padding: "10px 10px 0px 10px",
                                ...titleStyles,
                              }}
                            >
                              <Form.Group className="required">
                                <Form.Control
                                  value={d.value}
                                  type="text"
                                  style={{
                                    color: "#3d4b64",
                                  }}
                                  name="options-es"
                                  placeholder="Título de la opción"
                                  // onChange={handleChange}
                                  onChange={(e) => onchangeInput(e, index)}
                                  // onBlur={handleBlur}
                                  // isInvalid={touched.options && errors.options}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.options}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Box>
                            <Form.Group className="required">
                              {stateES[index]?.url && (
                                <QALibraryImageModal
                                  editTooltipText="Change Image"
                                  deleteTooltipText="Delete Image"
                                  fileAccept="image/*"
                                  deleteHandler={() => {
                                    setstateES((prev) => ({
                                      ...prev,
                                      [index]: {
                                        file: null,
                                        url: "",
                                      },
                                    }));
                                  }}
                                  editHandler={(e) => {
                                    ChangeHandlerImageES(e, setstateES, index);
                                    console.log(stateES);
                                  }}
                                  styles={{
                                    rootStyles: {
                                      margin: "auto",
                                    },
                                  }}
                                >
                                  {" "}
                                  <img
                                    src={stateES[index]?.url}
                                    style={{
                                      width: "150px",
                                      height: "150px",
                                      borderRadius: "4px",
                                      border: "2px solid #ddd",
                                    }}
                                    alt="emoji"
                                  />
                                </QALibraryImageModal>
                              )}
                              {!stateES[index]?.url && (
                                <DragDropFile
                                  styles={{
                                    rootStyles: {
                                      width: "auto",
                                      height: "auto",
                                    },
                                  }}
                                  label={
                                    stateES[index]?.file
                                      ? stateES[index]?.file?.name
                                      : "Arrastra y suelta la imagen aquí..."
                                  }
                                  onChange={(e) =>
                                    ChangeHandlerImageES(e, setstateES, index)
                                  }
                                  accept="image/*"
                                />
                              )}
                            </Form.Group>
                          </Box>
                        </Col>
                      ))}
                  </Form.Row>
                )}

              {values.questiontype === "NUMBER_RATING" && (
                <Form.Row>
                  <Col sm={12} md={6}>
                    <Form.Group className="required">
                      <Form.Label style={{ fontWeight: 600 }}>
                        Min Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        style={{
                          borderColor: "#000",
                        }}
                        min={1}
                        name="minNumber"
                        value={values.minNumber}
                        placeholder="Enter Number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.minNumber && errors.minNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.minNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6}>
                    <Form.Group className="required">
                      <Form.Label style={{ fontWeight: 600 }}>
                        Max Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        style={{
                          borderColor: "#000",
                        }}
                        min={1}
                        name="maxNumber"
                        disabled={!values.minNumber}
                        value={values.maxNumber}
                        placeholder="Enter Number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.maxNumber && errors.maxNumber}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.maxNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Form.Row>
              )}
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
            <Button
              style={{
                backgroundColor: "#3d4b64",
                color: "#fff",
              }}
              onClick={handleSubmit}
              autoFocus
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};
