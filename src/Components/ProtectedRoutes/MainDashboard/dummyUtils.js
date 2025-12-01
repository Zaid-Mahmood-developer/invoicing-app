import { MdOutlineCrisisAlert } from "react-icons/md";
import { TbReceiptTax } from "react-icons/tb";
import { GiReturnArrow } from "react-icons/gi";

export const tile = [
  {
    icon: MdOutlineCrisisAlert,
    title: "Total Sales",
    key: "todaySales",
    currentTime: "Today",
  },
  {
    icon: TbReceiptTax,
    title: "Total Invoices",
    key: "todayInvoiceCount",
    currentTime: "Today",
  },
  {
    icon: GiReturnArrow,
    title: "Total Returns",
    key: "todayReturns",
    currentTime: "Today",
  },
  {
    icon: MdOutlineCrisisAlert,
    title: "Monthly Sales",
    key: "monthSales",
    currentTime: "Current Month",
  },
  {
    icon: TbReceiptTax,
    title: "Monthly Invoices",
    key: "monthInvoiceCount",
    currentTime: "Current Month",
  },
  {
    icon: GiReturnArrow,
    title: "Monthly Returns",
    key: "monthReturns",
    currentTime: "Current Month",
  },
];
