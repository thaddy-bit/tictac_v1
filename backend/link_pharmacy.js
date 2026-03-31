const db = require('./config/database');
require('dotenv').config();

async function linkPharmacy() {
  try {
    const phone = '+242065555555';
    // 1. Get user id
    const rows = await db.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (!rows || rows.length === 0) {
      console.error('User not found:', phone);
      process.exit(1);
    }
    const userId = rows[0].id;

    // 2. Check if pharmacy already exists
    const existing = await db.query('SELECT id FROM pharmacies WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      console.log('Pharmacy already linked to user:', userId);
    } else {
      // 3. Create pharmacy entry
      await db.query(
        `INSERT INTO pharmacies (user_id, name, address, phone, latitude, longitude, type, is_active) 
         VALUES (?, 'Pharmacie Centrale de Test', 'Avenue de la Paix, Brazzaville', ?, -4.2634, 15.2832, 'mixte', TRUE)`,
        [userId, phone]
      );
      console.log('Successfully created and linked pharmacy for user:', userId);
    }
  } catch (err) {
    console.error('Failed to link pharmacy:', err);
  } finally {
    process.exit();
  }
}

linkPharmacy();
