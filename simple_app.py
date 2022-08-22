import optimizer

def main():
    tickers = "AAPL TSLA GOOGL"
    minR, maxR, df = optimizer.optimize(tickers)
    print(minR)
    print(maxR)
    print(df)

main()