import BackupOutlinedIcon from "@material-ui/icons/BackupOutlined";
import { Box } from "@mui/system";
import React from "react";
import { Form } from "react-bootstrap";

const DragDropFile = ({
  label = "Drag & Drop File Here...",
  showLabel = true,
  disabled = false,
  accept,
  onChange,
  isInvalid = false,
  Icon = BackupOutlinedIcon,
  styles: { rootStyles = {} } = {},
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100px",
        border: (theme) =>
          `1px dashed ${isInvalid ? theme.palette.error.main : "#b7b7b7"}`,
        borderRadius: "4px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.1)" : "#fff",
      }}
      style={{ ...rootStyles }}
      className={
        isInvalid
          ? "custom-image-drag-drop is-invalid"
          : "custom-image-drag-drop"
      }
    >
      <Icon style={{ fontSize: "3rem" }} />
      <Box
        component={Form.File}
        sx={{
          opacity: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          "& > input": {
            height: "100%",
          },
        }}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={onChange}
      />
      {showLabel && (
        <Box
          sx={{
            fontSize: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
};

export default DragDropFile;
