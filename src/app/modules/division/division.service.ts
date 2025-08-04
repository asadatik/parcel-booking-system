
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {

    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    const division = await Division.create(payload);

    return division
};

const getAllDivisions = async (query: Record<string, string>) => {
    const { page = 1, limit = 10, ...filters } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Division.countDocuments(filters);
    const divisions = await Division.find(filters)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    return {
        data: divisions,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};



const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division,
    }
};



const updateDivision = async (id: string, payload: Partial<IDivision>) => {

    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }

 

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    // if (payload.thumbnail && existingDivision.thumbnail) {
    //     await deleteImageFromCLoudinary(existingDivision.thumbnail)
    // }

    return updatedDivision

};

const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
};

export const DivisionService = {
    createDivision,
     getAllDivisions,
    updateDivision,
    deleteDivision,
    getSingleDivision
};
