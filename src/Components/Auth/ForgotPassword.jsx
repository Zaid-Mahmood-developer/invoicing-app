import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordInitialValues, forgotPasswordValidationSchema } from "./dummyUtils";
import { usePostApi } from "../../customhooks/usePostApi";
import Spinner from "../utils/Spinner/Spinner";
import Swal from "sweetalert2";
const Forgotpassword = () => {
    const { registerUser, data, loading, error } = usePostApi(`${import.meta.env.VITE_API_URL}forgot-password`);
    const [submitted, setSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: forgotPasswordInitialValues,
        validationSchema: forgotPasswordValidationSchema,
        onSubmit: async (values, { resetForm }) => {
          await  registerUser({ ...values });
            setSubmitted(true);
            resetForm();
        },
    });

    useEffect(() => {
        if (data?.status) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data?.message
            }).then(() => {
                setSubmitted(false);
            });
     
        } else if (!error?.status && error?.message) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.message 
            }).then(() => {
                setSubmitted(false);
            });
        }  else if (error) {
            Swal.fire({
                icon: "error",  
                title: "Oops...",
                text: error?.message
            }).then(() => {
                setSubmitted(false);
            }); 
        }
    }, [data , error]);

    return (
        <>
            {loading
                ?
                <Spinner/>
                :
                <Container
                    fluid
                    className="d-flex justify-content-center align-items-center vh-100 container-bg">
                    <Card className="p-4 shadow-lg rounded-4" style={{ width: "400px" }}>
                        <h3 className="text-center mb-3">Reset Your Password</h3>
                        <p className="text-center text-muted mb-4">
                            Enter your registered email and we’ll send you a password reset link.
                        </p>
                        {submitted && (
                            <Alert
                                variant="success"
                                onClose={() => setSubmitted(false)}
                                dismissible
                            >
                                Password reset link sent to your email!
                            </Alert>
                        )}

                        <Form noValidate onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="email" className="mb-3 text-start">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.email && !!formik.errors.email}
                                    isValid={formik.touched.email && !formik.errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 fw-semibold"
                                variant="primary"
                                size="lg"
                            >
                                Send Reset Link
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <Link to="/" className="text-decoration-none text-secondary">
                                ← Back to Login
                            </Link>
                        </div>
                    </Card>
                </Container>
            }
        </>
    )
}


export default Forgotpassword;
