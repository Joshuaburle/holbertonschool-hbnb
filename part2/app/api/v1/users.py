from flask_restx import Namespace, Resource, fields
from ...services import facade

api = Namespace("users", description="User operations")

user_model = api.model("User", {
    "id": fields.String(readonly=True),
    "first_name": fields.String(required=True),
    "last_name": fields.String(required=True),
    "email": fields.String(required=True),
})

user_create_model = api.model("UserCreate", {
    "first_name": fields.String(required=True),
    "last_name": fields.String(required=True),
    "email": fields.String(required=True),
})


@api.route("/")
class UserList(Resource):
    @api.expect(user_create_model, validate=True)
    @api.marshal_with(user_model, code=201)
    def post(self):
        """Create a new user"""
        try:
            return facade.create_user(api.payload), 201
        except ValueError as e:
            api.abort(400, str(e))


@api.route("/<string:user_id>")
class UserDetail(Resource):
    @api.marshal_with(user_model)
    def get(self, user_id):
        """Get a user by id"""
        try:
            return facade.get_user(user_id), 200
        except ValueError as e:
            api.abort(404, str(e))
