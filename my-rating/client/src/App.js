import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // States for fields and data
  const [formData, setFormData] = useState({
    date: "",
    sourceCurrency: "",
    targetCurrency: "",
    amountInSourceCurrency: "",
  });

  const [currencyNames, setCurrencyNames] = useState({});
  const [conversionResult, setConversionResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all currency names on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getAllCurrencies");
        setCurrencyNames(response.data);
      } catch (err) {
        setError("Failed to fetch currency data.");
        console.error(err);
      }
    };

    fetchCurrencies();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/convert", {
        params: formData,
      });
      setConversionResult(response.data);
    } catch (err) {
      setError("Failed to fetch conversion data.");
      console.error(err);
    }
  };

  return (
      <div className="app-container">
        <header className="header">
          <h1 className="title">Convert Your Currencies Today</h1>
          <p className="description">
            Welcome to "Convert Your Currencies Today"! Easily convert currencies
            based on the latest exchange rates.
          </p>
        </header>

        <main className="main-content">
          <form onSubmit={handleSubmit} className="conversion-form">
            {/* Date Field */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                  required
              />
            </div>

            {/* Source Currency */}
            <div className="form-group">
              <label htmlFor="sourceCurrency" className="form-label">
                Source Currency
              </label>
              <select
                  id="sourceCurrency"
                  name="sourceCurrency"
                  value={formData.sourceCurrency}
                  onChange={handleChange}
                  className="form-select"
                  required
              >
                <option value="">Select source currency</option>
                {Object.entries(currencyNames).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                ))}
              </select>
            </div>

            {/* Target Currency */}
            <div className="form-group">
              <label htmlFor="targetCurrency" className="form-label">
                Target Currency
              </label>
              <select
                  id="targetCurrency"
                  name="targetCurrency"
                  value={formData.targetCurrency}
                  onChange={handleChange}
                  className="form-select"
                  required
              >
                <option value="">Select target currency</option>
                {Object.entries(currencyNames).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                ))}
              </select>
            </div>

            {/* Amount in Source Currency */}
            <div className="form-group">
              <label htmlFor="amountInSourceCurrency" className="form-label">
                Amount in Source Currency
              </label>
              <input
                  type="number"
                  id="amountInSourceCurrency"
                  name="amountInSourceCurrency"
                  value={formData.amountInSourceCurrency}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter amount"
                  required
              />
            </div>

            <button type="submit" className="submit-button">
              Convert
            </button>
          </form>

          {/* Display Conversion Result */}
          {conversionResult && (
              <div className="result-container">
                <p className="result-text">
                  {formData.amountInSourceCurrency} {conversionResult.sourceCurrencyName} is
                  equal to{" "}
                  <span className="result-amount">
                {conversionResult.amountInTargetCurrency.toFixed(2)}
              </span>{" "}
                  {conversionResult.targetCurrencyName}
                </p>
              </div>
          )}

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}
        </main>
      </div>
  );
}

export default App;
