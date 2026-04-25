# KaoPalm Krabi Beta - Orange Web MVP

Web MVP แบบไม่มี OCR และไม่มี % น้ำมัน

## วิธีเปิดดูทันที
เปิดไฟล์ `index.html` ใน browser ได้เลย ระบบจะทำงานเป็น demo mode

## ต่อ Supabase จริง
1. สมัคร Supabase และสร้าง project
2. ไป SQL Editor แล้วรัน `supabase.sql`
3. ไป Storage สร้าง bucket ชื่อ `ticket-images`
4. เปิด `app.js` แล้วใส่:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
5. Deploy ขึ้น Vercel / Netlify

## Field ที่เก็บ
- ชื่อผู้ขาย
- ลาน/โรงงาน
- ราคาต่อกก.
- น้ำหนักรวม
- น้ำหนักสุทธิ
- อำเภอ
- วันที่ชั่ง
- เวลา
- รูปตั๋ว
- พิกัด lat/lng ถ้าผู้ใช้อนุญาต

## Kick off 30 วัน
- วัน 1–3: เก็บตั๋วจริง 30–50 ใบ
- วัน 4–7: Deploy และทดลองกับทีมภายใน
- สัปดาห์ 2: ทดลองกับชาวสวน 20 คน
- สัปดาห์ 3: เก็บ 100–200 รายการแรก
- สัปดาห์ 4: ปรับ UX และเริ่มแผนชวนลาน/โรงงาน
