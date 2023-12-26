import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InvoiceListBulk } from "../redux/invoiceUpdateSlice";
import { updateAllInvoice } from "../redux/invoicesSlice";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
import { BiSolidPencil } from "react-icons/bi";

const InvoiceEditBulk = () => {
  const invoiceList = useSelector(InvoiceListBulk);
  const [invoiceData, setInvoiceData] = useState([...invoiceList]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateInvoice = () => {
    dispatch(updateAllInvoice(invoiceData));
    navigate("/");
  };

  return (
    invoiceData.length && (
      <>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 p-sm-3">
          <div className=" d-flex flex-row align-items-center justify-content-between ">
            <h3 className="fw-bold pb-2 pb-md-4 ">Edit Invoices</h3>
            <Button
              variant="primary mb-2 mb-md-4"
              className=" px-4"
              onClick={handleUpdateInvoice}
            >
              Update Invoices
            </Button>
          </div>
          <Table responsive bordered hover className=" text-center ">
            <thead>
              <tr>
                <th className="">Invoice No</th>
                <th>Due Date</th>
                <th>Bill-To Name</th>
                <th>Bill-T0 Email</th>
                <th>Bill-To Address</th>
                <th>Bill-From Name</th>
                <th>Bill-From Email</th>
                <th>Bill-From Address</th>
                <th>Items</th>
                <th>Currency</th>
                <th>Tax Rate</th>
                <th>Discount Rate</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((invoice, index) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  index={index}
                  invoiceData={invoiceData}
                  setInvoiceData={setInvoiceData}
                />
              ))}
            </tbody>
          </Table>
        </Card>
      </>
    )
  );
};

