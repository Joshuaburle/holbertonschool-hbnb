from flask import Flask
from flask_restx import Api
from app.api.v1 import namespaces as v1_namespaces

def create_app():
    app = Flask(__name__)
    api = Api(app, version='1.0', title='HBnB API', description='HBnB Application API', doc='/api/v1/')

    for ns in v1_namespaces:
        api.add_namespace(ns, path=f'/api/v1/{ns.name}')

    return app

app = create_app()
