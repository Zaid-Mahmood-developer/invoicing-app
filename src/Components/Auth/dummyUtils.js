import * as Yup from "yup";

export const loginFields = [
    { label: "Username", name: "username", type: "text", value: "", placeholder: "Username" },
    { label: "Email", name: "email", type: "email", value: "", placeholder: "Email" },
    { label: "Password", name: "password", type: "password", value: "", placeholder: "Password", subLabel: "Forgot Password" }
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
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password length cannot be greater than 16 characters")
});

export const signupFields = [
    { label: "NTN/CNIC", name: "ntncninc", type: "text", value: "", placeholder: "NTN/CNIC" },
    { label: "Business Name", name: "businessname", type: "text", value: "", placeholder: "Business Name" },
    { label: "Province", name: "province", type: "dropdown", value: "", placeholder: "Please Select Province", options: ["Islamabad Capital Territory", "Punjab", "Sindh", "Balochistan", "Khyber Pakhtunkua", "FATA", "Gilgit Baltistan"] },
    { label: "Address", name: "address", type: "text", value: "", placeholder: "Address" },
    { label: "Email", name: "email", type: "email", placeholder: "Email" },
    { label: "Username", name: "username", type: "text", value: "", placeholder: "Username" },
    { label: "Password", name: "password", type: "password", value: "", placeholder: "Password" },
    { label: "Confirm Password", name: "confirmpassword", type: "password", value: "", placeholder: "Confirm Password" }
]
export const signupInitialValues = {
    ntncninc: "",
    businessname: "",
    province: "",
    address: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
};

// ✅ Validation Schema
export const signupValidationSchema = Yup.object({
    ntncninc: Yup.string()
        .matches(/^[0-9]{7}$/, "NTN must be exactly 7 digits")
        .required("NTN/CNIC is required"),

    businessname: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
        .max(16, "Maximum 16 characters")
        .required("Business name is required"),

    province: Yup.string()
        .notOneOf(["Select province"], "Please select a valid province")
        .required("Province is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    address: Yup.string()
        .matches(/^[A-Za-z0-9\s,.-]+$/, "Only letters, numbers, commas, periods allowed")
        .max(16, "Maximum 16 characters")
        .required("Address is required"),

    username: Yup.string()
        .max(16, "Maximum 16 characters")
        .required("Username is required"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Maximum 16 characters")
        .required("Password is required"),

    confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Confirm Password must match with password")
        .required("Confirm password is required"),
});
