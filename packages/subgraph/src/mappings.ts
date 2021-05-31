import { log, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { WrappedInvoice, Withdraw, Disperse } from '../generated/schema';

import { LogNewWrappedInvoice as LogNewInvoiceEvent } from '../generated/WrappedInvoiceFactoryVersion00/WrappedInvoiceFactory';
import {
  Withdraw as WithdrawEvent,
  Disperse as DisperseEvent,
} from '../generated/templates/WrappedInvoice/WrappedInvoice';
import { WrappedInvoice as WrappedInvoiceTemplate } from '../generated/templates';
import { updateWrappedInvoiceInfo } from './helpers';

export function handleLogNewInvoice(event: LogNewInvoiceEvent): void {
  let wrappedInvoice = new WrappedInvoice(
    event.params.wrappedInvoice.toHexString(),
  );

  log.info('handleLogNewInvoice {}', [
    event.params.wrappedInvoice.toHexString(),
  ]);

  wrappedInvoice.factory = event.address;
  wrappedInvoice.createdAt = event.block.timestamp;
  wrappedInvoice.createdBy = event.transaction.from;
  wrappedInvoice.creationTx = event.transaction.hash;
  wrappedInvoice.network = dataSource.network();

  wrappedInvoice = updateWrappedInvoiceInfo(
    event.params.wrappedInvoice,
    wrappedInvoice,
  );
  wrappedInvoice.save();

  WrappedInvoiceTemplate.create(event.params.wrappedInvoice);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let withdraw = new Withdraw(event.logIndex.toHexString());
  withdraw.txHash = event.transaction.hash;
  withdraw.wrappedInvoice = event.address.toHexString();
  withdraw.token = event.params.token;
  withdraw.parentShare = event.params.parentShare;
  withdraw.childShare = event.params.childShare;
  withdraw.timestamp = event.block.timestamp;
  withdraw.save();
}

export function handleDisperse(event: DisperseEvent): void {
  let disperse = new Disperse(event.logIndex.toHexString());
  disperse.txHash = event.transaction.hash;
  disperse.wrappedInvoice = event.address.toHexString();
  disperse.token = event.params.token;
  disperse.parentShare = event.params.parentShare;
  disperse.amounts = event.params.amounts;
  disperse.fundees = event.params.fundees as Array<Bytes>;
  disperse.timestamp = event.block.timestamp;
  disperse.save();
}
