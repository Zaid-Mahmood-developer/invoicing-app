import { Container, Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { resetPasswordInitialValues, resetPasswordValidationSchema } from "./dummyUtils";
import { usePostApi } from "../../customhooks/usePostApi";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner/Spinner";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const postUrl = `${import.meta.env.VITE_API_URL}reset-password/${token}`;
  const { registerUser, data, loading, error } = usePostApi(postUrl);
  const [resetPswd, setResetPswd] = useState(false);
  const formik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      await registerUser({ newpassword: values.password });
      resetForm();
    },
  });

  useEffect(() => {
    if (data?.status) {
      setResetPswd(true)
      Swal.fire({
        icon: "success",
        text: data?.message || "Password has been reset successfully",
        confirmButtonColor: "#0d6efd",
        timer : 1500
      }).then(() => navigate("/"), setResetPswd(false));
    }
    else if (!error?.status && error?.message) {
      setResetPswd(false);
      Swal.fire({
        icon: "error",
        text: error?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    }
    else if (error) {
      setResetPswd(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message
      }).then(() => {
        setSubmitted(false);
      });
    }
  }, [data, error, navigate]);

  loading || resetPswd && <Spinner />

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 container-bg"
    >
      <Card className="shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4 fw-semibold text-primary">
          Reset Your Password
        </h3>

        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.confirmPassword && !!formik.errors.confirmPassword
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-2 d-flex justify-content-center align-items-center"
            disabled={loading || formik.isSubmitting}
          >
            Reset Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ResetPassword;
