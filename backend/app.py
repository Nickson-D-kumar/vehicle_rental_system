import os, re, uuid
from datetime import date, datetime, timedelta, timezone
from functools import wraps
from flask import Flask, request, jsonify, g
from pymongo import MongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import jwt

backend_dir = os.path.dirname(os.path.abspath(__file__))
env_file = os.path.join(backend_dir, '.env')
if os.path.exists(env_file):
    load_dotenv(env_file)
load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

try:
    from flask_cors import CORS
    CORS(app)
except Exception:
    pass

SECRET = os.environ.get('JWT_SECRET', '')
if len(SECRET) < 32:
    SECRET = 'roam_vehicle_rental_super_secure_jwt_secret_key_2026_99a8b7c6d5e4f3a2b1'
client = MongoClient(os.environ.get('MONGO_URI', 'mongodb+srv://nickson_d_kumar:Nick%2A123@nickson.egbyy6z.mongodb.net/?appName=Nickson'), serverSelectionTimeoutMS=5000)
db = client[os.environ.get('MONGO_DB', 'vehicle_rental')]

def init_db():
    db.users.create_index('email', unique=True)
    db.vehicles.create_index('registration', unique=True)
    db.vehicles.create_index('owner_id')
    db.bookings.create_index([('customer_id', 1), ('owner_id', 1)])

def uid(): return uuid.uuid4().hex

def fail(message, status=400):
    return jsonify(error=message), status

def body():
    value = request.get_json(silent=True)
    if not isinstance(value, dict): raise ValueError('A JSON object is required')
    return value

def text(data, key, minimum=1, maximum=200):
    val = data.get(key, '')
    if not isinstance(val, str) or not minimum <= len(val.strip()) <= maximum:
        raise ValueError(f'{key}: enter {minimum}–{maximum} characters')
    return val.strip()

def public_user(u): return {k: u.get(k, '') for k in ('_id','name','email','role','phone')}

def auth(role=None):
    def deco(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            try:
                token = request.headers.get('Authorization', '').removeprefix('Bearer ')
                payload = jwt.decode(token, SECRET, algorithms=['HS256'])
                g.user = db.users.find_one({'_id': payload['sub']})
                if not g.user: return fail('Please log in again', 401)
            except (jwt.InvalidTokenError, KeyError): return fail('Please log in', 401)
            if role and g.user['role'] != role: return fail('Access denied', 403)
            return fn(*args, **kwargs)
        return wrapped
    return deco

@app.errorhandler(ValueError)
def bad_input(e): return fail(str(e))

@app.errorhandler(DuplicateKeyError)
def duplicate(e): return fail('Email or vehicle registration already exists', 409)

@app.get('/api/health')
def health():
    client.admin.command('ping')
    return jsonify(status='ok', database='MongoDB')

@app.post('/api/auth/register')
def register():
    d = body(); email = text(d, 'email').lower(); password = text(d, 'password', 8, 128)
    if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email): raise ValueError('Invalid email')
    if d.get('role') not in ('customer','owner'): raise ValueError('Choose customer or owner')
    u = dict(_id=uid(), name=text(d,'name',2,80), email=email, password=generate_password_hash(password), role=d['role'], phone='')
    db.users.insert_one(u)
    return jsonify(user=public_user(u)), 201

@app.post('/api/auth/login')
def login():
    d = body(); u = db.users.find_one({'email': text(d,'email').lower()})
    if not u or not check_password_hash(u['password'], text(d,'password',1,128)): return fail('Invalid email or password',401)
    token = jwt.encode({'sub':u['_id'],'exp':datetime.now(timezone.utc)+timedelta(hours=8)},SECRET,algorithm='HS256')
    return jsonify(token=token,user=public_user(u))

