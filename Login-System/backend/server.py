
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/getConnection', methods=["POST"])
def getConnection():
    print(request.get_json())
    response_string = "Server Connection : Successful"
    return jsonify(message=response_string)

# Run the server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5500)