import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "../lib/schemas/registerschema";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi";
import { LockOutline } from "@mui/icons-material";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router";

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isLoading },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap();
      // Handle successful registration, e.g., redirect to login page
    } catch (error) {
      const apierror = error as { message: string };
      if (apierror.message && typeof apierror.message === "string") {
        const errorMessage = apierror.message.split(",");
        errorMessage.forEach((e) => {
          if (e.includes("email")) {
            setError("email", { message: e });
          } else if (e.includes("password")) {
            setError("password", { message: e });
          }
        });
      }
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
        <Typography variant="h5">Register</Typography>
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
          <Button
            disabled={isLoading || !isValid}
            variant="contained"
            type="submit"
          >
            Register
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {" "}
            Already have an account?
            <Typography
              sx={{ margin: 3 }}
              component={Link}
              to="/login"
              color="primary"
            >
              {" "}
              Sign in
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
