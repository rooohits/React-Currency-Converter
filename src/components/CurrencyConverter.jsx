import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";

const CurrencyConverter = () => {
  const [sourceValue, setSourceValue] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("INR");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [targetValue, setTargetValue] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      const hours = now.getHours() % 12 || 12;
      const minutes = ("0" + now.getMinutes()).slice(-2);
      const amOrPm = now.getHours() >= 12 ? "pm" : "am";
      const timeString = `${day} ${month},${hours}:${minutes}${amOrPm} UTC`;

      setCurrentDateTime(timeString);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`
        );
        const exchangeRates = response.data.rates;
        const targetExchangeRate = exchangeRates[targetCurrency];
        if (targetExchangeRate) {
          const convertedValue = (sourceValue / targetExchangeRate).toFixed(2);
          setTargetValue(convertedValue);
        } else {
          setTargetValue("Exchange rate not available");
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        setTargetValue("Error fetching data");
      }
    }

    if (sourceValue && sourceCurrency !== targetCurrency) {
      fetchExchangeRate();
    } else {
      setTargetValue(sourceValue); 
    }
  }, [sourceValue, sourceCurrency, targetCurrency]);

  const handleChange = (event) => {
    const { value, name } = event.target;

    switch (name) {
      case "sourceValue":
        setSourceValue(value);
        break;
      case "sourceCurrency":
        setSourceCurrency(value);
        break;
      case "targetCurrency":
        setTargetCurrency(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="cnt">
      <h1>Currency Converter</h1>
      <p>{currentDateTime} Disclaimer</p>

      <input
        type="number"
        name="sourceValue"
        value={sourceValue}
        onChange={handleChange}
        placeholder="Enter amount"
        className="input-field"
      />
      <select
        name="sourceCurrency"
        value={sourceCurrency}
        onChange={handleChange}
        className="select-field"
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="AED">AED</option>
        <option value="GBP">GBP</option>
        <option value="CAD">CAD</option>
        <option value="SGD">SGD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
        <option value="PKR">PKR</option>
        <option value="ZAR">ZAR</option>
        <option value="ALL">ALL</option>
      </select>
      <select
        name="targetCurrency"
        value={targetCurrency}
        onChange={handleChange}
        className="select-field"
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="AED">AED</option>
        <option value="GBP">GBP</option>
        <option value="CAD">CAD</option>
        <option value="SGD">SGD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
        <option value="PKR">PKR</option>
        <option value="ZAR">ZAR</option>
        <option value="ALL">ALL</option>
      </select>
      <p className="result">
        {targetValue} {targetCurrency}
      </p>
    </div>
  );
};

export default CurrencyConverter;
