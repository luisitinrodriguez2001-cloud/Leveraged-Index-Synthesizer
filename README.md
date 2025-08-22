# Levered Index Synthesizer

This tool builds a synthetic leveraged index series from historical daily closes of an underlying index ETF and compares it with an optional actual leveraged ETF. The application runs entirely in the browser using data from [Alpha Vantage](https://www.alphavantage.co/).

## Methodology

### 1. Data acquisition
* The chosen index symbol is mapped to a tradeable ETF (e.g., `^SPX` → `SPY`) so that real, dividend‑adjusted prices are used.
* Daily OHLC data is fetched from Alpha Vantage (`TIME_SERIES_DAILY`) and parsed to obtain the adjusted close for each date.
* When a real 3× ETF symbol is supplied, a second request retrieves its historical prices for comparison.

### 2. Daily return and synthetic series construction
For each trading day the following steps are performed.  The synthetic portfolio starts at **$1** on the first date.

1. **Index return**
   \[
   r_t = \frac{P_t}{P_{t-1}} - 1
   \]
   where `P_t` is the adjusted close on day *t*.
2. **Pre‑fee leveraged return**
   \[
   r^{\text{pre}}_t = L \times r_t
   \]
   with `L` equal to the chosen leverage factor (e.g., 3).
3. **Daily fee**
   The annual expense ratio `a` is converted to a daily fee using 252 trading days:
   \[
   f = 1 - (1 - a)^{1/252}
   \]
4. **Post‑fee leveraged return**
   After applying the fee and any extra daily drag `d`:
   \[
   r^{\text{post}}_t = (1 + r^{\text{pre}}_t)(1 - f) - 1 - d
   \]
5. **Compound value**
   The portfolio value evolves as
   \[
   V_t = V_{t-1}\,(1 + r^{\text{post}}_t)
   \]
   If a daily move would drive the value to zero or below, the series is clamped at zero thereafter.

Each row of the resulting data set contains the date, index price, daily index return, daily post‑fee leveraged return, and the cumulative leveraged value `V_t`.

### 3. Rolling CAGR statistics
For a window of `y` years (5, 10, 15, 20, and 30 by default):

1. Starting at every possible date, find the first row at or beyond `start + y` years.
2. Compute the compound annual growth rate for the index and the synthetic series:
   \[
   \text{CAGR} = \left(\frac{V_{\text{end}}}{V_{\text{start}}}\right)^{1/y} - 1
   \]
3. Collect all such CAGRs.  The table shows their arithmetic mean and sample standard deviation (uses `N-1` in the denominator).
4. When actual 3× ETF data is available, the same process is performed on its price series for comparison.

### 4. Rolling CAGR chart
A chart visualises the CAGRs for every start date:

1. A dropdown lets the user choose the window length (1–30 years).
2. For the selected window, the tool builds time series of rolling CAGRs for the index, synthetic leveraged series, and, if provided, the real 3× ETF.
3. Lines are plotted with different colours using [Chart.js](https://www.chartjs.org/); gaps occur where data is unavailable for a fund.

## Output
* **Summary table** – average and dispersion of rolling CAGRs.
* **Rolling CAGR chart** – coloured curves for each available fund.
* **CSV download** – date, index price, synthetic leveraged value, and daily returns.

## Running locally
This project is a static site. Open `index.html` in a browser and supply an Alpha Vantage API key.