// Component to render invoice rows and edit/update data
const InvoiceRow = ({ invoice, index, invoiceData, setInvoiceData }) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const handleInputChange = (index, field, value) => {
    const updatedInvoiceData = [...invoiceData];

    updatedInvoiceData[index] = {
      ...updatedInvoiceData[index],
      [field]: value,
    };

    updatedInvoiceData[index] = handleCalculateTotal(updatedInvoiceData[index]);
    setInvoiceData(updatedInvoiceData);
  };

  const handleInputItem = (index, field, value) => {
    const updatedItems = [...invoiceItems];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setInvoiceItems(updatedItems);
  };

  const handleCalculateTotal = (invoice) => {
    let subTotal = 0;

    invoice.items.forEach((item) => {
      subTotal += parseFloat(item.itemPrice) * parseInt(item.itemQuantity);
    });

    const taxAmount = (subTotal * (invoice.taxRate / 100)).toFixed(2);
    const discountAmount = (subTotal * (invoice.discountRate / 100)).toFixed(2);
    const total = (
      subTotal -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);

    return {
      ...invoice,
      subTotal: subTotal.toFixed(2),
      taxAmount,
      discountAmount,
      total,
    };
  };

  const handleModalInvoiceSave = (id) => {
    let index = invoiceData.findIndex((invoice) => invoice.id === id);
    let invoices = [...invoiceData];

    invoices[index] = { ...invoices[index], items: invoiceItems };

    invoices[index] = handleCalculateTotal(invoices[index]);

    setInvoiceData(invoices);
    setDisplayModal(false);
    setInvoiceItems([]);
  };

  const handleAddItem = () => {
    const newItem = {
      itemId: invoiceItems.length,
      itemName: "",
      itemDescription: "",
      itemPrice: "",
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleModalInvoiceDelete = (id) => {
    let item = [...invoiceItems];
    item.splice(id, 1);
    setInvoiceItems(item);
  };

  return (
    <tr key={invoice.id}>
      <td className=" p-0 ">
        <Form.Control
          className=" text-center bg-white "
          type="text"
          value={invoice.invoiceNumber}
          name="invoiceNumber"
          onChange={(e) =>
            handleInputChange(index, "invoiceNumber", +e.target.value)
          }
          placeholder="invoice no"
          min="1"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          className=" text-center bg-white"
          type="date"
          value={invoice.dateOfIssue}
          name="dateOfIssue"
          onChange={(e) =>
            handleInputChange(index, "dateOfIssue", e.target.value)
          }
          required
        />
      </td>
      <td className="p-0">
        <Form.Control
          type="text"
          className=" text-center bg-white"
          value={invoice.billTo}
          name="billTo"
          onChange={(e) => handleInputChange(index, "billTo", e.target.value)}
          placeholder="name"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="email"
          className=" text-center bg-white"
          value={invoice.billToEmail}
          name="billToEmail"
          onChange={(e) =>
            handleInputChange(index, "billToEmail", e.target.value)
          }
          placeholder="email"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="text"
          className=" text-center bg-white"
          value={invoice.billToAddress}
          name="billToAddress"
          onChange={(e) =>
            handleInputChange(index, "billToAddress", e.target.value)
          }
          placeholder="address"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="text"
          className=" text-center bg-white"
          value={invoice.billFrom}
          name="billFrom"
          onChange={(e) => handleInputChange(index, "billFrom", e.target.value)}
          required
          placeholder="name"
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="email"
          className=" text-center bg-white"
          value={invoice.billFromEmail}
          name="billFromEmail"
          onChange={(e) =>
            handleInputChange(index, "billFromEmail", e.target.value)
          }
          placeholder="email"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="text"
          className=" text-center bg-white"
          value={invoice.billFromAddress}
          name="billFromAddress"
          onChange={(e) =>
            handleInputChange(index, "billFromAddress", e.target.value)
          }
          placeholder="address"
          required
        />
      </td>
      <td className=" p-0 d-flex align-items-center px-2">
        <Form.Control
          type="text"
          className=" text-center bg-white"
          value={invoice.items.length}
          name="items"
          required
        />
        <Button
          variant="outline-primary"
          className=" p-1 "
          onClick={() => {
            setInvoiceItems(invoice.items);
            setDisplayModal(true);
          }}
        >
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
        <Modal show={displayModal}>
          <Modal.Header
            closeButton
            onClick={() => {
              setDisplayModal(false);
            }}
          >
            <Modal.Title>Invoice Items</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className=" d-flex gap-2 align-items-center justify-content-between ">
              <h5 className=" m-auto "> Name</h5>
              <h5 className=" m-auto ">Description</h5>
              <h5 className=" m-auto ">Quantity</h5>
              <h5 className=" m-auto ">Price</h5>
              <h5 className=" m-auto ">Actions</h5>
            </div>
            {invoiceItems.map((item, i) => (
              <div className=" d-flex gap-2 align-items-center mt-2 " key={i}>
                <Form.Control
                  style={{ border: "1px solid gainsboro" }}
                  type="text"
                  className=" text-center"
                  value={item.itemName}
                  name="itemName"
                  onChange={(e) =>
                    handleInputItem(i, "itemName", e.target.value)
                  }
                  placeholder="item name"
                  required
                />
                <Form.Control
                  style={{ border: "1px solid gainsboro" }}
                  type="text"
                  className=" text-center"
                  value={item.itemDescription}
                  name="itemDescription"
                  onChange={(e) =>
                    handleInputItem(i, "itemDescription", e.target.value)
                  }
                  placeholder="item description"
                  required
                />
                <Form.Control
                  style={{ border: "1px solid gainsboro" }}
                  type="number"
                  className=" text-center"
                  value={item.itemQuantity}
                  name="itemQuantity"
                  onChange={(e) =>
                    handleInputItem(i, "itemQuantity", e.target.value)
                  }
                  placeholder="item quantity"
                  required
                />
                <Form.Control
                  style={{ border: "1px solid gainsboro" }}
                  type="number"
                  className=" text-center"
                  value={item.itemPrice}
                  name="itemPrice"
                  onChange={(e) =>
                    handleInputItem(i, "itemPrice", e.target.value)
                  }
                  placeholder="item price"
                  required
                />
                <Button
                  variant="danger"
                  onClick={() => handleModalInvoiceDelete(i)}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  Delete
                </Button>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleAddItem}>
              Add Item
            </Button>
            <Button
              variant="primary"
              onClick={() => handleModalInvoiceSave(invoice.id)}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </td>
      <td className=" p-0">
        <Form.Select
          name="currency"
          value={invoice.currency}
          onChange={(e) => handleInputChange(index, "currency", e.target.value)}
          className="text-center rounded-0 "
          aria-label="Change Currency"
        >
          <option value="$">USD (United States Dollar)</option>
          <option value="£">GBP (British Pound Sterling)</option>
          <option value="¥">JPY (Japanese Yen)</option>
          <option value="$">CAD (Canadian Dollar)</option>
          <option value="$">AUD (Australian Dollar)</option>
          <option value="$">SGD (Singapore Dollar)</option>
          <option value="¥">CNY (Chinese Renminbi)</option>
          <option value="₿">BTC (Bitcoin)</option>
        </Form.Select>
      </td>
      <td className=" p-0">
        <Form.Control
          type="number"
          className=" text-center bg-white"
          value={invoice.taxRate}
          name="taxRate"
          onChange={(e) => handleInputChange(index, "taxRate", e.target.value)}
          placeholder="0.0 %"
          required
        />
      </td>
      <td className=" p-0">
        <Form.Control
          type="number"
          className=" text-center bg-white"
          value={invoice.discountRate}
          name="discountRate"
          onChange={(e) =>
            handleInputChange(index, "discountRate", e.target.value)
          }
          placeholder="0.0 %"
          required
        />
      </td>
    </tr>
  );
};

export default InvoiceEditBulk;
