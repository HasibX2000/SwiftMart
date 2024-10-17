// Import necessary dependencies
import React, { useState } from "react";
import { CreditCard, Paypal, Bank } from "react-bootstrap-icons";

// Define the PaymentForm component
// This component handles different payment methods and collects payment details
const PaymentForm = ({ onPaymentMethodChange, onPaymentDetailsChange }) => {
  // State for selected payment method and payment details
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
    bankName: "",
    accountNumber: "",
  });

  // Handle payment method change
  // This function updates the selected payment method and notifies the parent component
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    onPaymentMethodChange(method);
  };

  // Handle input changes for payment details
  // This function updates the payment details state and notifies the parent component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDetails = { ...paymentDetails, [name]: value };
    setPaymentDetails(updatedDetails);
    onPaymentDetailsChange(updatedDetails);
  };

  // Render payment method options (Credit Card, PayPal, Bank Transfer)
  // This function returns JSX for the payment method selection radio buttons
  const renderPaymentMethodOptions = () => (
    <div className="mb-4 space-y-2">
      {/* Credit Card option */}
      <label className="flex items-center space-x-3">
        <input
          type="radio"
          name="paymentMethod"
          value="credit_card"
          checked={paymentMethod === "credit_card"}
          onChange={() => handlePaymentMethodChange("credit_card")}
          className="h-4 w-4 text-primary"
        />
        <CreditCard className="text-gray-600" />
        <span>Credit Card</span>
      </label>
      {/* PayPal option */}
      <label className="flex items-center space-x-3">
        <input
          type="radio"
          name="paymentMethod"
          value="paypal"
          checked={paymentMethod === "paypal"}
          onChange={() => handlePaymentMethodChange("paypal")}
          className="h-4 w-4 text-primary"
        />
        <Paypal className="text-gray-600" />
        <span>PayPal</span>
      </label>
      {/* Bank Transfer option */}
      <label className="flex items-center space-x-3">
        <input
          type="radio"
          name="paymentMethod"
          value="bank_transfer"
          checked={paymentMethod === "bank_transfer"}
          onChange={() => handlePaymentMethodChange("bank_transfer")}
          className="h-4 w-4 text-primary"
        />
        <Bank className="text-gray-600" />
        <span>Bank Transfer</span>
      </label>
    </div>
  );

  // Render the appropriate payment form based on the selected payment method
  // This function returns JSX for the specific payment method form fields
  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "credit_card":
        return (
          <div className="space-y-4">
            {/* Credit card number input */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            {/* Cardholder name input */}
            <div>
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name on Card
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={paymentDetails.cardName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="John Doe"
              />
            </div>
            {/* Expiry date and CVV inputs */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="MM/YY"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="cvv"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        );
      case "paypal":
        return (
          <div>
            {/* PayPal email input */}
            <label
              htmlFor="paypalEmail"
              className="block text-sm font-medium text-gray-700"
            >
              PayPal Email
            </label>
            <input
              type="email"
              id="paypalEmail"
              name="paypalEmail"
              value={paymentDetails.paypalEmail}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="your@email.com"
            />
          </div>
        );
      case "bank_transfer":
        return (
          <div className="space-y-4">
            {/* Bank name input */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-sm font-medium text-gray-700"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={paymentDetails.bankName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Your Bank"
              />
            </div>
            {/* Account number input */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={paymentDetails.accountNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="1234567890"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render the complete payment form
  // This includes the payment method options and the specific payment form
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      {renderPaymentMethodOptions()}
      {renderPaymentForm()}
    </div>
  );
};

// Export the PaymentForm component for use in other parts of the application
export default PaymentForm;
