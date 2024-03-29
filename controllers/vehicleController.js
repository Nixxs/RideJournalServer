const Vehicle = require("../models/vehicle");
const { saveImage } = require("../utils/uploadManager");

const getVehicles = async ({limit, offset}) => {
    const data = await Vehicle.findAll({
        order: [["CreatedAt", "DESC"]],
        limit: limit,
        offset: offset
    });
    return data;
}

const getVehicle = async (id) => {
    const data = await Vehicle.findOne({where: {id: id}});
    return data;
}

const getVehicleIncludeAll = async (id) => {
    const data = await Vehicle.findOne({ where: { id: id }, include: { all: true }});
    return data;
}

const getVehiclesByUser = async (id) => {
    const data = await Vehicle.findAll({where: {userId: id}});
    return data;
}

const getVehiclesByType = async (type) => {
    const data = await Vehicle.findAll({where: {type: type}});
    return data;
}

const createVehicle = async (data, tokenUserId) => {
    // if ther user to be updated is not the same as the token user reject
    if (Number(data.userId) !== tokenUserId) {
        return 401;
    }

    const { image, ...vehicleData } = data;
    // if there is an image in the data to handle
    if (image){
        vehicleData.image = await saveImage(image, "vehicle");
    } else {
        vehicleData.image = "default.png";
    }

    const vehicle = await Vehicle.create(vehicleData);
    return vehicle;
}

const updateVehicle = async (id, data, tokenUserId) => {
    const vehicleOwnerData = await Vehicle.findOne({where: {id: id}});
    if (Number(vehicleOwnerData.userId) !== tokenUserId) {
        return 401;
    }

    const { image, ...vehicleData } = data;
    // if there is an image in the data to handle
    if (image){
        vehicleData.image = await saveImage(image, "vehicle");
    } 
    const vehicle = await Vehicle.update(vehicleData, {where: {id: id}});
    return vehicle;
}

const deleteVehicle = async (id, tokenUserId) => {
    // if the vehicle you are trying to delete is not yours reject
    const vehicleData = await Vehicle.findOne({where: {id: id}});
    if (Number(vehicleData.userId) !== tokenUserId) {
        return 401;
    }

    const vehicle = await Vehicle.destroy({where: {id: id}});
    return vehicle;
}

module.exports = {
    getVehicles,
    getVehicle,
    getVehicleIncludeAll,
    getVehiclesByUser,
    getVehiclesByType,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
