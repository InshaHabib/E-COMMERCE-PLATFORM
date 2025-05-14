import React, { useEffect, useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
    // role: "user"
  })

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value
      }
    })
  }

  const valideValue = Object.values(formFields).every(el => el)

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.name === "") {
      context.alertBox("error", "Please enter full name");
      return false
    }

    if (formFields.email === "") {
      context.alertBox("error", "Please enter email id");
      return false
    }


    if (formFields.password === "") {
      context.alertBox("error", "Please enter password");
      return false
    }


    postData("/api/user/register", formFields).then((res) => {

      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox("success", res?.message);
        localStorage.setItem("userEmail", formFields.email)
        setFormFields({
          name: "",
          email: "",
          password: ""
        })

        history("/verify")
      } else {
        context.alertBox("error", res?.message);
        setIsLoading(false);
      }

    })


  }



  const authWithGoogle = () => {

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          avatar: user.providerData[0].photoURL,
          mobile: user.providerData[0].phoneNumber,
          // role: "USER"
        };


        postData("/api/user/authWithGoogle", fields).then((res) => {

          if (res?.error !== true) {
            setIsLoading(false);
            context.alertBox("success", res?.message);
            localStorage.setItem("userEmail", fields.email)
            localStorage.setItem("accessToken", res?.data?.accesstoken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);

            context.setIsLogin(true);

            history("/")
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false);
          }

        })

        console.log(user)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });


  }

  return (
    <section className="section signuppage sm:py-12">
      <div className="shape-bottom">
        <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8" style={{ enableBackground: 'new 0 0 1921 819.8' }}>
          {" "}
          <path
            className="st0"
            d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
          ></path>{" "}
        </svg></div>

      <div className="container">
        <div className="card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10 relative z-100">
          <h3 className="text-center text-[18px] text-black">
            SignUp with a new account
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                name="name"
                value={formFields.name}
                disabled={isLoading === true ? true : false}
                label="Full Name"
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                name="email"
                label="Email Id"
                value={formFields.email}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow === false ? 'password' : 'text'}
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                className="w-full"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px]
              !min-w-[35px] !rounded-full !text-black"
                onClick={() => setIsPasswordShow(!isPasswordShow)}
              >
                {isPasswordShow === false ? (
                  <Tooltip title="Show Password" placement="top">
                    {" "}
                    <IconButton>
                      <IoMdEye className="text-[20px] opacity-75 text-black" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Hide Password" placement="top">
                    {" "}
                    <IconButton>
                      <IoMdEyeOff className="text-[20px] opacity-75 text-black" />
                    </IconButton>
                  </Tooltip>
                )}
              </Button>
            </div>

            {/* <div className="form-group w-full mb-5">
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formFields.role}
                  disabled={isLoading}
                  label="Role"
                  onChange={onChangeInput}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SELLER">Seller</MenuItem>
                </Select>
              </FormControl>
            </div> */}

            <div className="flex items-center w-full mt-3 mb-3">
              <Button type="submit" disabled={!valideValue} className="btn-org btn-lg w-full flex gap-3">
                {
                  isLoading === true ? <CircularProgress color="inherit" />
                    :
                    'SignUp'
                }

              </Button>
            </div>

            <p className="text-center">
              Already have an account?{" "}
              <Link
                className="link text-[14px] font-[600] text-primary"
                to={"/login"}
              >
                Login
              </Link>
            </p>
            <p className="text-center font-[500]">
              Or continue with social account
            </p>
            <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black"
              onClick={authWithGoogle}>
              <FcGoogle className="text-[20px]" />
              Sign Up With Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
