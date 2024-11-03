import express from "express";
import { verifyAccessToken } from "../middlewares/verifyAccess.js";
import { LiquidationContract } from "../models/LiquidationContract.js";
import { PawnContract } from "../models/PawnContract.js";
import { PawnItem } from "../models/PawnItem.js";
import { Trash } from "../models/Trash.js";

const Router = express.Router();

// Get all liquidation contracts
Router.get("/get-all-liquidation-contract", verifyAccessToken, async (req, res) => {
  try {
    const liquidationContracts = await LiquidationContract.find();
    const role = req.user.role; // Assuming req.user contains the user data with role
    const name = req.user.name;
    const email = req.user.email;
    res.render('liquidationContract/liquidationcontract', { liquidationContracts, role, name, email });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Get liquidation contract by ID
Router.get("/get-liquidation-contract-by-id/:id", verifyAccessToken, async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await LiquidationContract.findById(id).populate('creator');
    const role = req.user.role; // Assuming req.user contains the user data with role
    const name = req.user.name;
    const email = req.user.email;
    if (!contract) {
      return res.status(404).send('Hợp đồng không tìm thấy');
    }
    res.render('liquidationContract/detailliquidation', { contract, role, name, email });
  } catch (error) {
    res.status(500).send('Lỗi hệ thống');
  }
});

// Create a new liquidation contract
Router.post("/create-liquidation-contract/:pawnContractId", verifyAccessToken, async (req, res) => {
  try {
    const { pawnContractId } = req.params;
    const { customerName, phoneNumber, address, liquidationPrice } = req.body;

    // Tìm hợp đồng cầm đồ
    const pawnContract = await PawnContract.findById(pawnContractId);
    if (!pawnContract) {
      return res.status(404).json({ message: "Hợp đồng cầm đồ không tồn tại" });
    }

    // Tạo hợp đồng thanh lý mới
    const newLiquidationContract = new LiquidationContract({
      customerName,
      phoneNumber,
      address,
      liquidationPrice,
      pawnContract: pawnContract._id,
      assetType: pawnContract.assetType,
      assetName: pawnContract.assetName,
      assetCondition: pawnContract.assetCondition,
      creator: req.user.id, // Sử dụng req.user.id để lấy ID của người tạo
    });

    await newLiquidationContract.save();
    await PawnContract.findByIdAndUpdate(pawnContractId, { status: 'closed' });
    await PawnItem.findOneAndDelete({ pawnContract: pawnContractId });

    res.redirect('/api/v1/liquidationContract/get-all-liquidation-contract');
  } catch (error) {
    console.error(error); // Ghi lại lỗi ra console
    res.status(500).send('Internal Server Error');
  }
});
// Render page to create a liquidation contract
Router.get("/create-liquidation-contract/:pawnContractId", verifyAccessToken, async (req, res) => {
  const { pawnContractId } = req.params;

  try {
    const pawnContract = await PawnContract.findById(pawnContractId);
    
    if (!pawnContract) {
      return res.status(404).send('Hợp đồng cầm đồ không tồn tại');
    }

    // Lấy vai trò và các thông tin khác từ req.user
    const { role, name, email, _id: id } = req.user;

    // Truyền các biến vào template
    res.render('liquidationContract/createliquidation', {
      pawnContract,
      pawnContractId,
      role, // Truyền role vào template
      name, // Bạn có thể truyền thêm thông tin khác nếu cần
      email,
      id
    });
  } catch (error) {
    console.error("Error rendering create liquidation contract:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a liquidation contract
Router.delete("/delete-liquidation-contract/:id", verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await LiquidationContract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }

    await Trash.create({
      itemType: "LiquidationContract",
      itemId: contract._id,
      data: contract,
      deletedAt: new Date(),
      daysRemaining: 7,
    });

    await contract.remove();
    res.render('liquidationContract/deleteliquidation');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Fetch and delete liquidation contract (for client-side calls)
Router.get("/delete-liquidation-contract/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`/api/v1/liquidationContract/delete-liquidation-contract/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});

export default Router;
