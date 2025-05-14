import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import storageUtil from "../utils/localStorageUtil";
import { jwtDecode } from "jwt-decode";
import { fetchAuthSession } from "aws-amplify/auth";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dummyPassword = "password123";

  const storedPassword = storageUtil.getItemLocal("password");

  const tokenGenerate = async () => {
    let token: any = storageUtil.getItemSession("authToken");

    if (!token) {
      const { tokens } = await fetchAuthSession();
      const authSession = await fetchAuthSession();
      console.log("tokens", tokens);
      token = tokens?.idToken?.toString();
      setSession(authSession);
      if (token) {
        storageUtil.setItemSession("authToken", token);
      }
    }

    return token;
  };

  useEffect(() => {
    const getTokensAndRedirect = async () => {
      await tokenGenerate();
      setIsLoading(false);
    };
    getTokensAndRedirect();
  }, []);

  const token: any = storageUtil.getItemSession("authToken");

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken?.exp * 1000;
      console.log("expirationTime", expirationTime);
      console.log("Date.now()", Date.now());
      // Here you can check if the token is expired
      if (expirationTime < Date.now()) {
        return <Navigate to="/Login" />;
      }
      return <Outlet />;
    } catch (error) {
      return <Navigate to="/Login" />;
    }
  }

  return <Navigate to="/Login" />;
};

export default ProtectedRoute;
