import { MdOutlineCrisisAlert } from "react-icons/md";
import { TbReceiptTax } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";

export const tile = [
  { icon: MdOutlineCrisisAlert, title: "Total Sales", number: "2500" , currentTime : "Today" },
  { icon: TbReceiptTax, title: "Total Invoices", number: "1500" , currentTime : "Today"},
  { icon: GiReturnArrow, title: "Total Returns", number: "500" , currentTime : "Today"},
      { icon: MdOutlineCrisisAlert, title: "Total Sales", number: "2500" , currentTime : "Current Month" },
    { icon: TbReceiptTax, title: "Total Invoices", number: "1500" , currentTime : "Current Month"},
    { icon: GiReturnArrow, title: "Total Returns", number: "500" , currentTime : "Current Month"},
];
