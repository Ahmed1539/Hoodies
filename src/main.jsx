import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Minus, Plus, ShoppingBag, X, Check, Instagram } from "lucide-react";
import "./styles.css";

const products = [
  { id: 1, name: "The Essential Hoodie", category: "Core collection", price: 1290, color: "Oatmeal", tone: "#c8bca8", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1100&q=85", tag: "BESTSELLER" },
  { id: 2, name: "The Everyday Hoodie", category: "Core collection", price: 1390, color: "Forest", tone: "#596557", image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1100&q=85", tag: "NEW ARRIVAL" },
  { id: 3, name: "The Heavyweight", category: "Studio edition", price: 1590, color: "Charcoal", tone: "#42413e", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1100&q=85", tag: "PREMIUM WEIGHT" },
  { id: 4, name: "The Weekend Hoodie", category: "Core collection", price: 1290, color: "Stone", tone: "#aaa49a", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1100&q=85", tag: "LIMITED DROP" }
];
const money = n => new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n);

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [size, setSize] = useState("M");
  const [quickProduct, setQuickProduct] = useState(null);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function addToCart(product, chosenSize = size) {
    setCart(current => {
      const key = `${product.id}-${chosenSize}`;
      const found = current.find(item => item.key === key);
      return found ? current.map(item => item.key === key ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...product, key, size: chosenSize, qty: 1 }];
    });
    setNotice(`${product.name} added to your bag`);
    setTimeout(() => setNotice(""), 2600);
    setQuickProduct(null);
    setCartOpen(true);
  }
  function updateQty(key, delta) {
    setCart(current => current.map(item => item.key === key ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0));
  }

  async function checkout() {
    if (!cart.length) return;
    try {
      const response = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(({ id, name, price, size, qty }) => ({ id, name, price, size, qty })), total: subtotal })
      });
      if (!response.ok) throw new Error("Checkout service unavailable");
      const result = await response.json();
      setNotice(`Order ${result.orderId} received — we’ll be in touch.`);
      setCart([]); setCartOpen(false);
    } catch {
      setNotice("Demo checkout: connect a payment provider to accept live orders.");
    }
    setTimeout(() => setNotice(""), 4200);
  }

  return <div className="site-shell">
    <div className="announcement">COMPLIMENTARY DELIVERY ON ORDERS OVER EGP 2,500 <span>✳</span> MADE FOR THE COLDER DAYS</div>
    <header className="header">
      <button className="icon-button mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
      <nav className={`nav-left ${mobileOpen ? "nav-open" : ""}`}><a href="#collection" onClick={() => setMobileOpen(false)}>SHOP</a><a href="#story" onClick={() => setMobileOpen(false)}>OUR STORY</a><a href="#details" onClick={() => setMobileOpen(false)}>THE DETAILS</a></nav>
      <a className="wordmark" href="#">NORTHLINE<span>®</span></a>
      <div className="nav-right"><span className="currency">EG / EGP</span><button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>BAG</span><b>{count}</b></button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line"/> THE WINTER EDIT · 2026</p>
          <h1>Winter,<br/><em>considered.</em></h1>
          <p className="hero-sub">A softer kind of statement. Thoughtfully made hoodies for the days that ask for a little more comfort.</p>
          <a className="dark-button" href="#collection">DISCOVER THE COLLECTION <ArrowUpRight size={16}/></a>
          <div className="hero-note"><span>01 / 04</span><span>EVERYDAY, ELEVATED</span></div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1500&q=90" alt="Minimal neutral hoodie styled for winter"/>
          <div className="image-caption"><span>THE ESSENTIAL HOODIE</span><span>01 — 04</span></div>
          <div className="vertical-note">DESIGNED TO LIVE IN · EST. 2026</div>
        </div>
        <div className="hero-bottom"><span>BUILT FOR THE IN-BETWEEN</span><ArrowDown size={15}/><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="intro-strip" id="story">
        <span className="section-index">A NOTE ON COMFORT / 001</span>
        <p>Not just another layer.<br/><em>Your new everyday uniform.</em></p>
        <span className="intro-aside">Quiet design. Considered details.<br/>Comfort that stays with you.</span>
      </section>

      <section className="collection section-pad" id="collection">
        <div className="section-heading"><div><p className="eyebrow">THE LINEUP · 2026</p><h2>Meet your <em>new layers.</em></h2></div><a className="text-link" href="#details">WHY NORTHLINE <ArrowUpRight size={15}/></a></div>
        <div className="product-grid">
          {products.map((p, i) => <article className="product-card" key={p.id}>
            <button className="product-image" onClick={() => setQuickProduct(p)} aria-label={`View ${p.name}`}>
              <img src={p.image} alt={p.name}/>
              <span className="product-tag">{p.tag}</span><span className="quick-view">QUICK VIEW <ArrowUpRight size={13}/></span>
            </button>
            <div className="product-meta"><div><p className="product-category">{p.category}</p><h3>{p.name}</h3><span className="color-name"><i style={{background:p.tone}}/>{p.color}</span></div><strong>{money(p.price)}</strong></div>
          </article>)}
        </div>
      </section>

      <section className="manifesto" id="details">
        <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1300&q=85" alt="Close-up of carefully styled winter clothing"/></div>
        <div className="manifesto-copy"><p className="eyebrow">LESS, BUT BETTER · 002</p><h2>Made for the<br/><em>long way home.</em></h2><p>Clean silhouettes, a considered palette, and the kind of comfort you reach for without thinking. Northline is about making the everyday feel a little more intentional.</p><div className="feature-list"><div><span>01</span><b>COMFORT FIRST</b><small>Soft feel, easy movement.</small></div><div><span>02</span><b>BUILT TO LAST</b><small>Everyday pieces, made to repeat.</small></div><div><span>03</span><b>QUIETLY TIMELESS</b><small>Style beyond the season.</small></div></div><a className="text-link" href="#collection">FIND YOUR EVERYDAY <ArrowRight size={15}/></a></div>
      </section>

      <section className="quote-band"><span>“</span><p>Good things don't need<br/><em>to shout.</em></p><small>THE NORTHLINE POINT OF VIEW</small></section>

      <section className="newsletter"><div><p className="eyebrow">A LITTLE NOTE FROM US</p><h2>Stay in the <em>know.</em></h2><p>First access to new drops, seasonal edits, and thoughtful things.</p></div><form onSubmit={e => {e.preventDefault(); setNotice("You’re on the list. Welcome to Northline."); e.target.reset(); setTimeout(()=>setNotice(""),3000);}}><input type="email" required placeholder="Your email address" aria-label="Email address"/><button type="submit" aria-label="Subscribe"><ArrowRight/></button><small>By subscribing, you agree to receive Northline updates.</small></form></section>
    </main>

    <footer><div className="footer-top"><a className="wordmark footer-mark" href="#">NORTHLINE<span>®</span></a><p>Considered layers for colder days.</p><a className="back-top" href="#">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© 2026 NORTHLINE STUDIO</span><span>MADE FOR THE EVERYDAY</span><div><a href="#collection">SHOP</a><a href="#story">ABOUT</a><a href="mailto:hello@northline.example">CONTACT</a><a href="#"><Instagram size={14}/></a></div></div></footer>

    {cartOpen && <div className="overlay" onMouseDown={e => {if(e.target === e.currentTarget) setCartOpen(false);}}><aside className="cart-drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>
      {!cart.length ? <div className="empty-cart"><ShoppingBag size={30}/><p>Your bag is taking a quiet moment.</p><button className="dark-button" onClick={() => setCartOpen(false)}>CONTINUE SHOPPING <ArrowRight size={15}/></button></div> :
      <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.key}><img src={item.image} alt={item.name}/><div className="cart-item-info"><b>{item.name}</b><span>Size: {item.size} · {item.color}</span><strong>{money(item.price)}</strong><div className="qty"><button onClick={() => updateQty(item.key,-1)}><Minus size={12}/></button><span>{item.qty}</span><button onClick={() => updateQty(item.key,1)}><Plus size={12}/></button></div></div></div>)}</div><div className="cart-summary"><div><span>SUBTOTAL</span><b>{money(subtotal)}</b></div><small>Shipping calculated at checkout. Complimentary delivery over EGP 2,500.</small><button className="dark-button checkout" onClick={checkout}>CONTINUE TO CHECKOUT <ArrowRight size={15}/></button><p className="checkout-note">Secure checkout · Easy exchanges</p></div></>}
    </aside></div>}

    {quickProduct && <div className="overlay quick-overlay" onMouseDown={e => {if(e.target === e.currentTarget) setQuickProduct(null);}}><div className="quick-modal"><button className="icon-button quick-close" onClick={() => setQuickProduct(null)}><X/></button><img src={quickProduct.image} alt={quickProduct.name}/><div className="quick-info"><p className="eyebrow">{quickProduct.category}</p><h2>{quickProduct.name}</h2><b>{money(quickProduct.price)}</b><p>Everyday comfort, considered from the first layer to the last detail.</p><label>SELECT SIZE</label><div className="size-row">{["S","M","L","XL","XXL"].map(s => <button className={size===s?"selected":""} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div><button className="dark-button add-button" onClick={()=>addToCart(quickProduct,size)}>ADD TO BAG <ArrowRight size={15}/></button><small>Easy exchanges · Secure checkout</small></div></div></div>}
    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
