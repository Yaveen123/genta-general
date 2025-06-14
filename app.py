from flask import Flask, render_template, make_response
app = Flask(__name__)

@app.route('/')
def home():
    response = make_response(render_template("index.html"))
    response.headers['Content-Security-Policy'] = "script-src 'self' https://accounts.google.com/gsi/client https://accounts.google.com/gsi/; frame-src 'self' https://accounts.google.com/gsi/; connect-src 'self' https://genta-api.online https://accounts.google.com/gsi/;"
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
    return response

# Define your database models here

@app.route('/font-book')
def fontbook():
    response = make_response(render_template("font-book.html"))
    return response

@app.route('/app')
def appMain():
    response = make_response(render_template("app.html"))
    return response

#Only runs in flask not gunicorn
if __name__ == '__main__':
    # Example of creating tables (if they don't exist)
    #app.run(debug=True)
    app.run(debug=True, port=6969, host='localhost')

