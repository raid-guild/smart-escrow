import { Address, BigInt, log } from '@graphprotocol/graph-ts';

import { WrappedInvoice } from '../generated/schema';
import { WrappedInvoice as WrappedInvoiceContract } from '../generated/templates/WrappedInvoice/WrappedInvoice';

class WrappedInvoiceObject {
  parent: Address;
  child: Address;
  smartInvoice: Address;
  token: Address;
  splitFactor: BigInt;
}

function fetchWrappedInvoiceInfo(
  address: Address,
): WrappedInvoiceObject | null {
  let invoiceInstance = WrappedInvoiceContract.bind(address);
  let invoiceObject = new WrappedInvoiceObject();

  let parent = invoiceInstance.try_parent();
  let child = invoiceInstance.try_child();
  let smartInvoice = invoiceInstance.try_invoice();
  let token = invoiceInstance.try_token();
  let splitFactor = invoiceInstance.try_splitFactor();

  if (!parent.reverted) {
    invoiceObject.parent = parent.value;
  }
  if (!child.reverted) {
    invoiceObject.child = child.value;
  }
  if (!smartInvoice.reverted) {
    invoiceObject.smartInvoice = smartInvoice.value;
  }
  if (!token.reverted) {
    invoiceObject.token = token.value;
  }
  if (!splitFactor.reverted) {
    invoiceObject.splitFactor = splitFactor.value;
  }

  return invoiceObject;
}

export function updateWrappedInvoiceInfo(
  address: Address,
  invoice: WrappedInvoice | null,
): WrappedInvoice {
  if (invoice == null) return null;
  let invoiceObject = fetchWrappedInvoiceInfo(address);
  log.info('Got details for invoice', [address.toHexString()]);

  invoice.token = invoiceObject.token;
  invoice.parent = invoiceObject.parent;
  invoice.child = invoiceObject.child;
  invoice.smartInvoice = invoiceObject.smartInvoice;
  invoice.splitFactor = invoiceObject.splitFactor;

  return invoice as WrappedInvoice;
}
