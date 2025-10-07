import * as Yup from "yup";

export const loginFields = [
        { label: "Username", name: "username", type: "text", value: "", placeholder: "Username" },
        { label: "Email", name: "email", type: "email", value: "", placeholder: "Email" },
        { label: "Password", name: "password", type: "password", value: "", placeholder: "Password" }
    ]

 export const initialValues = loginFields.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
    }, {});

export const validationSchema = Yup.object({
            username: Yup.string()
                .required("Username is required")
                .min(3, "Username must be at least 3 characters"),
            email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 6 characters")
                .max(16 , "Password length cannot be greater than 16 characters")
        });

        