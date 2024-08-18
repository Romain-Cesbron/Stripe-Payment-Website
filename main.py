from flask import Flask, jsonify, request, send_from_directory, redirect
import os
import stripe

stripe.api_key = "sk_test_51O9s5YFQVsrsfAiwGCaTP0y0lI8UREVzsCzXDuaOkdspvlm2gpS1ugb3Q2cq30OHsYHRgwxe14UJLe5hdbzoVYDd00JkWfBe5W"

app = Flask(__name__, static_folder='static')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({'message': 'Hello from Python!'})

@app.route('/api/create-customer', methods=['POST'])
def create_customer():
    data = request.json
    try:
        customer = stripe.Customer.create(
            name=data['name'],
            email=data['email']
        )
        return jsonify({'id': customer.id, 'message': 'Customer created successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

YOUR_DOMAIN = 'https://4ac28827-51c8-4fcc-9a7c-4a05d47adcc8-00-ezjvdjxy5hc.spock.replit.dev/'

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.json
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=data['items'],
            mode='payment',
            success_url=YOUR_DOMAIN + '/static/success.html',
            cancel_url=YOUR_DOMAIN + '/static/cancel.html',
            automatic_tax={'enabled': True},
        )
        return jsonify({'url': checkout_session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/panier-checkout', methods=['POST'])
def panier_checkout():
    data = request.json
    try:
        line_items = []
        for article in data:
            if article['quantity'] > 0:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': article['nom_article'],
                        },
                        'unit_amount': round(float(article['prix_article']) * 100),
                    },
                    'quantity': article['quantity'],
                })
        checkout_session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            success_url=YOUR_DOMAIN + '/static/success.html',
            cancel_url=YOUR_DOMAIN + '/static/cancel.html',
        )
        return jsonify({'url': checkout_session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
