from flask import Flask, render_template, make_response
app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")
# Define your database models here

#Only runs in flask not gunicorn
if __name__ == '__main__':
    # Example of creating tables (if they don't exist)
    
    app.run(debug=True)