import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import {
  invoiceUpdateBulk,
  invoiceClearBulk,
} from "../redux/invoiceUpdateSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const [bulkEditBtnState, setBulkEditBtnState] = useState(false);
  const [selectInvoice, setSelectInvoice] = useState(false);
  // State to get the list of selected invoice
  const [selectedInvoiceList, setSelectedInvoiceList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };

  const handleEditInvoicesClick = () => {
    if (!bulkEditBtnState) {
      setBulkEditBtnState(true);
    } else {
      dispatch(invoiceUpdateBulk(selectedInvoiceList));
      navigate("/edit-all");
    }
  };

  const handleCancelClick = () => {
    setBulkEditBtnState(!bulkEditBtnState);
  };

  useEffect(() => {
    dispatch(invoiceClearBulk());

    if (selectInvoice) {
      setSelectedInvoiceList([...invoiceList]);
    } else {
      setSelectedInvoiceList([]);
    }
  }, [selectInvoice]);

  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                {/* Button for Invoice Bulk Edit */}
                <Button
                  disabled={
                    bulkEditBtnState && selectedInvoiceList.length === 0
                      ? true
                      : false
                  }
                  variant="dark mb-2 mb-md-4"
                  onClick={handleEditInvoicesClick}
                >
                  {bulkEditBtnState ? "Edit Selected" : "Edit Invoices"}
                </Button>

                {/* Button to Cancel Edit */}
                {bulkEditBtnState && (
                  <Button
                    variant="danger mb-2 mb-md-4"
                    onClick={handleCancelClick}
                  >
                    Cancel Edit
                  </Button>
                )}

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th className={bulkEditBtnState ? "d-block" : "d-none"}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectInvoice}
                          onChange={() => setSelectInvoice((pre) => !pre)}
                        />{" "}
                        Select All
                      </label>
                    </th>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                      selectedInvoiceList={selectedInvoiceList}
                      setSelectedInvoiceList={setSelectedInvoiceList}
                      bulkEditBtnState={bulkEditBtnState}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({
  invoice,
  navigate,
  selectedInvoiceList,
  setSelectedInvoiceList,
  bulkEditBtnState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEditInvoicesClick = () => {
    setSelectedInvoiceList((prev) => {
      if (prev.includes(invoice)) {
        return prev.filter((ele) => ele !== invoice);
      } else {
        return [...prev, invoice];
      }
    });
  };

  return (
    <tr>
      <td className={bulkEditBtnState ? "d-block" : "d-none"}>
        <input
          type="checkbox"
          value={invoice}
          checked={selectedInvoiceList.includes(invoice)}
          onChange={() => handleEditInvoicesClick(invoice)}
          style={{ marginTop: "3px" }}
        />
      </td>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