@app.route('/api/profile', methods=['GET','PUT'])
@auth()
def profile():
    if request.method == 'PUT':
        d=body(); phone=text(d,'phone',0,10)
        if phone and not re.fullmatch('[6-9][0-9]{9}',phone): raise ValueError('Enter a valid 10-digit Indian mobile number')
        db.users.update_one({'_id':g.user['_id']},{'$set':{'name':text(d,'name',2,80),'phone':phone}})
    return jsonify(public_user(db.users.find_one({'_id':g.user['_id']})))

def vehicle_data(d):
    result = {k:text(d,k,1,100) for k in ('name','brand','city','registration')}
    result['registration']=result['registration'].upper()
    for k, choices in {'category':['Car','Bike','Scooter','SUV','Van'],'fuel':['Petrol','Diesel','Electric','Hybrid'],'transmission':['Manual','Automatic']}.items():
        if d.get(k) not in choices: raise ValueError(f'Invalid {k}')
        result[k]=d[k]
    for k, low, high in [('price',1,100000),('seats',1,20)]:
        try: val=float(d.get(k,0))
        except (TypeError,ValueError): raise ValueError(f'Invalid {k}')
        if not low<=val<=high or (k=='seats' and not val.is_integer()): raise ValueError(f'Invalid {k}')
        result[k]=int(round(val))
    result['description']=text(d,'description',0,2000)
    raw_img = d.get('image', '')
    if not isinstance(raw_img, str):
        raise ValueError('Invalid image format')
    raw_img = raw_img.strip()
    if raw_img:
        is_https = raw_img.startswith('https://')
        is_embedded = raw_img.startswith('data:image/')
        if not (is_https or is_embedded):
            raise ValueError('Image must be an HTTPS URL or an embedded image (data:image/...)')
        if len(raw_img) > 10 * 1024 * 1024:
            raise ValueError('Image size must be under 10MB')
    result['image'] = raw_img
    if not isinstance(d.get('available',True), bool): raise ValueError('Invalid availability')
    result['available']=d.get('available',True)
    return result

def clean_vehicle(v): return {k:val for k,val in v.items() if k not in ('reservations',)}

def dates(d):
    try: start=date.fromisoformat(d.get('start','')); end=date.fromisoformat(d.get('end',''))
    except (ValueError,TypeError): raise ValueError('Choose valid pickup and return dates')
    if start<date.today() or end<=start or (end-start).days>90: raise ValueError('Return must be after pickup, up to 90 days; pickup cannot be in the past')
    return start.isoformat(),end.isoformat(),(end-start).days

@app.get('/api/vehicles')
def vehicles():
    q={'deleted':False}
    for key in ('category','fuel','transmission'):
        if request.args.get(key): q[key]=request.args[key]
    for key in ('city','brand'):
        if request.args.get(key): q[key]={'$regex':re.escape(request.args[key]),'$options':'i'}
    if request.args.get('q'):
        q['$or']=[{k:{'$regex':re.escape(request.args['q']),'$options':'i'}} for k in ('name','brand','city')]
    if request.args.get('max_price'):
        try: q['price']={'$lte':int(request.args['max_price'])}
        except ValueError: raise ValueError('Invalid maximum price')
    if request.args.get('start') or request.args.get('end'):
        start,end,_=dates(request.args)
        q.update(available=True, reservations={'$not':{'$elemMatch':{'start':{'$lt':end},'end':{'$gt':start}}}})
    sort = {'price_asc':('price',1),'price_desc':('price',-1),'name':('name',1)}.get(request.args.get('sort'),('_id',-1))
    return jsonify([clean_vehicle(v) for v in db.vehicles.find(q).sort(*sort).limit(200)])

@app.get('/api/vehicles/<vid>')
def vehicle(vid):
    v=db.vehicles.find_one({'_id':vid,'deleted':False})
    return jsonify(clean_vehicle(v)) if v else fail('Vehicle not found',404)

@app.get('/api/owner/vehicles')
@auth('owner')
def own_vehicles(): return jsonify([clean_vehicle(v) for v in db.vehicles.find({'owner_id':g.user['_id'],'deleted':False})])

