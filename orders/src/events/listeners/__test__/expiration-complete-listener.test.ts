import mongoose from 'mongoose';
import { OrderStatus, ExpirationCompleteEvent } from '@rxdtickets/common';
import { Message } from 'node-nats-streaming';

import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sdafsa',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};