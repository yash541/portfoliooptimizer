from flask import Flask, render_template
from flask import request
from flask_restful import Resource, Api
from flask_cors import CORS
import optimizer

def create_app():
	app = Flask(__name__,static_folder='static',template_folder='templates')
	return app

app = create_app()
api = Api(app)
CORS(app)

class portfolio(Resource):
    def get(self):
        #ticker_list = "FB GOOGL"
        data = dict()
        if request.args.get("tickers") and len(request.args.get("tickers").split()) >= 2:
            ticker_list = request.args.get("tickers")
            app.logger.info(ticker_list.split())
            minRisk, maxReturn, df = optimizer.optimize(ticker_list)
            data["minRisk"] = minRisk
            data["maxReturn"] = maxReturn
            data["df"] = df.to_json(orient='split')
        else:
            data["Error"] = "No portfolio provided"
        app.logger.info(data)
        return data

api.add_resource(portfolio, '/api/portfolio')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8090)
