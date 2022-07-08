import OrderModel from '../models/orderModel.js';

export const createOrder = async(req, res) =>{
  try {
    const {
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body

    const created = await OrderModel.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice: Number(shippingPrice),
      taxPrice: Number(taxPrice),
      totalPrice: Number(totalPrice)
    })

    if (created) return res.json(created)
    
    return res.status(400).json({message: 'Could not create order'})

  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error
    res.status(404).json({
      message : `Server Down===> ${m}`
    })
  }
}

export const orderDetails = async(req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate('user', 'name email');
    if (order) return res.json(order);
    return res.status(400).json({message: 'Order not found'})
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({
      message: `Server down===> ${m}`
    })
  }
}

export const orderPay = async(req, res)=>{
  try {

    const {status, id, update_time, payer:{email_address} } = req.body;

    const order = await OrderModel.findById(req.params.id);
    if (order){
      order.isPaid = true;
      order.paidAt = update_time || '';
      order.paymentResult.id = id || '';
      order.paymentResult.status = status || 'COMPLETE';
      order.paymentResult.email_address = email_address || '';
      order.paymentResult.update_time = update_time;
      const updatedOrder = await order.save();

      if (updatedOrder){
        res.json(order.paymentResult.status)
      } else{
        res.status(400).json({message: 'Could not update order'})
      }
    } else{
      res.status(400).json({message: 'Could not find or update order'})
    }

  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null:error
    res.status(404).json({
      message: `Server error===> ${m}`
    })
  }
}

export const myOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({user: req.user._id});
    if (orders){
      res.json(orders);
    } else {
      res.status(400).json({message: "We couldn't find orders"})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server error===> ${m}`})
  }
}


export const myOrderDelete = async(req, res) =>{
  try {
    const deletedOrder = await OrderModel.findByIdAndRemove({_id: req.params.id});
    if (deletedOrder){
      res.json(deletedOrder)
    } else{
      res.status(400).json({message: "Could not delete the order"})
    }
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(400).json({message: `Server Error===> ${m}`})
  }
}

export const allOrders = async(req, res) =>{
  try {
    const orders = await OrderModel.find({}).populate('user', 'name');
  if (orders) return res.json(orders);
  return res.status(400).json({message: "Could not find orders"});
  
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}

export const markOrderAsPaid = async(req, res)=>{
  try {

    const order = await OrderModel.findById(req.params.id);
    if (order){
      order.isDelivered = true;
      order.deliveredAt = new Date().toISOString();
      await order.save();
      return res.json('success')
    }
    return res.status(400).json({message: 'Could not find order'})
    
  } catch (error) {
    const m = process.env.NODE_ENV === 'production'? null : error;
    res.status(404).json({message: `Server Error===> ${m}`})
  }
}