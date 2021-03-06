import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "./style.scss";
import userApi from "../api/userApi";
function Dangki({ open, handleCloseDK }) {
  const { enqueueSnackbar } = useSnackbar();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("please enter your email")
      .email("please enter a valid"),
    password: yup
      .string()
      .required("please enter your password")
      .min(6, "Please enter at least 6 characters"),
    retypepassword: yup
      .string()
      .required("please require your password")
      .oneOf([yup.ref("password")], "Password does not match"),
    fullname: yup.string().required("please enter your fullname"),
    address: yup.string().required("please enter your address"),
    phone: yup
      .string()
      .required("please enter your phone")
      .matches(phoneRegExp, "Phone number is not valid"),
    birthday: yup.string().required("please enter your birthday"),
  });
  const formDK = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      retypepassword: "",
      birthday: "",
      address: "",
      phone: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formDK;
  const handleOnSubmitDK = async (values) => {
    try {
      await userApi.register(values);
      handleCloseDK();
      formDK.reset();
      enqueueSnackbar("Success", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.detail, {
        variant: "error",
      });
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleCloseDK}>
        <form onSubmit={handleSubmit(handleOnSubmitDK)}>
          <DialogContent
            className="dialogpass"
            style={{ minWidth: "550px", minHeight: "300px" }}
          >
            <DialogContentText
              style={{
                color: "red",
                paddingBottom: "20px",
                fontWeight: "500",
                fontSize: "22px",
              }}
            >
              ????ng k?? T??i kho???n
              <hr style={{ opacity: "0.3" }} />
            </DialogContentText>
            <TextField
              name="fullname"
              {...register("fullname")}
              margin="dense"
              autoFocus
              label="H??? t??n"
              type="text"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="fullname" />
            </p>
            <TextField
              name="email"
              {...register("email")}
              margin="dense"
              label="Email"
              type="text"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="email" />
            </p>
            <TextField
              name="password"
              {...register("password")}
              margin="dense"
              label="M???t kh???u"
              type="password"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="password" />
            </p>
            <TextField
              name="retypepassword"
              {...register("retypepassword")}
              margin="dense"
              label="X??c nh???n m???t kh???u"
              type="password"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="retypepassword" />
            </p>
            <TextField
              name="phone"
              {...register("phone")}
              margin="dense"
              label="??i???n tho???i"
              type="text"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="phone" />
            </p>
            <TextField
              name="address"
              {...register("address")}
              margin="dense"
              label="?????a ch???"
              type="text"
              fullWidth
              variant="outlined"
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="address" />
            </p>
            <TextField
              name="birthday"
              {...register("birthday")}
              margin="dense"
              label="Ng??y sinh"
              fullWidth
              variant="outlined"
              type="date"
              defaultValue="2017-05-24"
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <p style={{ color: "red", fontSize: "12px", textAlign: "left" }}>
              <ErrorMessage errors={errors} name="birthday" />
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDK}>Tr??? l???i</Button>
            <Button type="submit">????ng k??</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default Dangki;
