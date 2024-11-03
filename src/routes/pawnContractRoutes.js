import express from "express";
import moment from "moment";
import mongoose from "mongoose";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { InterestRate } from "../models/InterestRate.js";
import { PawnContract } from "../models/PawnContract.js";
import { PawnItem } from "../models/PawnItem.js";
import { Trash } from "../models/Trash.js";
const Router = express.Router();

// Get all pawn contracts
Router.get("/get-all-pawn-contract", verifyAccessToken, async (req, res, next) => {
  try {
    const contracts = await PawnContract.find();
    const role = req.user.role; // Assuming req.user contains the user data with role
    const name = req.user.name;
    const email = req.user.email;
    const id = req.user._id;
    res.render("pawnContract/pawncontract", { contracts, role, name, email , id}); // Pass role to the view
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi lấy tất cả các hợp đồng."));
  }
});

// Get pawn contract by ID
Router.get("/get-pawn-contract-by-id/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await PawnContract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }

    const { role, name, email, _id } = req.user;
    res.render("pawnContract/detailpawn", { contract, role, name, email, userId: _id });
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi lấy hợp đồng theo ID."));
  }
});

// Create pawn contract
Router.post("/create-pawn-contract", verifyAccessToken, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lấy lãi suất cho loại tài sản
    const interestRate = await InterestRate.findOne({ assetType: req.body.assetType });
    if (!interestRate) {
      throw new Error("Không tìm thấy lãi suất cho loại tài sản đã chỉ định.");
    }

    // Lấy và tính toán ngày bắt đầu và kết thúc
    const startDate = moment(req.body.startDate || Date.now());
    const endDate = moment(req.body.endDate);
    const numberOfDays = endDate.diff(startDate, 'days');

    // Lấy số tiền gốc và tính toán lãi suất
    const principalAmount = Number(req.body.principalAmount);
    const rate = interestRate.rate; // lãi suất từ cơ sở dữ liệu
    const totalAmountDue = principalAmount + (principalAmount * rate * numberOfDays);
    const totalAmountCustomerNeedToPaid = totalAmountDue; // gán giá trị đã tính toán

    // Tạo một hợp đồng mới
    const contract = new PawnContract({
      ...req.body,
      creator: req.user.id,
      rate,
      totalAmountDue,
      totalAmountCustomerNeedToPaid // đảm bảo giá trị này được truyền vào
    });

    // Lưu hợp đồng mới vào cơ sở dữ liệu
    await contract.save({ session });

    // Tạo một PawnItem mới
    await PawnItem.create(
      [{
        pawnContract: contract._id,
        assetType: contract.assetType,
        assetName: contract.assetName,
        assetCondition: contract.assetCondition,
        status: contract.status,
        creator: contract.creator,
      }],
      { session }
    );

    // Cam kết giao dịch
    await session.commitTransaction();
    session.endSession();
    res.redirect("/api/v1/pawnContract/get-all-pawn-contract");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    next(new Error("Đã xảy ra lỗi khi tạo hợp đồng."));
  }
});


// Render create pawn contract page
Router.get("/create-pawn-contract", verifyAccessToken, async (req, res, next) => {
  try {
    const role = req.user.role; // Lấy vai trò người dùng
    const name = req.user.name; // Lấy tên người dùng
    const email = req.user.email; // Lấy email người dùng
    const id = req.user._id; // Lấy ID người dùng

    // Lấy lãi suất cho tất cả các loại tài sản
    const interestRates = await InterestRate.find(); // Lấy tất cả lãi suất
    const assetTypes = [...new Set(interestRates.map(rate => rate.assetType))]; // Lấy ra danh sách loại tài sản duy nhất từ lãi suất
    const interestRateMap = {}; // Tạo một đối tượng để ánh xạ lãi suất theo loại tài sản

    // Tạo ánh xạ loại tài sản với lãi suất
    interestRates.forEach(rate => {
      interestRateMap[rate.assetType] = rate.rate;
    });

    // Đảm bảo rằng bạn truyền biến role, assetTypes, interestRateMap vào view
    res.render("pawnContract/createpawn", { role, name, email, id, assetTypes, interestRateMap });
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi tạo hợp đồng cầm đồ."));
  }
});

// Update pawn contract
Router.patch("/update-pawn-contract/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const updatedData = req.body;
    const updatedContract = await PawnContract.findByIdAndUpdate(contractId, updatedData, { new: true });

    if (!updatedContract) {
      return res.status(404).send("Hợp đồng không tìm thấy");
    }
    res.redirect("/api/v1/pawnContract/get-all-pawn-contract");
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi cập nhật hợp đồng."));
  }
});

// Render update pawn contract page
Router.get("/update-pawn-contract/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await PawnContract.findById(id);

    if (!contract) {
      return res.status(404).render("error", { message: "Không tìm thấy hợp đồng" });
    }
    const role = req.user.role; // Get user role
    res.render("pawnContract/updatepawn", { contract, role }); // Pass role to the view
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi lấy trang cập nhật hợp đồng."));
  }
});

// Delete pawn contract
Router.delete("/delete-pawn-contract/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await PawnContract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }

    await Trash.create({
      itemType: "PawnContract",
      itemId: contract._id,
      data: contract,
      deletedAt: new Date(),
      daysRemaining: 7,
    });

    await contract.remove();
    res.render("pawnContract/deletepawn");
  } catch (error) {
    next(new Error("Đã xảy ra lỗi khi xóa hợp đồng."));
  }
});

// Fetch delete pawn contract (not usually necessary as the delete route already handles it)
Router.get("/delete-pawn-contract/:id", async (req, res) => {
  try {
    const response = await fetch(`/api/v1/pawnContract/delete-pawn-contract/${req.params.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
});

export default Router;
