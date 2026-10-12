import os
os.environ['JWT_SECRET']='test-only-secret-with-at-least-32-characters'
import mongomock
import pytest
import app as module
from datetime import date, timedelta

@pytest.fixture()
def setup():
    module.db=mongomock.MongoClient().test
    module.init_db()
    c=module.app.test_client()
    headers={}
    for role in ['owner','customer']:
        c.post('/api/auth/register',json={'name':role,'email':role+'@test.com','password':'Password123!','role':role})
        r=c.post('/api/auth/login',json={'email':role+'@test.com','password':'Password123!'})
        headers[role]={'Authorization':'Bearer '+r.json['token']}
    v={'name':'Test Car','brand':'Test','category':'Car','fuel':'Petrol','transmission':'Manual','city':'Chennai','registration':'TEST01','price':1000,'seats':5,'description':'','image':'','available':True}
    r=c.post('/api/vehicles',json=v,headers=headers['owner']); assert r.status_code==201
    return c,headers,r.json

def booking(v,offset=2):
    return {'vehicle_id':v['_id'],'start':(date.today()+timedelta(days=offset)).isoformat(),'end':(date.today()+timedelta(days=offset+3)).isoformat(),'total':1}

def test_rental_flow(setup):
    c,h,v=setup
    r=c.post('/api/bookings',json=booking(v),headers=h['customer']); assert r.status_code==201 and r.json['total']==3000
    bid=r.json['_id']
    assert c.post('/api/bookings',json=booking(v),headers=h['customer']).status_code==409
    assert c.delete('/api/vehicles/'+v['_id'],headers=h['owner']).status_code==409
    assert c.patch('/api/bookings/'+bid,json={'status':'completed'},headers=h['owner']).status_code==409
    assert c.patch('/api/bookings/'+bid,json={'status':'confirmed'},headers=h['owner']).status_code==200
    assert c.patch('/api/bookings/'+bid,json={'status':'cancelled'},headers=h['customer']).status_code==200
    assert c.post('/api/bookings',json=booking(v),headers=h['customer']).status_code==201

def test_permissions_and_search(setup):
    c,h,v=setup
    assert c.delete('/api/vehicles/'+v['_id'],headers=h['customer']).status_code==403
    assert c.post('/api/bookings',json=booking(v),headers=h['owner']).status_code==403
    assert c.get('/api/bookings').status_code==401
    assert len(c.get('/api/vehicles?q=Test&city=Chennai&max_price=1000').json)==1
    assert c.get('/api/vehicles?max_price=500').json==[]
    c.post('/api/auth/register',json={'name':'Other','email':'other@test.com','password':'Password123!','role':'owner'})
    other=c.post('/api/auth/login',json={'email':'other@test.com','password':'Password123!'}).json['token']
    assert c.put('/api/vehicles/'+v['_id'],json=v,headers={'Authorization':'Bearer '+other}).status_code==404

def test_dates_and_crud(setup):
    c,h,v=setup
    d=booking(v); d['end']=d['start']
    assert c.post('/api/bookings',json=d,headers=h['customer']).status_code==400
    v['price']=1600
    assert c.put('/api/vehicles/'+v['_id'],json=v,headers=h['owner']).json['price']==1600
    assert c.delete('/api/vehicles/'+v['_id'],headers=h['owner']).status_code==200
    assert c.get('/api/vehicles/'+v['_id']).status_code==404

def test_availability_and_adjacent_dates(setup):
    c,h,v=setup
    d=booking(v)
    assert c.post('/api/bookings',json=d,headers=h['customer']).status_code==201
    assert c.get('/api/vehicles',query_string={'start':d['start'],'end':d['end']}).json==[]
    assert c.post('/api/bookings',json=booking(v,5),headers=h['customer']).status_code==201
    assert c.get('/api/vehicles?start=invalid&end=invalid').status_code==400
