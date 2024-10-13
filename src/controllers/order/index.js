const Joi = require("joi");

const BaseController = require('../base')
const OrderModel = require('../../models/order')
const CarsModel = require('../../models/cars')
const express = require('express');
const { authorize, checkRole } = require("../../middlewares/authorization");
const router = express.Router()

const order = new OrderModel();
const cars = new CarsModel();

const orderSchema = Joi.object({
    car_id: Joi.number().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    is_driver: Joi.boolean().required(),
})
  const paymentSchema = Joi.object({
    order_id: Joi.number().required(),
    amount: Joi.number().required(),
});
class OrderController extends BaseController {
  constructor(model) {
    super(model);
    router.get("/", this.getAll);
    router.post("/", this.validation(orderSchema), authorize, this.create);
    router.post("/payment", this.validation(paymentSchema), authorize, this.processPayment);
    // router.get("/:id", this.get);
    // router.put("/:id", this.validation(carSchema), authorize, checkRole(['admin']), this.update);
    // router.delete("/:id", this.delete);
  }

  create = async (req, res, next) => {
    try {
      const getCars = await cars.getOne(
        { where: { 
          id: req.body.car_id,
          isAvailable: true,
          isDriver: req.body.is_driver
        },
        select:{
          price: true
        }
      });

      if(!getCars) return next(new ValidationError("Car not found or is not available!"))
        
      const getLastOrderToday = await this.model.count({
        createdDt: {
          lte: new Date(),
        },
      });
      console.log(getLastOrderToday, new Date())
      const currentDate = new Date()
      const startTime = new Date(req.body.start_time)
      const endTime = new Date(req.body.end_time)
      const total = getCars.price * ((endTime - startTime) / 1000 / 60 / 60 / 24)
      const invNumber = `INV/${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}/${getLastOrderToday + 1}`

      const [result, carUpdate] = await this.model.transaction([
        this.model.set({
          order_no : invNumber,
          start_time: startTime,
          end_time: endTime,
          is_driver: req.body.is_driver,
          status: 'pending',
          is_expired: false,
          createdBy: req.user.fullname,
          updatedBy: req.user.fullname,
          total,
          cars:{
            connect:{
              id: req.body.car_id
            }
          },
          users:{
            connect:{
              id: req.user.id
            }
          }
        }),
        cars.update(req.body.car_id, { isAvailable: false })
      ])

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Order created successfully",
          data: result
        })
      );
    } catch (error) {
      return next(error);
    }
  };
  processPayment = async (req, res, next) => {
    try {
        const { order_id, amount } = req.body;

        // Cek apakah pesanan ada dan statusnya 'pending'
        const order = await this.model.findOne({
            where: { id: order_id, status: 'pending' }
        });

        if (!order) {
            return next(new ValidationError("Order not found or not pending!"));
        }

        // Cek apakah jumlah yang dibayarkan sesuai
        if (amount < order.total) {
            return next(new ValidationError("Insufficient payment amount!"));
        }

        // Proses pembayaran dan update status order
        const updatedOrder = await this.model.update(order_id, {
            status: 'paid', // atau status lain sesuai logika pembayaran
            paymentDate: new Date(), // Jika ingin menyimpan tanggal pembayaran
        });

        return res.status(200).json(
            this.apiSend({
                code: 200,
                status: "success",
                message: "Payment processed successfully",
                data: updatedOrder
            })
        );
    } catch (error) {
        return next(error);
    }
}
}

new OrderController(order);

module.exports = router;
  
