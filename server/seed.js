require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Route = require('./models/Route');
const Landmark = require('./models/Landmark');

const MODEL = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'; // placeholder .glb; replace with real monument models

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Route.deleteMany({}), Landmark.deleteMany({})]);
  await User.create({ name: 'Admin', email: 'admin@heritage.com', role: 'admin', password: await bcrypt.hash('admin123', 10) });

  const delhi = await Route.create({ name: 'Delhi Heritage Trail', city: 'Delhi', description: 'Mughal, Sultanate and colonial-era landmarks of Delhi.' });
  const jaipur = await Route.create({ name: 'Jaipur Royal Route', city: 'Jaipur', description: 'Rajput palaces and forts of the Pink City.' });

  await Landmark.insertMany([
    { route: delhi._id, order: 1, name: 'Red Fort', qrCode: 'HR-REDFORT', lat: 28.6562, lng: 77.2410,
      description: { en: 'Built by Mughal emperor Shah Jahan, the Red Fort (Lal Qila) served as the main residence of the Mughal emperors for nearly 200 years. Construction ran from 1638 to 1648. It is a UNESCO World Heritage Site.', hi: 'मुगल बादशाह शाहजहाँ द्वारा निर्मित लाल किला लगभग 200 वर्षों तक मुगल सम्राटों का मुख्य निवास रहा। इसका निर्माण 1638 से 1648 के बीच हुआ। यह यूनेस्को विश्व धरोहर स्थल है।' },
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Red_Fort_in_Delhi_03-2016_img3.jpg/800px-Red_Fort_in_Delhi_03-2016_img3.jpg'],
      modelUrl: MODEL,
      timeline: [{ year: '1638', event: 'Shah Jahan lays the foundation of the fort' }, { year: '1648', event: 'Construction completed' }, { year: '1857', event: 'Last Mughal emperor Bahadur Shah Zafar tried by the British here' }, { year: '1947', event: 'Indian flag hoisted on 15 August' }],
      character: { name: 'Shah Jahan', quote: 'Let this be the crown of my new capital, Shahjahanabad.' } },
    { route: delhi._id, order: 2, name: "Humayun's Tomb", qrCode: 'HR-HUMAYUN', lat: 28.5933, lng: 77.2507,
      description: { en: "Commissioned by Humayun's first wife, Empress Bega Begum, and completed around 1570-72, this was the first garden-tomb on the Indian subcontinent and inspired later Mughal architecture including the Taj Mahal. UNESCO World Heritage Site since 1993.", hi: 'हुमायूँ की पहली पत्नी बेगा बेगम द्वारा बनवाया गया और लगभग 1570-72 में पूर्ण हुआ यह मकबरा भारतीय उपमहाद्वीप का पहला उद्यान-मकबरा था। यह 1993 से यूनेस्को विश्व धरोहर है।' },
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Humayun%27s_Tomb_Delhi.jpg/800px-Humayun%27s_Tomb_Delhi.jpg'],
      modelUrl: MODEL,
      timeline: [{ year: '1556', event: 'Humayun dies' }, { year: '1565', event: 'Construction begins' }, { year: '1572', event: 'Tomb completed' }, { year: '1993', event: 'Declared UNESCO World Heritage Site' }],
      character: { name: 'Bega Begum', quote: 'A garden to rest the emperor, as paradise rests the faithful.' } },
    { route: delhi._id, order: 3, name: 'Qutub Minar', qrCode: 'HR-QUTUB', lat: 28.5245, lng: 77.1855,
      description: { en: 'Begun by Qutb ud-Din Aibak in 1199 and completed by his successors Iltutmish and later Firoz Shah Tughlaq, this 72.5 m minaret is one of the tallest brick minarets in the world. UNESCO World Heritage Site.', hi: 'कुतुबुद्दीन ऐबक ने 1199 में इसका निर्माण शुरू किया और इल्तुतमिश व बाद में फिरोज़ शाह तुगलक ने इसे पूरा किया। 72.5 मीटर ऊँची यह मीनार विश्व की सबसे ऊँची ईंट की मीनारों में से एक है।' },
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Qutb_Minar_Delhi.jpg/800px-Qutb_Minar_Delhi.jpg'],
      modelUrl: MODEL,
      timeline: [{ year: '1199', event: 'Qutb ud-Din Aibak begins construction' }, { year: '1220', event: 'Iltutmish adds further storeys' }, { year: '1368', event: 'Firoz Shah Tughlaq completes top storeys' }, { year: '1993', event: 'UNESCO World Heritage listing' }],
      character: { name: 'Qutb ud-Din Aibak', quote: 'Let its height proclaim the dawn of a new sultanate.' } },
    { route: jaipur._id, order: 1, name: 'Amber Fort', qrCode: 'HR-AMBER', lat: 26.9855, lng: 75.8513,
      description: { en: 'Begun by Raja Man Singh I in 1592 and expanded by Jai Singh I, Amber Fort blends Hindu and Mughal styles. It is part of the UNESCO-listed Hill Forts of Rajasthan.', hi: 'राजा मान सिंह प्रथम ने 1592 में इसका निर्माण शुरू किया और जय सिंह प्रथम ने इसका विस्तार किया। यह हिंदू और मुगल शैली का मिश्रण है।' },
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Amer_Fort_Jaipur.jpg/800px-Amer_Fort_Jaipur.jpg'],
      modelUrl: MODEL,
      timeline: [{ year: '1592', event: 'Raja Man Singh I begins construction' }, { year: '1727', event: 'Capital shifts to Jaipur under Sawai Jai Singh II' }, { year: '2013', event: 'Inscribed as UNESCO site (Hill Forts of Rajasthan)' }],
      character: { name: 'Raja Man Singh I', quote: 'From these ramparts, Amber watches over the Aravallis.' } },
    { route: jaipur._id, order: 2, name: 'Hawa Mahal', qrCode: 'HR-HAWA', lat: 26.9239, lng: 75.8267,
      description: { en: 'Built in 1799 by Maharaja Sawai Pratap Singh and designed by Lal Chand Ustad, the five-storey Hawa Mahal has 953 small windows (jharokhas) that let royal women watch street life unseen.', hi: '1799 में महाराजा सवाई प्रताप सिंह ने इसे बनवाया और लाल चंद उस्ताद ने डिज़ाइन किया। इसमें 953 झरोखे हैं।' },
      images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/800px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg'],
      modelUrl: MODEL,
      timeline: [{ year: '1799', event: 'Constructed by Maharaja Sawai Pratap Singh' }],
      character: { name: 'Maharaja Sawai Pratap Singh', quote: 'Let the palace breathe with the wind of Jaipur.' } },
  ]);
  console.log('Seeded. Admin: admin@heritage.com / admin123');
  process.exit(0);
})();