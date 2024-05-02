import React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

const Btns = styled("div")(({ theme, ...rest }) => ({
  position: "absolute",
  right: "5px",
  top: "5px",
  display: "flex",
  gap: "5px",
  zIndex: 1,
}));

const Btn = styled(IconButton)(({ theme, ...rest }) => ({
  padding: "4px",
  aspectRatio: "1 / 1",
  width: "30px",
  position: "relative",
}));

export const ChangeHandlerImageEN = (
  e,

  setstateEN,

  key,
  shouldSetFileArray = false
) => {
  console.log(e);
  const { files } = e.target;
  if (files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = (e) => {
      setstateEN((prev) => ({
        ...prev,
        [key]: {
          file: shouldSetFileArray ? files : files[0],
          url: reader.result,
        },
      }));
    };
  }
};

export const ChangeHandlerImageES = (
  e,

  setstateES,

  key,
  shouldSetFileArray = false
) => {
  console.log(e);
  const { files } = e.target;
  if (files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = (e) => {
      setstateES((prev) => ({
        ...prev,
        [key]: {
          file: shouldSetFileArray ? files : files[0],
          url: reader.result,
        },
      }));
    };
  }
};

const QALibraryImageModal = ({
  children,
  EditIcon = CreateOutlinedIcon,
  DeleteIcon = DeleteOutlineOutlinedIcon,
  editHandler,
  deleteHandler,
  editTooltipText,
  deleteTooltipText,
  showDeleteButton = true,
  showEditButton = true,
  styles: { rootStyles = {}, childrenStyles = {} } = {},
  fileAccept = "image/svg+xml",
}) => {
  return (
    <div style={{ position: "relative", width: "max-content", ...rootStyles }}>
      <Btns>
        {showEditButton && (
          <Tooltip disableInteractive={true} arrow title={editTooltipText}>
            <Btn
              // onClick={editHandler}
              style={{ backgroundColor: "#00000087" }}
            >
              <label style={{ margin: 0, position: "absolute" }}>
                <EditIcon htmlColor="#fff" />

                <input
                  style={{ display: "none" }}
                  onChange={editHandler}
                  type="file"
                  accept={fileAccept}
                />
              </label>
            </Btn>
          </Tooltip>
        )}

        {showDeleteButton && (
          <Tooltip disableInteractive={true} arrow title={deleteTooltipText}>
            <Btn
              onClick={deleteHandler}
              style={{ backgroundColor: "#00000087" }}
            >
              <DeleteIcon htmlColor="#fff" />
            </Btn>
          </Tooltip>
        )}
      </Btns>
      <div style={{ width: "max-content", ...childrenStyles }}>{children}</div>
    </div>
  );
};

export default QALibraryImageModal;
