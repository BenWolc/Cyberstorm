from flask import Flask
from flask import request
from flask import render_template
app = Flask(__name__)

context = ""

@app.route("/", methods=["GET", "POST"])
def hello_world():
    global context
    if request.method == 'POST':
        context += "\n\n\n\n" + request.form['query'] + "\n\n" + "sdf"
        return render_template('ai.html', text = context)
    else:
        return render_template('ai.html', text = context)




def other_func(input):
    return input