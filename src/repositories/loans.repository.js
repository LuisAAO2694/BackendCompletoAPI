import Loan from '../models/Loan.js';

const createLoan = async (loanData) => {
    return await Loan.create(loanData);
};

const findAllLoans = async (filters = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [loans, total] = await Promise.all([
        Loan.find(filters).populate('user', 'name email').populate('product', 'name serialNumber').sort({ loanDate: -1 }).skip(skip).limit(limit),
        Loan.countDocuments(filters)
    ]);
    return { loans, total };
};

const findActiveLoans = async (page = 1, limit = 10) => {
    const filters = { status: 'activo' };
    return findAllLoans(filters, page, limit);
};

const findLoansByUser = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [loans, total] = await Promise.all([
        Loan.find({ user: userId }).populate('product', 'name serialNumber').sort({ loanDate: -1 }).skip(skip).limit(limit),
        Loan.countDocuments({ user: userId })
    ]);
    return { loans, total };
};

const findLoanById = async (id) => {
    return await Loan.findById(id).populate('user', 'name email').populate('product', 'name serialNumber');
};

const updateLoanStatus = async (id, status, actualReturnDate = null) => {
    return await Loan.findByIdAndUpdate(id, { status, actualReturnDate }, { new: true });
};

export default {
    createLoan,
    findAllLoans,
    findActiveLoans,
    findLoansByUser,
    findLoanById,
    updateLoanStatus
};
