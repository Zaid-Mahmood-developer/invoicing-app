import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import { changePasswordInitialValues, changePasswordValidationSchema } from "./dummyUtils";
import { useEffect } from "react";
import { usePostApi } from "../../customhooks/usePostApi";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner/Spinner";
const ChangePassword = () => {
    const navigate = useNavigate();
    const {refreshToken} = useSelector((state) => state?.submitStore?.loginVal);
    const changePasswordUrl = `${import.meta.env.VITE_API_URL}change-password`;
    const { registerUser, data, loading, error } = usePostApi(changePasswordUrl);

    const formik = useFormik({
        initialValues: changePasswordInitialValues,
        validationSchema: changePasswordValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            await registerUser({ oldpassword: values.oldPassword, newpassword: values.newPassword } , { Authorization: `Bearer ${refreshToken}` });
            resetForm();
        },
    });

    useEffect(() => {
        if (data?.status) {
            Swal.fire({
                icon: "success",
                title: "Password Reset Successful!",
                text: "Password has been changed successfully.",
                confirmButtonColor: "#0d6efd",
            }).then(()=>navigate("/home"));
        }

        else if (!error?.status && error?.message) {
            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text: error?.message || "Something went wrong. Please try again.",
                confirmButtonColor: "#dc3545",
            });
        }
        else if (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.message
            }).then(() => {
                setSubmitted(false);
            });
        }
    }, [data, error , navigate]);

    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center min-vh-100 container-bg"
        >
            <Card className="shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="text-center mb-4">Change Password</h3>

                

                <Form noValidate onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="oldPassword"
                            placeholder="Enter old password"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.oldPassword && !!formik.errors.oldPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.oldPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.newPassword && !!formik.errors.newPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.newPassword}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100 mt-2"
                        disabled={loading}
                    >
                        {loading ?  <Spinner/> : "Change Password"}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ChangePassword;
