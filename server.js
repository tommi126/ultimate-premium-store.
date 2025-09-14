const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_KEY');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const cors = require('cors');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products', express.static(path.join(__dirname, 'products')));
app.post('/create-checkout-session', bodyParser.json(), async (req, res) => {
  const { product_id } = req.body;
  const products = JSON.parse(fs.readFileSync(path.join(__dirname,'products','products.json'),'utf8'));
  const product = products.find(p=>p.id===product_id);
  if(!product) return res.status(400).json({error:'Invalid product'});
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price_data:{currency:'eur',product_data:{name:product.name,description:product.description},unit_amount:product.price_cents},quantity:1}],
      mode:'payment',
      success_url:`${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`${req.protocol}://${req.get('host')}/products/product_${product.id}.html`,
      metadata:{product_id:String(product.id)}
    });
    res.json({url:session.url});
  }catch(e){console.error(e);res.status(500).json({error:e.message});}
});
app.post('/webhook', bodyParser.raw({type:'application/json'}), (req, res)=>{ try{ const sig = req.headers['stripe-signature']; const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'; let event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret); if(event.type==='checkout.session.completed'){ const session = event.data.object; // you can handle post purchase here } res.json({received:true}); } catch(e){ console.error('Webhook error', e.message); res.status(400).send('Webhook error'); } });
app.get('/download', async (req, res)=>{ const session_id = req.query.session_id; if(!session_id) return res.status(400).send('Missing'); try{ const session = await stripe.checkout.sessions.retrieve(session_id); if(session.payment_status!=='paid') return res.status(403).send('Payment not completed'); const prodId = session.metadata && session.metadata.product_id ? session.metadata.product_id : '1'; const filePath = path.join(__dirname,'products',`product_${prodId}.zip`); return res.download(filePath); }catch(e){console.error(e);res.status(500).send('Server error');}});
app.get('/success.html',(req,res)=>{ res.send('<html><body><h2>Pagamento completato</h2><p>Controlla la tua email per il link di download.</p></body></html>'); });
const PORT = process.env.PORT || 3000; app.listen(PORT, ()=>console.log('Server running on port', PORT));