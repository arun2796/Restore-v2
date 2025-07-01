/* eslint-disable react-hooks/rules-of-hooks */
import { LockOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../lib/schemas/loginschemas";
import { useLazyUserinfoQuery, useLoginMutation } from "./accountApi";

export default function loginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const location = useLocation();
  const [fetchUserinfo] = useLazyUserinfoQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });
  const navigation = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap();
      await fetchUserinfo();
      navigation(location.state?.from || "/catalog");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        sx={{ mt: 8, mb: 4 }}
      >
        <LockOutline
          sx={{ color: "secondary.main", marginTop: 3, fontSize: 40 }}
        />
        <Typography variant="h5">sign in</Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          marginY={3}
          width={"100%"}
        >
          <TextField
            label="Email"
            fullWidth
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : undefined}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : undefined}
          />
          <Button disabled={isLoading} variant="contained" type="submit">
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {" "}
            Don't have a account
            <Typography
              sx={{ margin: 3 }}
              component={Link}
              to="/register"
              color="primary"
            >
              {" "}
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