@app.post('/api/vehicles')
@auth('owner')
def add_vehicle():
    v=vehicle_data(body()); v.update(_id=uid(),owner_id=g.user['_id'],owner_name=g.user['name'],deleted=False,reservations=[])
    db.vehicles.insert_one(v)
    return jsonify(clean_vehicle(v)),201

@app.route('/api/vehicles/<vid>',methods=['PUT','DELETE'])
@auth('owner')
def modify_vehicle(vid):
    q={'_id':vid,'owner_id':g.user['_id'],'deleted':False}
    if request.method=='DELETE':
        # Atomic guard: deletion and booking acquisition cannot both succeed.
        result=db.vehicles.update_one({**q,'reservations':{'$size':0}},{'$set':{'deleted':True}})
        if not result.matched_count: return fail('Vehicle not found or has active bookings',409)
        return jsonify(message='Vehicle deleted')
    v=db.vehicles.find_one_and_update(q,{'$set':vehicle_data(body())},return_document=ReturnDocument.AFTER)
    return jsonify(clean_vehicle(v)) if v else fail('Vehicle not found',404)

@app.post('/api/bookings')
@auth('customer')
def book():
    d=body(); start,end,days=dates(d); vid=text(d,'vehicle_id'); bid=uid()
    reservation={'id':bid,'start':start,'end':end}
    # A single-document conditional write serializes competing reservations.
    v=db.vehicles.find_one_and_update({'_id':vid,'deleted':False,'available':True,'reservations':{'$not':{'$elemMatch':{'start':{'$lt':end},'end':{'$gt':start}}}}},{'$push':{'reservations':reservation}},return_document=ReturnDocument.AFTER)
    if not v: return fail('Vehicle unavailable for these dates',409)
    b=dict(_id=bid,vehicle_id=vid,vehicle_name=v['name'],owner_id=v['owner_id'],customer_id=g.user['_id'],customer_name=g.user['name'],customer_email=g.user['email'],start=start,end=end,days=days,daily_price=v['price'],total=days*v['price'],status='pending',created_at=datetime.now(timezone.utc).isoformat())
    try: db.bookings.insert_one(b)
    except Exception:
        db.vehicles.update_one({'_id':vid},{'$pull':{'reservations':{'id':bid}}})
        raise
    return jsonify(b),201

@app.get('/api/bookings')
@auth()
def bookings():
    field='owner_id' if g.user['role']=='owner' else 'customer_id'
    return jsonify(list(db.bookings.find({field:g.user['_id']}).sort('created_at',-1)))

@app.patch('/api/bookings/<bid>')
@auth()
def change_booking(bid):
    role=g.user['role']; field='owner_id' if role=='owner' else 'customer_id'
    b=db.bookings.find_one({'_id':bid,field:g.user['_id']})
    if not b: return fail('Booking not found',404)
    target=body().get('status')
    allowed={'pending':['confirmed','rejected'],'confirmed':['active'],'active':['completed']} if role=='owner' else {'pending':['cancelled'],'confirmed':['cancelled']}
    if target not in allowed.get(b['status'],[]): return fail('This status change is not allowed',409)
    if role=='customer' and b['start']<=date.today().isoformat(): return fail('Cancellation is allowed only before pickup day',409)
    if target=='active' and b['start']>date.today().isoformat(): return fail('Rental cannot start before pickup day',409)
    updated=db.bookings.find_one_and_update({'_id':bid,'status':b['status']},{'$set':{'status':target}},return_document=ReturnDocument.AFTER)
    if not updated: return fail('Booking changed; refresh and try again',409)
    if target in ('rejected','cancelled','completed'):
        db.vehicles.update_one({'_id':b['vehicle_id']},{'$pull':{'reservations':{'id':bid}}})
    return jsonify(updated)

if __name__=='__main__':
    init_db()
    app.run(host='127.0.0.1',port=int(os.getenv('PORT','5000')),debug=os.getenv('FLASK_DEBUG')=='1')
