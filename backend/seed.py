"""Idempotent demo seed with embedded images. Does not delete or overwrite user accounts."""
import base64
from app import db, init_db, uid
from werkzeug.security import generate_password_hash

init_db()

for role in ['owner', 'customer']:
    email = f'{role}@roam.demo'
    if not db.users.find_one({'email': email}):
        db.users.insert_one({
            '_id': uid(),
            'name': f'Demo {role.title()}',
            'email': email,
            'password': generate_password_hash('DemoPass123!'),
            'role': role,
            'phone': ''
        })

owner = db.users.find_one({'email': 'owner@roam.demo'})

def make_svg_data(title, sub, c1, c2, bg1, bg2, is_two_wheeler=False):
    if is_two_wheeler:
        body = f'''
        <circle cx="170" cy="245" r="44" fill="none" stroke="#1f2c26" stroke-width="13"/>
        <circle cx="170" cy="245" r="26" fill="none" stroke="#cbd5e1" stroke-width="4"/>
        <circle cx="430" cy="245" r="44" fill="none" stroke="#1f2c26" stroke-width="13"/>
        <circle cx="430" cy="245" r="26" fill="none" stroke="#cbd5e1" stroke-width="4"/>
        <path d="M170,245 Q210,180 270,180 L310,245 L380,245 L415,160 L430,245" fill="none" stroke="{c1}" stroke-width="12" stroke-linecap="round"/>
        <path d="M150,225 Q160,165 240,165 L270,225 Z" fill="{c1}"/>
        <rect x="180" y="155" width="70" height="18" rx="7" fill="#1e293b"/>
        <path d="M380,140 Q410,135 425,185 L370,230 Z" fill="{c2}"/>
        '''
    else:
        body = f'''
        <path d="M100,230 Q100,180 145,175 L215,170 L275,105 Q290,95 320,95 L425,95 Q450,95 470,125 L510,175 Q535,185 535,230 L520,245 Q500,250 460,250 L120,250 Z" fill="{c1}"/>
        <path d="M280,110 L415,110 Q435,110 450,130 L480,170 L235,170 Z" fill="#e2e8f0" opacity="0.85"/>
        <circle cx="180" cy="250" r="44" fill="#1e2923"/>
        <circle cx="180" cy="250" r="24" fill="{c2}"/>
        <circle cx="435" cy="250" r="44" fill="#1e2923"/>
        <circle cx="435" cy="250" r="24" fill="{c2}"/>
        '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
      <defs>
        <linearGradient id="g_{title.replace(' ', '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="{bg1}"/>
          <stop offset="100%" stop-color="{bg2}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#g_{title.replace(' ', '_')})"/>
      <ellipse cx="300" cy="280" rx="220" ry="18" fill="#1e2923" opacity="0.18"/>
      {body}
      <text x="300" y="325" font-family="'DM Sans',sans-serif" font-weight="700" font-size="20" fill="#213e34" text-anchor="middle">{title} • {sub}</text>
    </svg>'''
    b64 = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    return f'data:image/svg+xml;base64,{b64}'

rows = [
    ('Maruti Swift', 'Maruti', 'Car', 'Petrol', 'Manual', 1500, 5, 'Chennai', make_svg_data('Maruti Swift', 'Hatchback', '#2d6a4f', '#85a957', '#e8f3ea', '#c9dfd0')),
    ('Hyundai Creta', 'Hyundai', 'SUV', 'Diesel', 'Automatic', 2800, 5, 'Chennai', make_svg_data('Hyundai Creta', 'Compact SUV', '#344e41', '#a3b18a', '#ede9df', '#d8d3c3')),
    ('Honda City', 'Honda', 'Car', 'Petrol', 'Automatic', 2400, 5, 'Bengaluru', make_svg_data('Honda City', 'Premium Sedan', '#213e34', '#cbd5e1', '#e2ece9', '#c1dad4')),
    ('Royal Enfield Classic', 'Royal Enfield', 'Bike', 'Petrol', 'Manual', 900, 2, 'Chennai', make_svg_data('Royal Enfield Classic', 'Classic 350', '#3b4d45', '#94a3b8', '#eaf0f2', '#cbdbe0', is_two_wheeler=True)),
    ('Honda Activa', 'Honda', 'Scooter', 'Petrol', 'Automatic', 450, 2, 'Coimbatore', make_svg_data('Honda Activa', 'Automatic Scooter', '#406253', '#85a957', '#ebf1f3', '#d0dde2', is_two_wheeler=True)),
    ('Tata Nexon EV', 'Tata', 'SUV', 'Electric', 'Automatic', 3200, 5, 'Bengaluru', make_svg_data('Tata Nexon EV', 'Electric SUV ⚡', '#0f766e', '#5eead4', '#dcfce7', '#bbf7d0')),
    ('Toyota Innova', 'Toyota', 'Van', 'Diesel', 'Manual', 3500, 7, 'Madurai', make_svg_data('Toyota Innova', '7-Seater MPV', '#334155', '#64748b', '#f1f5f9', '#cbd5e1')),
    ('Kia Seltos', 'Kia', 'SUV', 'Petrol', 'Automatic', 2900, 5, 'Coimbatore', make_svg_data('Kia Seltos', 'Dynamic SUV', '#854d0e', '#fbbf24', '#fef3c7', '#fde68a')),
    ('TVS iQube', 'TVS', 'Scooter', 'Electric', 'Automatic', 650, 2, 'Chennai', make_svg_data('TVS iQube', 'Smart Electric ⚡', '#0284c7', '#38bdf8', '#e0f2fe', '#bae6fd', is_two_wheeler=True))
]

for i, (name, brand, category, fuel, transmission, price, seats, city, img) in enumerate(rows, 1):
    reg = f'DEMO-{i:03}'
    existing = db.vehicles.find_one({'registration': reg})
    if not existing:
        db.vehicles.insert_one(dict(
            _id=uid(),
            name=name,
            brand=brand,
            category=category,
            fuel=fuel,
            transmission=transmission,
            price=price,
            seats=seats,
            city=city,
            registration=reg,
            owner_id=owner['_id'],
            owner_name=owner['name'],
            available=True,
            deleted=False,
            reservations=[],
            image=img,
            description=f'{name} available in {city}. Demo listing with clear daily pricing. Fuel and refundable deposits are not included in the rental price.'
        ))
    else:
        # Update with embedded image if empty or outdated
        db.vehicles.update_one({'registration': reg}, {'$set': {'image': img}})

print('Demo seed complete with embedded images stored in database.')
