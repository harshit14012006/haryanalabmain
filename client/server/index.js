// imports
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const port = 3001;
const {
  getAllUsers,
  addUser,
  deleteUser,
  updateUser,
  getUsersByName,
  getUsersByDate,
  addUserByDebit,
  addUserByCredit,
  deleteUserByCredit,
  deleteUserByDebit,
  getByCity,
  getCustomerByLocation
} = require("./controller/userController");
const cashVoucherController = require("./controller/cashVoucherController");
const customerController = require("./controller/customerController");
const analysisController = require("./controller/analysisController");
const {
  setItem,
  getItem,
  updateItem,
  DeleteItem,
} = require("./controller/Item");
const {
  setCity,
  getCity,
  deleteCity,
  updateCity,
} = require("./controller/MasterCity");

//Multer Work
const { saveImage } = require("./controller/imageController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.use(express.static("uploads"));

//Api's
app.get("/api/users", getAllUsers);
app.post("/api/users/Debit", addUserByDebit);
app.post("/api/users/Credit", addUserByCredit);
app.delete("/api/users/:Date/:Reportno/:PartyName", deleteUser);
app.delete("/api/users/:Date/:Credit/:PartyName", deleteUserByCredit);
app.delete("/api/users/:Date/:Debit/:PartyName", deleteUserByDebit);
app.put("/api/users/:id", updateUser);
app.get("/api/users/:name", getUsersByName);
app.get("/api/usersDate/:fromDate/:toDate", getUsersByDate);
app.post("/api/usersFindData", getByCity);
app.post("/api/usersFindDataByCity", getCustomerByLocation);
//Customer Api's
app.get("/api/customers", customerController.getAllCustomers);
app.get("/api/customersPartyName", customerController.getCustomersPartyName);
app.post("/api/customers", customerController.createCustomer);
app.get("/api/customersbyname", customerController.databyname);
app.put("/api/customers/:Partyid", customerController.updateCustomer);
app.delete("/api/customers/:Partyid", customerController.deleteCustomer);

//Cashvouchers Api's
app.post("/api/cashvoucher", cashVoucherController.createCashVoucher);
app.get("/api/cashvouchers", cashVoucherController.getCashVouchers);

//Analysis Api's
app.post("/api/analysis", analysisController.createAnalysis);
app.get("/api/analysis/:Reportno", analysisController.getAnalysis);
app.get("/api/analysis", analysisController.getAnalysisnormal);
app.get("/api/analysises/:from", analysisController.getRepNo);
app.put("/api/analysis/:Reportno", analysisController.updateAnalysis);
app.post("/api/analysisDate", analysisController.getReportByDate);
app.post("/api/analysisPartyname", analysisController.getReportByPartyname);
app.post("/api/analysisEverything", analysisController.getReportSByEverything);

// Image Upload Route
app.post("/upload", upload.single("image"), saveImage);

// Item Routes
app.get("/api/Item", getItem);
app.post("/api/Item", setItem);
app.put("/api/Item", updateItem);
app.delete("/api/Item/?:id", DeleteItem);

//City Routes
app.get("/api/mastercity", getCity);
app.post("/api/mastercity", setCity);
app.put("/api/mastercity", updateCity);
app.delete("/api/mastercity/:id", deleteCity);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
